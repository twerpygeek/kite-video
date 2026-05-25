import React, { useState } from "react";
import { Bot, Clipboard, Loader2, WandSparkles } from "lucide-react";
import {
  AI_ASSIST_ACTIONS,
  type AIAssistAction,
} from "../../services/ai-assistant-contract";
import { requestAIAssist } from "../../services/ai-assistant";
import { toast } from "../../stores/notification-store";

const PLATFORMS = ["TikTok", "Instagram Reels", "YouTube Shorts", "LinkedIn", "X"];
const TONES = ["direct", "educational", "punchy", "premium", "founder-led"];

export const CreatorAssistantPanel: React.FC = () => {
  const [action, setAction] = useState<AIAssistAction>("hooks");
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedAction = AI_ASSIST_ACTIONS.find((item) => item.id === action)!;

  const handleGenerate = async () => {
    setError("");
    setResult("");
    setIsGenerating(true);

    try {
      const response = await requestAIAssist({ action, prompt, platform, tone });
      setResult(response.result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI assistant failed.";
      setError(message);
      toast.error("AI assistant failed", message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard?.writeText(result);
    toast.success("Copied", "AI suggestions copied to clipboard.");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/20 text-primary">
            <Bot size={20} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              Creator Assistant
            </h2>
            <p className="mt-0.5 text-[11px] text-text-muted">
              Generate hooks, captions, titles, and edit notes without exposing provider keys.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {AI_ASSIST_ACTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setAction(item.id)}
              className={`rounded-md border px-2.5 py-2 text-left text-[11px] font-semibold transition ${
                action === item.id
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-border bg-background-secondary text-text-secondary hover:border-border-strong hover:text-text-primary"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1.5 text-[11px] font-semibold text-text-muted">
          Platform
          <select
            value={platform}
            onChange={(event) => setPlatform(event.target.value)}
            className="h-9 w-full rounded-md border border-border bg-background-tertiary px-2 text-[12px] text-text-primary outline-none focus:border-primary"
          >
            {PLATFORMS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5 text-[11px] font-semibold text-text-muted">
          Tone
          <select
            value={tone}
            onChange={(event) => setTone(event.target.value)}
            className="h-9 w-full rounded-md border border-border bg-background-tertiary px-2 text-[12px] text-text-primary outline-none focus:border-primary"
          >
            {TONES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block space-y-2 text-[11px] font-semibold text-text-muted">
        Content brief
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={5}
          placeholder="Describe the video, product, audience, or post you want help with."
          className="w-full resize-none rounded-lg border border-border bg-background-tertiary p-3 text-[12px] leading-5 text-text-primary outline-none transition placeholder:text-text-muted focus:border-primary"
        />
      </label>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating || prompt.trim().length < 3}
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-[12px] font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isGenerating ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <WandSparkles size={15} />
        )}
        {selectedAction.promptLabel}
      </button>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-[12px] leading-5 text-red-300">
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-lg border border-border bg-background-tertiary">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
              Suggestions
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold text-primary transition hover:bg-primary/10"
            >
              <Clipboard size={13} />
              Copy
            </button>
          </div>
          <div className="whitespace-pre-wrap p-3 text-[12px] leading-6 text-text-primary">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};
