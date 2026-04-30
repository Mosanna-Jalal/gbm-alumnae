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

export function AlumniForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>({
    tone: "idle",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

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
      setPhotoPreview("");
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
          <span className="text-sm font-medium text-zinc-300">
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

      <div className="grid gap-3 rounded-lg border border-[#d8c190] bg-[#fff7df]/70 p-3 sm:grid-cols-[1fr_auto] sm:p-4">
        <label className="grid gap-3">
          <span className="text-sm font-medium text-slate-700">
            Photo
          </span>
          <input
            name="photo"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (photoPreview) {
                URL.revokeObjectURL(photoPreview);
              }

              setPhotoPreview(file ? URL.createObjectURL(file) : "");
            }}
            className="w-full min-w-0 text-sm text-slate-700 file:mb-2 file:mr-3 file:rounded-md file:border-0 file:bg-[#29345f] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#1d274e] sm:file:mb-0 sm:file:px-4"
          />
          <span className="text-xs leading-5 text-slate-500">
            JPG, PNG, or WEBP up to 2 MB.
          </span>
        </label>

        <div className="grid h-28 w-24 place-items-center overflow-hidden rounded-lg border border-[#d8c190] bg-white text-center text-xs text-slate-400">
          {photoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoPreview}
              alt="Selected passport photograph preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="px-3">Photo preview</span>
          )}
        </div>
      </div>

      {status.message ? (
        <p
          className={`rounded-lg border px-4 py-3 text-sm ${
            status.tone === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {status.message}
        </p>
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

function Required() {
  return <span className="text-[#b47a23]">*</span>;
}
