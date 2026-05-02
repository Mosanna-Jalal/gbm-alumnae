import { AlumniForm } from "./components/alumni-form";
import Link from "next/link";

export default function Home() {
  const whatsappGroupLink = process.env.WHATSAPP_GROUP_LINK;

  return (
    <main className="min-h-dvh bg-[#f7f2e8] text-slate-950">
      <section className="relative isolate overflow-hidden px-3 py-4 sm:px-6 sm:py-7 lg:px-10 lg:py-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(31,41,90,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(180,122,35,0.15),transparent_34%),linear-gradient(135deg,#f7f2e8_0%,#eef1f8_48%,#fffaf0_100%)]" />
        <div className="mx-auto grid w-full max-w-7xl gap-4 sm:gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <aside className="relative top-8 overflow-hidden rounded-lg border border-slate-200/80 bg-[#fffdf8] p-4 shadow-2xl shadow-slate-900/10 sm:p-6 lg:sticky">
            <div className="absolute inset-0 bg-[url('/college-logo-1.jpg')] bg-[length:82%] bg-center bg-no-repeat opacity-[0.14] saturate-75" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#fffdf8]/82 via-[#fffdf8]/68 to-[#fffdf8]/90" />
            <div className="relative">
            <div className="mb-5 grid h-24 w-24 place-items-center overflow-hidden rounded-full border border-[#d8c190] bg-white/85 p-2 shadow-lg shadow-slate-900/10 sm:h-28 sm:w-28">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/college-logo-1.jpg"
                alt="Gautam Buddha Mahila College logo"
                className="h-full w-full object-contain"
              />
            </div>
            <div className="mb-6 h-1.5 w-16 rounded-full bg-[#b47a23] sm:mb-10 sm:w-24" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#29345f] sm:text-sm sm:tracking-[0.24em]">
              Alumni Association
            </p>
            <h1 className="mt-4 text-[2rem] font-semibold leading-[1.12] text-slate-950 sm:mt-5 sm:text-5xl">
              Gautam Buddha Mahila College, Gaya ji
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
              A Constituent Unit of Magadh University, BodhGaya
            </p>
            <div className="mt-6 grid gap-3 border-t border-slate-200 pt-5 text-sm text-slate-600 sm:mt-10 sm:gap-4 sm:pt-8">
              <p className="leading-6">
                Complete the alumna details carefully. Submitted records are
                stored securely for the college alumni association.
              </p>
              <div className="rounded-lg border border-[#d8c190] bg-[#fff7df] p-3 text-[#6c4a12] sm:p-4">
                Fields marked with * are required.
              </div>
              {whatsappGroupLink ? (
                <a
                  href={whatsappGroupLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-left shadow-lg shadow-emerald-900/5 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
                >
                  <span className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-emerald-600 text-sm font-black text-white shadow-md shadow-emerald-900/20">
                    WA
                  </span>
                  <span className="block pr-12 text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">
                    Stay Connected
                  </span>
                  <span className="mt-2 block text-lg font-semibold leading-tight text-slate-950">
                    Join WhatsApp Group
                  </span>
                  <span className="mt-2 block text-sm leading-6 text-emerald-900/80">
                    Get alumni updates, college notices, and association news
                    directly in the group.
                  </span>
                  <span className="mt-4 inline-flex min-h-10 items-center rounded-md bg-emerald-700 px-4 text-sm font-bold text-white transition group-hover:bg-emerald-800">
                    Open Group Link
                  </span>
                </a>
              ) : null}
            </div>
            </div>
          </aside>

          <section className="min-w-0 rounded-lg border border-slate-200/80 bg-[#fffdf8]/95 p-4 shadow-2xl shadow-slate-900/10 backdrop-blur sm:p-6 lg:p-8">
            <div className="mb-5 flex flex-col gap-2 border-b border-slate-200 pb-5 sm:mb-8 sm:gap-3 sm:pb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#29345f] sm:text-sm sm:tracking-[0.22em]">
                Registration Form
              </p>
              <h2 className="text-xl font-semibold text-slate-950 sm:text-2xl">
                Alumna Information
              </h2>
            </div>
            <AlumniForm />
          </section>
        </div>
      </section>
      <footer className="border-t border-slate-200 bg-[#fffdf8] px-4 py-5 text-center text-xs leading-6 text-slate-500 sm:px-5 sm:py-6 sm:text-sm">
        <span>
          Designed &amp; Developed by{" "}
          <a
            href="https://me-mj.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#29345f] underline-offset-4 transition hover:text-[#111936] hover:underline"
          >
            Mosaana Jalal
          </a>{" "}
          (MJX Web Studio).
        </span>
        <Link
          href="/admin"
          className="ml-2 inline-flex min-h-8 items-center rounded-md border border-[#d8c190] bg-[#fff7df] px-3 text-xs font-bold uppercase tracking-[0.08em] text-[#29345f] transition hover:border-[#b47a23] hover:bg-[#f8e9be] sm:ml-3"
        >
          Admin Panel
        </Link>
      </footer>
    </main>
  );
}
