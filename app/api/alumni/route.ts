import { AlumniSubmission, type AlumniSubmissionInput } from "@/app/lib/alumni";
import { getMongoConnection } from "@/app/lib/db";
import crypto from "crypto";

export const runtime = "nodejs";

const requiredFields: Array<keyof AlumniSubmissionInput> = [
  "name",
  "dateOfBirth",
  "motherName",
  "fatherName",
  "className",
  "honsMajorSubject",
  "session",
  "occupation",
  "email",
  "whatsapp",
  "presentAddress",
];

type SheetSync = {
  status: "synced" | "skipped" | "failed";
  message: string;
};

function clean(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function getCloudinaryConfig() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;

  if (cloudinaryUrl) {
    const parsed = new URL(cloudinaryUrl);

    return {
      cloudName: parsed.hostname,
      apiKey: decodeURIComponent(parsed.username),
      apiSecret: decodeURIComponent(parsed.password),
    };
  }

  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  };
}

function signCloudinaryParams(
  params: Record<string, string | number>,
  apiSecret: string,
) {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto.createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}

function hasUpload(file: FormDataEntryValue | null) {
  return file instanceof File && file.size > 0;
}

async function uploadPhoto(
  file: FormDataEntryValue | null,
  {
    folder = "gbm-alumni/passport-photos",
    label = "Photograph",
  }: {
    folder?: string;
    label?: string;
  } = {},
) {
  if (!(file instanceof File) || file.size === 0) {
    return undefined;
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error(`${label} must be smaller than 2 MB.`);
  }

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured on the server.");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const signature = signCloudinaryParams({ folder, timestamp }, apiSecret);
  const uploadForm = new FormData();

  uploadForm.append("file", file);
  uploadForm.append("folder", folder);
  uploadForm.append("timestamp", String(timestamp));
  uploadForm.append("api_key", apiKey);
  uploadForm.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: uploadForm,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Cloudinary photo upload failed.");
  }

  return {
    name: file.name,
    type: file.type,
    size: file.size,
    url: data.secure_url,
    publicId: data.public_id,
  };
}

async function syncGoogleSheet(
  payload: AlumniSubmissionInput,
): Promise<SheetSync> {
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!scriptUrl) {
    return {
      status: "skipped" as const,
      message:
        "Set GOOGLE_APPS_SCRIPT_URL to a Google Apps Script web app endpoint to append rows.",
    };
  }

  const response = await fetch(scriptUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sheetId: process.env.GOOGLE_SHEET_ID,
      submittedAt: new Date().toISOString(),
      ...payload,
      photo: payload.photo ? payload.photo.url : "",
      matriculationCertificate: payload.matriculationCertificate
        ? payload.matriculationCertificate.url
        : "",
      collegePassingCertificate: payload.collegePassingCertificate
        ? payload.collegePassingCertificate.url
        : "",
    }),
  });

  if (!response.ok) {
    throw new Error(`Google Sheets sync failed with ${response.status}.`);
  }

  return { status: "synced" as const, message: "Google Sheet updated." };
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const photoFile = formData.get("photo");
    const matriculationCertificateFile = formData.get(
      "matriculationCertificate",
    );
    const collegePassingCertificateFile = formData.get(
      "collegePassingCertificate",
    );
    const payload: AlumniSubmissionInput = {
      name: clean(formData.get("name")),
      dateOfBirth: clean(formData.get("dateOfBirth")),
      motherName: clean(formData.get("motherName")),
      fatherName: clean(formData.get("fatherName")),
      className: clean(formData.get("className")),
      honsMajorSubject: clean(formData.get("honsMajorSubject")),
      session: clean(formData.get("session")),
      occupation: clean(formData.get("occupation")),
      email: clean(formData.get("email")),
      whatsapp: clean(formData.get("whatsapp")),
      presentAddress: clean(formData.get("presentAddress")),
      achievements: clean(formData.get("achievements")),
    };

    const missing = requiredFields.filter((field) => !payload[field]);

    if (
      missing.length > 0 ||
      !hasUpload(photoFile) ||
      !hasUpload(matriculationCertificateFile) ||
      !hasUpload(collegePassingCertificateFile)
    ) {
      return Response.json(
        { ok: false, message: "Please complete all required fields." },
        { status: 400 },
      );
    }

    payload.photo = await uploadPhoto(photoFile, {
      label: "Passport photograph",
    });
    payload.matriculationCertificate = await uploadPhoto(
      matriculationCertificateFile,
      {
        folder: "gbm-alumni/certificates/matriculation",
        label: "Matriculation certificate",
      },
    );
    payload.collegePassingCertificate = await uploadPhoto(
      collegePassingCertificateFile,
      {
        folder: "gbm-alumni/certificates/college-passing",
        label: "College passing certificate",
      },
    );

    await getMongoConnection();

    let sheetSync: SheetSync;
    try {
      sheetSync = await syncGoogleSheet(payload);
    } catch (error) {
      sheetSync = {
        status: "failed",
        message:
          error instanceof Error
            ? error.message
            : "Google Sheets sync failed.",
      };
    }

    await AlumniSubmission.create({ ...payload, sheetSync });

    return Response.json({
      ok: true,
      message:
        sheetSync.status === "synced"
          ? "Registration submitted and spreadsheet updated."
          : "Registration submitted successfully.",
      sheetSync,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to submit registration.",
      },
      { status: 500 },
    );
  }
}
