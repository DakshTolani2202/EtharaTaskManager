import { X } from "lucide-react";

const Modal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-surface-border bg-surface-raised shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between border-b border-surface-border px-5 py-3">
          <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 transition hover:bg-surface-muted hover:text-gray-100"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-5 py-4 text-gray-200">{children}</div>
        {footer && <div className="border-t border-surface-border px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
