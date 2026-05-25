import { ArrowRight, CheckCircle2, Download, Sparkles } from "lucide-react";
import { BRAND } from "../config/brand";
import { ONBOARDING_STEPS } from "../components/welcome/onboarding-tour-content";

const workflow = [
  "Start with media from your device",
  "Shape the timeline with cuts, layers, and captions",
  "Use Kite AI for hooks, titles, and platform-ready copy",
  "Export locally when the edit is ready",
];

export function AboutPage() {
  return (
    <main className="h-screen overflow-y-auto bg-[#070a12] text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16 sm:px-8 lg:px-10">
        <a
          href="#/welcome"
          className="mb-12 inline-flex w-fit items-center gap-3 text-sm font-semibold text-[#4aa8ff] transition hover:text-[#42e0c0]"
        >
          <img src={BRAND.markSrc} alt="" className="h-9 w-9 rounded-xl" />
          {BRAND.name}
        </a>

        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-[#42e0c0]">
              {BRAND.tagline}
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-normal text-white sm:text-6xl lg:text-7xl">
              A web video editor you can install anywhere.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-9 text-white/72">
              No app store. No download. Just edit. Kite helps creators cut,
              caption, polish, and export from phone, tablet, desktop browser,
              or Mac.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#/welcome"
                className="inline-flex items-center gap-2 rounded-full bg-[#4aa8ff] px-6 py-3 text-sm font-bold text-[#07111f] transition hover:bg-[#42e0c0]"
              >
                Start editing
                <ArrowRight size={17} />
              </a>
              <a
                href={BRAND.macDownloadUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/18 px-6 py-3 text-sm font-bold text-white transition hover:border-[#ffd166] hover:text-[#ffd166]"
              >
                Download Mac app
                <Download size={17} />
              </a>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/12 bg-white/[0.04] p-3 shadow-2xl shadow-black/30">
            <div className="overflow-hidden rounded-[22px] bg-[#111b34]">
              <img
                src={ONBOARDING_STEPS[2].imageSrc}
                alt={ONBOARDING_STEPS[2].imageAlt}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="mt-4 rounded-[22px] bg-[#111b34] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#4aa8ff]/16 text-[#4aa8ff]">
                    <img src={BRAND.markSrc} alt="" className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Creator flow</p>
                    <p className="text-xs text-white/55">Idea to local export</p>
                  </div>
                </div>
                <Sparkles className="text-[#ffd166]" size={22} />
              </div>

              <div className="space-y-3">
                {workflow.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#0b1020] p-4"
                  >
                    <CheckCircle2 className="mt-0.5 shrink-0 text-[#42e0c0]" size={18} />
                    <span className="text-sm font-semibold leading-6 text-white/82">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
