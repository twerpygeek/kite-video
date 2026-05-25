import { ArrowRight, Download, Home, MonitorSmartphone } from "lucide-react";
import { BRAND } from "../config/brand";
import { ONBOARDING_STEPS } from "../components/welcome/onboarding-tour-content";

const tutorialDetails = [
  "Add footage, stills, audio, or a screen recording from your device.",
  "Trim the timeline, stack tracks, and line each cut up to the beat.",
  "Add captions, subtitles, titles, graphics, and animated text.",
  "Polish color, audio, motion, masks, effects, and transitions.",
  "Choose a format and export the finished cut locally from the browser.",
];

export function TutorialPage() {
  return (
    <main className="min-h-screen overflow-y-auto bg-[linear-gradient(180deg,#F7FBFF_0%,#EEF6FF_42%,#FFFFFF_100%)] text-[#0B1020] dark:bg-background dark:bg-none dark:text-text-primary">
      <header className="border-b border-[#0B1020]/10 bg-[#F7FBFF]/90 backdrop-blur-xl dark:border-white/10 dark:bg-background/90">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <a
            href="#/welcome"
            className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4AA8FF]"
          >
            <img src={BRAND.markSrc} alt="" className="h-11 w-11 rounded-xl" />
            <span>
              <span className="block text-xl font-semibold">{BRAND.name}</span>
              <span className="block text-xs font-medium text-[#6C5CFF] dark:text-[#4AA8FF]">
                {BRAND.tagline}
              </span>
            </span>
          </a>
          <a
            href="#/welcome"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-[#0B1020]/10 bg-white px-4 text-sm font-semibold transition hover:bg-[#EAF5FF] dark:border-white/10 dark:bg-background-secondary dark:hover:bg-background-tertiary"
          >
            <Home size={16} />
            Home
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-[#0B1020]/10 bg-white px-3 py-1.5 text-sm font-medium text-[#0B1020] shadow-sm dark:border-white/10 dark:bg-background-secondary dark:text-text-primary">
            <MonitorSmartphone size={16} />
            Web, mobile, and Mac
          </div>
          <h1 className="font-display text-5xl font-semibold leading-tight sm:text-6xl">
            How to use {BRAND.name}
          </h1>
          <p className="mt-6 text-xl leading-8 text-[#4c4b49] dark:text-text-secondary">
            Import footage, shape the timeline, caption the story, polish the
            look, then export a platform-ready edit without leaving the web.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#/welcome"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-[#4AA8FF] px-6 text-sm font-semibold text-[#0B1020] transition hover:bg-[#8CC9FF]"
            >
              Start editing
              <ArrowRight size={17} />
            </a>
            <a
              href={BRAND.macDownloadUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-[#0B1020]/15 bg-white px-6 text-sm font-semibold text-[#0B1020] transition hover:bg-[#EAF5FF] dark:border-white/10 dark:bg-background-secondary dark:text-text-primary dark:hover:bg-background-tertiary"
            >
              <Download size={17} />
              Download Mac app
            </a>
          </div>
        </div>

        <div className="grid gap-5">
          {ONBOARDING_STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <article
                key={step.title}
                className="grid overflow-hidden rounded-lg border border-[#0B1020]/10 bg-white shadow-[0_18px_50px_rgba(11,16,32,0.08)] dark:border-white/10 dark:bg-background-secondary dark:shadow-none md:grid-cols-[0.9fr_1.1fr]"
              >
                <div className="relative min-h-[280px] bg-[#0B1020]">
                  <img
                    src={step.imageSrc}
                    alt={step.imageAlt}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-8">
                  <div className="mb-5 flex items-center gap-3">
                    <div
                      className="grid h-12 w-12 place-items-center rounded-md bg-[#0B1020] text-white"
                      style={{ color: step.accent }}
                    >
                      <Icon size={22} />
                    </div>
                    <div className="rounded-md bg-[#EAF5FF] px-3 py-1 text-sm font-bold text-[#0B1020] dark:bg-background-tertiary dark:text-[#4AA8FF]">
                      {String(index + 1).padStart(2, "0")} / 05
                    </div>
                  </div>
                  <h2 className="font-display text-3xl font-semibold">{step.title}</h2>
                  <p className="mt-3 text-lg leading-8 text-[#4c4b49] dark:text-text-secondary">
                    {tutorialDetails[index]}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
