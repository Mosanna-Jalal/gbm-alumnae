"use client";

import { useEffect, useRef, useState } from "react";

const classOptions = [
  "IA",
  "ISc",
  "B.A.",
  "B.Sc.",
  "B.Com",
  "BBM",
  "BCA",
  "BLIS",
];

type Status = {
  tone: "idle" | "success" | "error";
  message: string;
};

type FilePreviewKey =
  | "photo"
  | "matriculationCertificate"
  | "collegePassingCertificate";

export function AlumniForm({
  whatsappGroupLink,
}: {
  whatsappGroupLink?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>({
    tone: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filePreviews, setFilePreviews] = useState<Record<FilePreviewKey, string>>({
    photo: "",
    matriculationCertificate: "",
    collegePassingCertificate: "",
  });
  const filePreviewsRef = useRef(filePreviews);

  useEffect(() => {
    return () => {
      Object.values(filePreviewsRef.current).forEach((previewUrl) => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
      });
    };
  }, []);

  function handleFilePreview(
    key: FilePreviewKey,
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    setFilePreviews((current) => {
      if (current[key]) {
        URL.revokeObjectURL(current[key]);
      }

      const next = {
        ...current,
        [key]: file ? URL.createObjectURL(file) : "",
      };
      filePreviewsRef.current = next;

      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ tone: "idle", message: "" });

    try {
      const response = await fetch("/api/alumni", {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Submission failed.");
      }

      formRef.current?.reset();
      setFilePreviews((current) => {
        Object.values(current).forEach((previewUrl) => {
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }
        });

        const next = {
          photo: "",
          matriculationCertificate: "",
          collegePassingCertificate: "",
        };
        filePreviewsRef.current = next;

        return next;
      });
      setStatus({ tone: "success", message: data.message });
    } catch (error) {
      setStatus({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong while submitting.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4 sm:gap-5">
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        <Field label="Name of the Alumna" name="name" required />
        <Field label="Date of Birth" name="dateOfBirth" type="date" required />
        <Field label="Mother's Name" name="motherName" required />
        <Field label="Father's Name" name="fatherName" required />
        <label className="group grid gap-2">
          <span className="text-sm font-medium text-slate-700">
            Class <Required />
          </span>
          <select
            name="className"
            required
            className="h-12 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-[#b47a23] focus:ring-4 focus:ring-[#b47a23]/15 sm:px-4 sm:text-sm"
          >
            <option value="">Select class</option>
            {classOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <Field label="Hons./Major Subject" name="honsMajorSubject" required />
        <Field
          label="Session"
          name="session"
          placeholder="Example: 2020-2023"
          required
        />
        <Field
          label="Present Occupation/Employment"
          name="occupation"
          required
        />
        <Field label="Email Id." name="email" type="email" required />
        <Field label="Whatsapp No." name="whatsapp" type="tel" required />
      </div>

      <Textarea label="Present Address" name="presentAddress" required />
      <Textarea label="Achievements/Awards" name="achievements" />

      <div className="grid gap-3 rounded-lg border border-[#d8c190] bg-[#fff7df]/70 p-3 sm:p-4">
        <div>
          <p className="text-sm font-semibold text-slate-800">
            Required Uploads
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Upload clear JPG, PNG, or WEBP images. Each file must be up to 2 MB.
          </p>
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          <FileUpload
            label="Passport Photo"
            name="photo"
            previewUrl={filePreviews.photo}
            previewAlt="Selected passport photograph preview"
            onChange={(event) => handleFilePreview("photo", event)}
            required
          />
          <FileUpload
            label="Matriculation Certificate"
            name="matriculationCertificate"
            previewUrl={filePreviews.matriculationCertificate}
            previewAlt="Selected matriculation certificate preview"
            onChange={(event) =>
              handleFilePreview("matriculationCertificate", event)
            }
            required
          />
          <FileUpload
            label="College Passing Certificate"
            name="collegePassingCertificate"
            previewUrl={filePreviews.collegePassingCertificate}
            previewAlt="Selected college passing certificate preview"
            onChange={(event) =>
              handleFilePreview("collegePassingCertificate", event)
            }
            required
          />
        </div>
      </div>

      {status.message ? (
        status.tone === "success" ? (
          <div className="overflow-hidden rounded-lg border border-emerald-200 bg-white shadow-xl shadow-emerald-950/10">
            <div className="grid gap-4 bg-gradient-to-br from-emerald-50 via-white to-[#fff7df] p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:p-5">
              <div>
                <div className="mb-3 inline-flex min-h-9 items-center rounded-md bg-emerald-100 px-3 text-xs font-bold uppercase tracking-[0.12em] text-emerald-800">
                  Registration Submitted
                </div>
                <p className="text-sm leading-6 text-emerald-900">
                  {status.message}
                </p>
                {whatsappGroupLink ? (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Join the official WhatsApp group to receive alumni updates,
                    notices, and association announcements.
                  </p>
                ) : null}
              </div>

              {whatsappGroupLink ? (
                <a
                  href={whatsappGroupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-500/25"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-xs font-black text-emerald-700">
                    WA
                  </span>
                  Join WhatsApp Group
                </a>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {status.message}
          </p>
        )
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="min-h-12 rounded-lg bg-[#29345f] px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_12px_30px_rgba(41,52,95,0.18)] transition hover:bg-[#1d274e] disabled:cursor-not-allowed disabled:opacity-60 sm:h-13 sm:px-6 sm:tracking-[0.18em]"
      >
        {isSubmitting ? "Submitting..." : "Submit Alumni Form"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-700">
        {label} {required ? <Required /> : null}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="h-12 w-full min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#b47a23] focus:ring-4 focus:ring-[#b47a23]/15 sm:px-4 sm:text-sm"
      />
    </label>
  );
}

function Textarea({
  label,
  name,
  required = false,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-700">
        {label} {required ? <Required /> : null}
      </span>
      <textarea
        name={name}
        required={required}
        rows={4}
        className="min-h-28 w-full min-w-0 resize-y rounded-lg border border-slate-200 bg-white px-3 py-3 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#b47a23] focus:ring-4 focus:ring-[#b47a23]/15 sm:px-4 sm:text-sm"
      />
    </label>
  );
}

function FileUpload({
  label,
  name,
  previewUrl,
  previewAlt,
  onChange,
  required = false,
}: {
  label: string;
  name: string;
  previewUrl: string;
  previewAlt: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div className="grid gap-3 rounded-lg border border-[#d8c190] bg-white/70 p-3">
      <label className="grid gap-3">
        <span className="text-sm font-medium text-slate-700">
          {label} {required ? <Required /> : null}
        </span>
        <input
          name={name}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          required={required}
          onChange={onChange}
          className="w-full min-w-0 text-sm text-slate-700 file:mb-2 file:mr-3 file:rounded-md file:border-0 file:bg-[#29345f] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#1d274e] sm:file:mb-0 sm:file:px-4"
        />
      </label>

      <div className="grid h-32 w-full place-items-center overflow-hidden rounded-lg border border-[#d8c190] bg-white text-center text-xs text-slate-400">
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt={previewAlt}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="px-3">Preview</span>
        )}
      </div>
    </div>
  );
}

function Required() {
  return <span className="text-[#b47a23]">*</span>;
}
