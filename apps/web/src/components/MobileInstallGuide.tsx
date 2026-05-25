import { ArrowRight, Chrome, MonitorSmartphone, Share2, Smartphone } from "lucide-react";
import { BRAND, PWA_INSTALL_STEPS } from "../config/brand";

const StepList = ({ steps }: { steps: readonly string[] }) => (
  <ol className="space-y-3">
    {steps.map((step, index) => (
      <li key={step} className="flex gap-3 text-sm leading-6 text-[#DDE7F2]">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[#0B1020] text-xs font-semibold text-[#4AA8FF] dark:bg-background-tertiary">
          {index + 1}
        </span>
        <span>{step}</span>
      </li>
    ))}
  </ol>
);

export function MobileInstallGuide() {
  return (
    <section
      className="border-y border-[#0B1020]/10 bg-[#0B1020] text-[#F7FBFF] dark:border-white/10"
      aria-labelledby="mobile-install-title"
    >
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 lg:grid-cols-[0.86fr_1.14fr] lg:px-8">
        <div className="max-w-xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 py-1.5 text-sm font-medium text-[#4AA8FF]">
            <MonitorSmartphone size={16} />
            iOS, Android, and desktop
          </div>
          <h2 id="mobile-install-title" className="text-4xl font-semibold text-[#F7FBFF]">
            Install {BRAND.name} on your phone.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#DDE7F2]">
            Add the web app to your home screen, open it fullscreen, import
            local clips, and keep editing from the browser. For timeline-heavy
            work, rotate your phone to landscape for more room.
          </p>
          <a
            href="#/welcome"
            className="mt-7 inline-flex h-11 items-center gap-2 rounded-md bg-[#4AA8FF] px-5 text-sm font-semibold text-[#0B1020] transition hover:bg-[#8CC9FF]"
          >
            Continue in browser
            <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-md bg-[#F7FBFF] text-[#0B1020]">
                <Share2 size={19} />
              </div>
              <div>
                <h3 className="font-semibold text-[#F7FBFF]">iPhone and iPad</h3>
                <p className="mt-1 text-xs text-[#9da0a7]">Safari install flow</p>
              </div>
            </div>
            <StepList steps={PWA_INSTALL_STEPS.ios} />
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-md bg-[#F7FBFF] text-[#0B1020]">
                <Chrome size={19} />
              </div>
              <div>
                <h3 className="font-semibold text-[#F7FBFF]">Android</h3>
                <p className="mt-1 text-xs text-[#9da0a7]">Chrome install flow</p>
              </div>
            </div>
            <StepList steps={PWA_INSTALL_STEPS.android} />
          </div>

          <div className="rounded-lg border border-[#4AA8FF]/40 bg-[#4AA8FF]/10 p-5 md:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg border border-white/10 bg-[#F7FBFF] p-1.5">
                <img src={BRAND.markSrc} alt="" className="h-full w-full" draggable={false} />
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#4AA8FF]">
                  <Smartphone size={16} />
                  Home-screen app mode
                </div>
                <p className="mt-1 text-sm leading-6 text-[#DDE7F2]">
                  The installed app opens without browser chrome and keeps the
                  editor close to your photos, files, and downloads.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
