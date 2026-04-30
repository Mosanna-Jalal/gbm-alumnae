import { AlumniSubmission, type AlumniSubmissionInput } from "@/app/lib/alumni";
import { getMongoConnection } from "@/app/lib/db";

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

async function readPhoto(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) {
    return undefined;
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error("Photograph must be smaller than 2 MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  return {
    name: file.name,
    type: file.type,
    size: file.size,
    dataUrl: `data:${file.type};base64,${buffer.toString("base64")}`,
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
      photo: payload.photo
        ? `${payload.photo.name} (${Math.round(payload.photo.size / 1024)} KB)`
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
      photo: await readPhoto(formData.get("photo")),
    };

    const missing = requiredFields.filter((field) => !payload[field]);

    if (missing.length > 0) {
      return Response.json(
        { ok: false, message: "Please complete all required fields." },
        { status: 400 },
      );
    }

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
