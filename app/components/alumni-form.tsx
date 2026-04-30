"use client";

import { useRef, useState } from "react";

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
            className="h-12 w-full min-w-0 rounded-lg border border-white/10 bg-zinc-950 px-3 text-base text-white outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-300/10 sm:px-4 sm:text-sm"
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

      <label className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 sm:p-4">
        <span className="text-sm font-medium text-zinc-300">
          Passport Size Colour Photograph
        </span>
        <input
          name="photo"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="w-full min-w-0 text-sm text-zinc-300 file:mb-2 file:mr-3 file:rounded-md file:border-0 file:bg-amber-300 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-amber-200 sm:file:mb-0 sm:file:px-4"
        />
        <span className="text-xs leading-5 text-zinc-500">
          JPG, PNG, or WEBP up to 2 MB.
        </span>
      </label>

      {status.message ? (
        <p
          className={`rounded-lg border px-4 py-3 text-sm ${
            status.tone === "success"
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
              : "border-red-400/30 bg-red-400/10 text-red-200"
          }`}
        >
          {status.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="min-h-12 rounded-lg bg-amber-300 px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-black shadow-[0_0_40px_rgba(252,211,77,0.22)] transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60 sm:h-13 sm:px-6 sm:tracking-[0.18em]"
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
      <span className="text-sm font-medium text-zinc-300">
        {label} {required ? <Required /> : null}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="h-12 w-full min-w-0 rounded-lg border border-white/10 bg-zinc-950 px-3 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300 focus:ring-4 focus:ring-amber-300/10 sm:px-4 sm:text-sm"
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
      <span className="text-sm font-medium text-zinc-300">
        {label} {required ? <Required /> : null}
      </span>
      <textarea
        name={name}
        required={required}
        rows={4}
        className="min-h-28 w-full min-w-0 resize-y rounded-lg border border-white/10 bg-zinc-950 px-3 py-3 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-amber-300 focus:ring-4 focus:ring-amber-300/10 sm:px-4 sm:text-sm"
      />
    </label>
  );
}

function Required() {
  return <span className="text-amber-300">*</span>;
}
