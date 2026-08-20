"use client";

import useCopyToClipboard from "@/packages/hooks/useCopyToClipboard";

type KeywordsButtonsProps = {
  keywords: string[];
};

export default function KeywordsButtons({ keywords }: KeywordsButtonsProps) {
  const { copy, isCopied, lastCopied } = useCopyToClipboard(1600);

  return (
    <section
      aria-labelledby="topics"
      className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6"
    >
      <div className="mb-5">
        <h2
          id="topics"
          className="text-2xl font-semibold tracking-tight text-foreground underline underline-offset-4"
        >
          Keywords we use{" "}
        </h2>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {keywords.map((keyword) => {
          const copied = isCopied && lastCopied === keyword;

          return (
            <button
              key={keywords.indexOf(keyword)}
              type="button"
              onClick={() => copy(keyword)}
              title={`Copy "${keyword}"`}
              aria-label={`Copy keyword ${keyword}`}
              style={{
                padding: "4px 8px",
              }}
              className={`
                  cursor-pointer
                  inline-flex
                  items-center
                  rounded-sm
                  border
                  px-3.5
                  py-1.5
                  text-sm
                  font-medium
                  transition-all
                  duration-150
                  outline-none
                  focus-visible:ring-2
                  focus-visible:ring-ring
                  focus-visible:ring-offset-2
                  ${
                    copied
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-accent hover:text-accent-foreground hover:shadow-sm active:scale-[0.98]"
                  }
                `}
            >
              {keyword}
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="sr-only">
        {isCopied && lastCopied ? `${lastCopied} copied` : ""}
      </div>

      <div
        aria-hidden={!isCopied}
        className={`
          fixed
          bottom-6
          left-1/2
          z-50
          -translate-x-1/2
          rounded-lg
          border
          border-border
          bg-popover
          px-4
          py-2
          text-sm
          text-popover-foreground
          shadow-lg
          transition-all
          duration-200
          ${
            isCopied
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0"
          }
        `}
        style={{ padding: "4px 8px" }}
      >
        {lastCopied ? `"${lastCopied}" copied` : "Copied"}
      </div>
    </section>
  );
}
