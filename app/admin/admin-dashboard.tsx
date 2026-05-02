"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Submission = {
  id: string;
  submittedAt: string;
  name: string;
  dateOfBirth: string;
  motherName: string;
  fatherName: string;
  className: string;
  honsMajorSubject: string;
  session: string;
  occupation: string;
  email: string;
  whatsapp: string;
  presentAddress: string;
  achievements: string;
  photoName: string;
  photoPreviewUrl: string;
  photoUrl: string;
  photoPublicId: string;
  photoSize: number | string;
  matriculationCertificateName: string;
  matriculationCertificatePreviewUrl: string;
  matriculationCertificateUrl: string;
  matriculationCertificatePublicId: string;
  matriculationCertificateSize: number | string;
  collegePassingCertificateName: string;
  collegePassingCertificatePreviewUrl: string;
  collegePassingCertificateUrl: string;
  collegePassingCertificatePublicId: string;
  collegePassingCertificateSize: number | string;
  sheetStatus: string;
};

const columns: Array<{
  key: keyof Submission;
  label: string;
  exportable?: boolean;
}> = [
  { key: "submittedAt", label: "Submitted At" },
  { key: "name", label: "Name of the Alumna" },
  { key: "dateOfBirth", label: "Date of Birth" },
  { key: "motherName", label: "Mother's Name" },
  { key: "fatherName", label: "Father's Name" },
  { key: "className", label: "Class" },
  { key: "honsMajorSubject", label: "Hons./Major Subject" },
  { key: "session", label: "Session" },
  { key: "occupation", label: "Present Occupation/Employment" },
  { key: "email", label: "Email Id." },
  { key: "whatsapp", label: "Whatsapp No." },
  { key: "presentAddress", label: "Present Address" },
  { key: "achievements", label: "Achievements/Awards" },
  { key: "photoPreviewUrl", label: "Photo", exportable: false },
  { key: "photoUrl", label: "Photograph URL" },
  {
    key: "matriculationCertificatePreviewUrl",
    label: "Matriculation Certificate",
    exportable: false,
  },
  {
    key: "matriculationCertificateUrl",
    label: "Matriculation Certificate URL",
  },
  {
    key: "collegePassingCertificatePreviewUrl",
    label: "College Passing Certificate",
    exportable: false,
  },
  {
    key: "collegePassingCertificateUrl",
    label: "College Passing Certificate URL",
  },
];

const CACHE_KEY = "admin_pwd";
const CACHE_EXPIRY_KEY = "admin_pwd_exp";
const CACHE_DURATION = 12 * 60 * 60 * 1000;

