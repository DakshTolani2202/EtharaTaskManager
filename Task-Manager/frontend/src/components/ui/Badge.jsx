const variants = {
  todo: "bg-gray-500/15 text-gray-300 ring-1 ring-gray-500/30",
  "in-progress": "bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30",
  completed: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  low: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30",
  medium: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30",
  high: "bg-red-500/15 text-red-300 ring-1 ring-red-500/30",
  admin: "bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/40",
  member: "bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30",
  overdue: "bg-red-500/15 text-red-300 ring-1 ring-red-500/30",
};

const Badge = ({ variant = "todo", children }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
      variants[variant] || variants.todo
    }`}
  >
    {children}
  </span>
);

export default Badge;
