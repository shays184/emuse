interface ComplexityFilterProps {
  selected: number | null;
  onChange: (complexity: number | null) => void;
}

const LEVELS = [
  { value: 1, label: "Beginner" },
  { value: 2, label: "Intermediate" },
  { value: 3, label: "Advanced" },
];

export function ComplexityFilter({
  selected,
  onChange,
}: ComplexityFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          selected === null
            ? "bg-primary text-white dark:bg-primary-light dark:text-bg-dark"
            : "bg-surface-light text-text-secondary-light hover:text-text-light dark:bg-surface-dark dark:text-text-secondary-dark dark:hover:text-text-dark"
        }`}
      >
        All
      </button>
      {LEVELS.map((level) => (
        <button
          key={level.value}
          onClick={() => onChange(level.value)}
          className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            selected === level.value
              ? "bg-primary text-white dark:bg-primary-light dark:text-bg-dark"
              : "bg-surface-light text-text-secondary-light hover:text-text-light dark:bg-surface-dark dark:text-text-secondary-dark dark:hover:text-text-dark"
          }`}
        >
          {level.label}
        </button>
      ))}
    </div>
  );
}
