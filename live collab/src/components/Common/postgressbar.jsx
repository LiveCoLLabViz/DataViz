export function ProgressBar({ value = 0 }) {
  return (
    <div className="w-full h-1.5 bg-ink-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-brand-500 transition-all duration-200 rounded-full"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export default ProgressBar;