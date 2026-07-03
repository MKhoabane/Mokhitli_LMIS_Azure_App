interface StatusChipProps {
  label: string;
  toneClassName: string;
  className?: string;
}

export default function StatusChip({ label, toneClassName, className = '' }: StatusChipProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] ${toneClassName} ${className}`.trim()}
    >
      {label}
    </span>
  );
}
