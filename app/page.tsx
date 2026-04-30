import { AlumniForm } from "./components/alumni-form";

export default function Home() {
  return (
    <main className="min-h-dvh bg-black text-white">
      <section className="relative isolate overflow-hidden px-3 py-4 sm:px-6 sm:py-7 lg:px-10 lg:py-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(252,211,77,0.14),transparent_32%),linear-gradient(135deg,#050505_0%,#111111_46%,#030303_100%)]" />
        <div className="mx-auto grid w-full max-w-7xl gap-4 sm:gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <aside className="top-8 rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/50 sm:p-6 lg:sticky">
            <div className="mb-6 h-1.5 w-16 rounded-full bg-amber-300 sm:mb-10 sm:w-24" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200 sm:text-sm sm:tracking-[0.24em]">
              Alumni Association
            </p>
            <h1 className="mt-4 text-[2rem] font-semibold leading-[1.12] text-white sm:mt-5 sm:text-5xl">
              Gautam Buddha Mahila College, Gaya ji
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-400 sm:mt-4 sm:text-base sm:leading-7">
              A Constituent Unit of Magadh University, BodhGaya
            </p>
            <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 text-sm text-zinc-400 sm:mt-10 sm:gap-4 sm:pt-8">
              <p className="leading-6">
                Complete the alumna details carefully. Submitted records are
                stored securely for the college alumni association.
              </p>
              <div className="rounded-lg border border-amber-300/20 bg-amber-300/10 p-3 text-amber-100 sm:p-4">
                Fields marked with * are required.
              </div>
            </div>
          </aside>

          <section className="min-w-0 rounded-lg border border-white/10 bg-zinc-900/80 p-4 shadow-2xl shadow-black/60 backdrop-blur sm:p-6 lg:p-8">
            <div className="mb-5 flex flex-col gap-2 border-b border-white/10 pb-5 sm:mb-8 sm:gap-3 sm:pb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 sm:text-sm sm:tracking-[0.22em]">
                Registration Form
              </p>
              <h2 className="text-xl font-semibold text-zinc-50 sm:text-2xl">
                Alumna Information
              </h2>
            </div>
            <AlumniForm />
          </section>
        </div>
      </section>
      <footer className="border-t border-white/10 bg-black px-4 py-5 text-center text-xs leading-6 text-zinc-500 sm:px-5 sm:py-6 sm:text-sm">
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
        </span>{" "}
        <a
          href="/admin"
          className="font-medium text-zinc-400 underline-offset-4 transition hover:text-zinc-200 hover:underline"
        >
          Admin
        </a>
      </footer>
    </main>
  );
}
