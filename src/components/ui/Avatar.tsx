import { Member } from '../../types';

export function Avatar({ member, size = 28 }: { member?: Member | null, size?: number }) {
  if (!member) return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, color: "#9CA3AF", border: "1.5px dashed #D1D5DB", flexShrink: 0 }}>?</div>
  );
  return (
    <div title={member.name} style={{ width: size, height: size, borderRadius: "50%", background: member.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, color: "#fff", fontWeight: 600, flexShrink: 0, letterSpacing: "-0.5px" }}>{member.initials}</div>
  );
}