export function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached && expiry && Date.now() < Number(expiry)) {
      setPassword(cached);
      loadSubmissions(undefined, cached);
    }
  }, []);

  const visibleRows = useMemo(
    () =>
      submissions.map((submission) => ({
        ...submission,
        submittedAt: submission.submittedAt
          ? new Date(submission.submittedAt).toLocaleString()
          : "",
        photoSize: submission.photoSize
          ? `${Math.round(Number(submission.photoSize) / 1024)} KB`
          : "",
        matriculationCertificateSize: submission.matriculationCertificateSize
          ? `${Math.round(Number(submission.matriculationCertificateSize) / 1024)} KB`
          : "",
        collegePassingCertificateSize: submission.collegePassingCertificateSize
          ? `${Math.round(Number(submission.collegePassingCertificateSize) / 1024)} KB`
          : "",
      })),
    [submissions],
  );

  async function loadSubmissions(event?: React.FormEvent<HTMLFormElement>, overridePassword?: string) {
    event?.preventDefault();
    setIsLoading(true);
    setMessage("");
    const pwd = overridePassword ?? password;

    try {
      const response = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Unable to load submissions.");
      }

      setSubmissions(data.submissions);
      setIsUnlocked(true);
      localStorage.setItem(CACHE_KEY, pwd);
      localStorage.setItem(CACHE_EXPIRY_KEY, String(Date.now() + CACHE_DURATION));
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load submissions.",
      );
      setIsUnlocked(false);
    } finally {
      setIsLoading(false);
    }
  }

  function downloadCsv() {
    const exportColumns = columns.filter((column) => column.exportable !== false);
    const rows = [
      exportColumns.map((column) => column.label),
      ...visibleRows.map((submission) =>
        exportColumns.map((column) => String(submission[column.key] ?? "")),
      ),
    ];
    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${value.replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\r\n");
    const blob = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "gbm-alumni-submissions.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-7xl flex-col gap-5 px-3 py-4 text-white sm:px-6 sm:py-7 lg:px-10">
      <header className="rounded-lg border border-white/10 bg-zinc-900/80 p-4 shadow-2xl shadow-black/50 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
          GBM Alumni Admin
        </p>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold sm:text-4xl">
              Submitted Alumni Data
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
              View registrations in a spreadsheet-style table and download an
              Excel-openable CSV file.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:items-center">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/15 px-5 py-2 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:border-white/30 hover:bg-white/10"
            >
              Back to Form
            </Link>
          {isUnlocked ? (
            <button
              type="button"
              onClick={downloadCsv}
              disabled={visibleRows.length === 0}
              className="min-h-11 rounded-lg bg-amber-300 px-5 py-2 text-sm font-bold uppercase tracking-[0.08em] text-black transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Download Excel CSV
            </button>
          ) : null}
          </div>
        </div>
      </header>

      <form
        onSubmit={loadSubmissions}
        className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4 sm:grid-cols-[1fr_auto] sm:p-5"
      >
        <label className="grid gap-2">
          <span className="text-sm font-medium text-zinc-300">
            Admin Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 rounded-lg border border-white/10 bg-zinc-950 px-3 text-base text-white outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-300/10 sm:text-sm"
            placeholder="Enter admin password"
          />
        </label>
        <button
          type="submit"
          disabled={isLoading}
          className="min-h-12 self-end rounded-lg bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Loading..." : isUnlocked ? "Refresh" : "Unlock"}
        </button>
      </form>

      {message ? (
        <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {message}
        </p>
      ) : null}

      {isUnlocked ? (
        <section className="min-w-0 rounded-lg border border-white/10 bg-zinc-950 shadow-2xl shadow-black/50">
          <div className="flex flex-col gap-1 border-b border-white/10 px-4 py-4 sm:px-5">
            <h2 className="text-lg font-semibold">Excel View</h2>
            <p className="text-sm text-zinc-500">
              {visibleRows.length} submitted record
              {visibleRows.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1500px] border-collapse text-left text-sm">
              <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.08em] text-zinc-400">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="border-b border-r border-white/10 px-3 py-3 font-semibold last:border-r-0"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.length > 0 ? (
                  visibleRows.map((submission) => (
                    <tr key={submission.id} className="odd:bg-white/[0.02]">
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="max-w-[280px] border-b border-r border-white/10 px-3 py-3 align-top text-zinc-200 last:border-r-0"
                        >
                          {isPreviewColumn(column.key) &&
                          submission[column.key] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={String(submission[column.key])}
                              alt={`${submission.name} ${column.label.toLowerCase()}`}
                              className="h-20 w-28 rounded-md border border-white/10 bg-white object-contain"
                            />
                          ) : isUrlColumn(column.key) &&
                            submission[column.key] ? (
                            <a
                              href={String(submission[column.key])}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-200 underline-offset-4 hover:underline"
                            >
                              View file
                            </a>
                          ) : (
                            submission[column.key]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-10 text-center text-zinc-500"
                    >
                      No submissions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <footer className="border-t border-white/10 py-5 text-center text-xs leading-6 text-zinc-400 sm:py-6 sm:text-sm">
        <span>
          Designed &amp; Developed by{" "}
          <a
            href="https://me-mj.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-amber-200 underline-offset-4 transition hover:text-amber-100 hover:underline"
          >
            Mosaana Jalal
          </a>{" "}
          (MJX Web Studio).
        </span>
        <Link
          href="/"
          className="ml-2 inline-flex min-h-8 items-center rounded-md border border-white/15 bg-white/5 px-3 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:border-white/30 hover:bg-white/10 sm:ml-3"
        >
          Back to Form
        </Link>
      </footer>
    </div>
  );
}

function isPreviewColumn(key: keyof Submission) {
  return (
    key === "photoPreviewUrl" ||
    key === "matriculationCertificatePreviewUrl" ||
    key === "collegePassingCertificatePreviewUrl"
  );
}

function isUrlColumn(key: keyof Submission) {
  return (
    key === "photoUrl" ||
    key === "matriculationCertificateUrl" ||
    key === "collegePassingCertificateUrl"
  );
}
