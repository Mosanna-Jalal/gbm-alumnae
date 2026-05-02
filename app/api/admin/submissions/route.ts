import { AlumniSubmission } from "@/app/lib/alumni";
import { getMongoConnection } from "@/app/lib/db";

export const runtime = "nodejs";

type AdminRequest = {
  password?: string;
};

function isAuthorized(password: string | undefined) {
  return password === (process.env.ADMIN_PASSWORD || "theycallmemj");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AdminRequest;

    if (!isAuthorized(body.password)) {
      return Response.json(
        { ok: false, message: "Invalid admin password." },
        { status: 401 },
      );
    }

    await getMongoConnection();

    const submissions = await AlumniSubmission.find({})
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({
      ok: true,
      submissions: submissions.map((submission) => ({
        id: String(submission._id),
        submittedAt: submission.createdAt,
        name: submission.name,
        dateOfBirth: submission.dateOfBirth,
        motherName: submission.motherName,
        fatherName: submission.fatherName,
        className: submission.className,
        honsMajorSubject: submission.honsMajorSubject,
        session: submission.session,
        occupation: submission.occupation,
        email: submission.email,
        whatsapp: submission.whatsapp,
        presentAddress: submission.presentAddress,
        achievements: submission.achievements || "",
        photoName: submission.photo?.name || "",
        photoPreviewUrl: submission.photo?.url || submission.photo?.dataUrl || "",
        photoUrl: submission.photo?.url || "",
        photoPublicId: submission.photo?.publicId || "",
        photoSize: submission.photo?.size || "",
        matriculationCertificateName:
          submission.matriculationCertificate?.name || "",
        matriculationCertificatePreviewUrl:
          submission.matriculationCertificate?.url ||
          submission.matriculationCertificate?.dataUrl ||
          "",
        matriculationCertificateUrl:
          submission.matriculationCertificate?.url || "",
        matriculationCertificatePublicId:
          submission.matriculationCertificate?.publicId || "",
        matriculationCertificateSize:
          submission.matriculationCertificate?.size || "",
        collegePassingCertificateName:
          submission.collegePassingCertificate?.name || "",
        collegePassingCertificatePreviewUrl:
          submission.collegePassingCertificate?.url ||
          submission.collegePassingCertificate?.dataUrl ||
          "",
        collegePassingCertificateUrl:
          submission.collegePassingCertificate?.url || "",
        collegePassingCertificatePublicId:
          submission.collegePassingCertificate?.publicId || "",
        collegePassingCertificateSize:
          submission.collegePassingCertificate?.size || "",
        sheetStatus: submission.sheetSync?.status || "",
      })),
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load submitted data.",
      },
      { status: 500 },
    );
  }
}
