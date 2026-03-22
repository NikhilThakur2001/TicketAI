import { PRIORITIES } from '../../lib/constants';

function getPriority(id: string) { return PRIORITIES.find(p => p.id === id) || PRIORITIES[2]; }

export function PriorityBadge({ priority }: { priority: string }) {
  const p = getPriority(priority);
  return (
    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: p.bg, color: p.color, letterSpacing: "0.3px", textTransform: "uppercase" }}>{p.label}</span>
  );
}
