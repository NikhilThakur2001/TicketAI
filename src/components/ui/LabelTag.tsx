import { LABEL_COLORS } from '../../lib/constants';

export function LabelTag({ label }: { label: string }) {
  const color = LABEL_COLORS[label] || "#6B7280";
  return (
    <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 10, border: `1px solid ${color}22`, background: `${color}12`, color, fontWeight: 500 }}>{label}</span>
  );
}
