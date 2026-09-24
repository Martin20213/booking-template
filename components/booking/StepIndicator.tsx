const steps = ["Szolgáltatás", "Dátum", "Időpont", "Adatok", "Megerősítés"];

export function StepIndicator({ current }: { current: number }) {
  return (
    <ol className="flex flex-wrap gap-x-6 gap-y-2">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const state = stepNum < current ? "done" : stepNum === current ? "active" : "upcoming";

        return (
          <li key={label} className="flex items-center gap-2 text-sm">
            <span
              className={
                state === "active"
                  ? "text-brass-light"
                  : state === "done"
                  ? "text-paper"
                  : "text-paper-muted/50"
              }
            >
              {label}
            </span>
            {i < steps.length - 1 && <span className="text-ink-line">—</span>}
          </li>
        );
      })}
    </ol>
  );
}
