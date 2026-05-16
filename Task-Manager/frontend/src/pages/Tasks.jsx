import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import toast from "react-hot-toast";
import { taskAPI, projectAPI } from "../services/api";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../utils/helpers";

const Tasks = () => {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    project: "",
    search: "",
  });
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [modal, setModal] = useState({ open: false, initial: null });
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await taskAPI.list(params);
      setTasks(res.data.tasks);
      setPages(res.data.pagination.pages);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    projectAPI.list({ limit: 100 }).then((res) => setProjects(res.data.projects));
    if (isAdmin) projectAPI.users().then((res) => setUsers(res.data));
  }, [isAdmin]);

  useEffect(() => {
    const t = setTimeout(fetchTasks, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [filters, page]);

  const onStatusChange = async (task, status) => {
    try {
      await taskAPI.setStatus(task._id, status);
      toast.success("Status updated");
      fetchTasks();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const onSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (modal.initial) {
        await taskAPI.update(modal.initial._id, payload);
        toast.success("Task updated");
      } else {
        await taskAPI.create(payload);
        toast.success("Task created");
      }
      setModal({ open: false, initial: null });
      fetchTasks();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (task) => {
    if (!confirm(`Delete "${task.title}"?`)) return;
    try {
      await taskAPI.remove(task._id);
      toast.success("Task deleted");
      fetchTasks();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Tasks</h2>
          <p className="text-sm text-gray-400">All tasks accessible to you</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setModal({ open: true, initial: null })}>
            <Plus size={16} /> New Task
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => {
              setPage(1);
              setFilters({ ...filters, search: e.target.value });
            }}
            className="input pl-9"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => {
            setPage(1);
            setFilters({ ...filters, status: e.target.value });
          }}
          className="input"
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={filters.priority}
          onChange={(e) => {
            setPage(1);
            setFilters({ ...filters, priority: e.target.value });
          }}
          className="input"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          value={filters.project}
          onChange={(e) => {
            setPage(1);
            setFilters({ ...filters, project: e.target.value });
          }}
          className="input"
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState title="No tasks found" message="Adjust filters or create a new task." />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((t) => (
              <TaskCard
                key={t._id}
                task={t}
                onStatusChange={onStatusChange}
                onEdit={(task) => setModal({ open: true, initial: task })}
                onDelete={onDelete}
              />
            ))}
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="secondary"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-400">
                Page {page} of {pages}
              </span>
              <Button
                variant="secondary"
                disabled={page === pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      <Modal
        open={modal.open}
        onClose={() => setModal({ open: false, initial: null })}
        title={modal.initial ? "Edit Task" : "New Task"}
      >
        <TaskForm
          initial={modal.initial}
          projects={projects}
          users={users}
          onSubmit={onSubmit}
          onCancel={() => setModal({ open: false, initial: null })}
          submitting={submitting}
        />
      </Modal>
    </div>
  );
};

export default Tasks;
