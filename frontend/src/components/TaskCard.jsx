import { Calendar, User as UserIcon, MoreVertical, Trash2, Pencil } from "lucide-react";
import Badge from "./ui/Badge";
import { formatDate, isOverdue, statusLabel, priorityLabel } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const TaskCard = ({ task, onStatusChange, onEdit, onDelete }) => {
  const { user, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const overdue = isOverdue(task.dueDate, task.status);
  const isAssignee = task.assignedTo?._id === user?._id;
  const canChangeStatus = isAdmin || isAssignee;

  return (
    <div className="card p-4 transition hover:border-brand-500/40 hover:shadow-glow">
      <div className="flex items-start justify-between">
        <div className="flex-1 pr-2">
          <h4 className="font-semibold text-gray-100">{task.title}</h4>
          {task.description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-400">
              {task.description}
            </p>
          )}
        </div>

        {isAdmin && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded p-1 text-gray-400 hover:bg-surface-muted hover:text-gray-100"
            >
              <MoreVertical size={16} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-10 mt-1 w-32 rounded-md border border-surface-border bg-surface-raised shadow-lg shadow-black/40">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit?.(task);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-200 hover:bg-surface-muted"
                >
                  <Pencil size={14} /> Edit
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete?.(task);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant={task.status}>{statusLabel(task.status)}</Badge>
        <Badge variant={task.priority}>{priorityLabel(task.priority)}</Badge>
        {overdue && <Badge variant="overdue">Overdue</Badge>}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-400">
        <span className="inline-flex items-center gap-1">
          <Calendar size={14} /> {formatDate(task.dueDate)}
        </span>
        <span className="inline-flex items-center gap-1">
          <UserIcon size={14} />
          {task.assignedTo?.name || "Unassigned"}
        </span>
      </div>

      {canChangeStatus && (
        <select
          value={task.status}
          onChange={(e) => onStatusChange?.(task, e.target.value)}
          className="mt-3 w-full rounded-md border border-surface-border bg-surface-muted px-2 py-1 text-xs text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      )}
    </div>
  );
};

export default TaskCard;
