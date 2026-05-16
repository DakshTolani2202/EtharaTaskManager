import { Inbox } from "lucide-react";

const EmptyState = ({ title = "Nothing here yet", message, action }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-surface-border bg-surface-raised/40 py-12 text-center">
    <Inbox className="mb-3 text-gray-500" size={40} />
    <h4 className="text-base font-semibold text-gray-100">{title}</h4>
    {message && <p className="mt-1 text-sm text-gray-400">{message}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
