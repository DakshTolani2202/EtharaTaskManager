import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil, Trash2, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { projectAPI, taskAPI } from "../services/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Spinner from "../components/ui/Spinner";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import ProjectForm from "../components/ProjectForm";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../utils/helpers";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [taskModal, setTaskModal] = useState({ open: false, initial: null });
  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await projectAPI.get(id);
      setData(res.data);
    } catch (err) {
      toast.error(errorMessage(err));
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (isAdmin) projectAPI.users().then((res) => setUsers(res.data));
    // eslint-disable-next-line
  }, [id]);

  const onStatusChange = async (task, status) => {
    try {
      await taskAPI.setStatus(task._id, status);
      toast.success("Status updated");
      fetchData();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const onTaskSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (taskModal.initial) {
        await taskAPI.update(taskModal.initial._id, payload);
        toast.success("Task updated");
      } else {
        await taskAPI.create({ ...payload, project: id });
        toast.success("Task created");
      }
      setTaskModal({ open: false, initial: null });
      fetchData();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const onTaskDelete = async (task) => {
    if (!confirm(`Delete task "${task.title}"?`)) return;
    try {
      await taskAPI.remove(task._id);
      toast.success("Task deleted");
      fetchData();
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  const onProjectUpdate = async (payload) => {
    setSubmitting(true);
    try {
      await projectAPI.update(id, payload);
      toast.success("Project updated");
      setEditProjectOpen(false);
      fetchData();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const onProjectDelete = async () => {
    if (!confirm("Delete this project and all its tasks?")) return;
    try {
      await projectAPI.remove(id);
      toast.success("Project deleted");
      navigate("/projects");
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) return null;
  const { project, tasks, progress } = data;

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{project.title}</h2>
            {project.description && (
              <p className="mt-1 text-gray-300">{project.description}</p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Created by {project.createdBy?.name}
            </p>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setEditProjectOpen(true)}>
                <Pencil size={14} /> Edit
              </Button>
              <Button variant="danger" onClick={onProjectDelete}>
                <Trash2 size={14} /> Delete
              </Button>
            </div>
          )}
        </div>

        <div className="mt-5">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-gray-200">Progress</span>
            <span className="text-gray-400">{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-5">
          <h4 className="mb-2 text-sm font-semibold text-gray-200">
            Members ({project.members.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.members.map((m) => (
              <span
                key={m._id}
                className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface-muted px-3 py-1 text-xs text-gray-200"
              >
                {m.name} <Badge variant={m.role}>{m.role}</Badge>
              </span>
            ))}
            {project.members.length === 0 && (
              <span className="text-sm text-gray-500">No members yet</span>
            )}
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Tasks ({tasks.length})</h3>
        {isAdmin && (
          <Button onClick={() => setTaskModal({ open: true, initial: null })}>
            <Plus size={16} /> Add Task
          </Button>
        )}
      </div>

      {tasks.length === 0 ? (
        <EmptyState title="No tasks" message="Create the first task for this project." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((t) => (
            <TaskCard
              key={t._id}
              task={t}
              onStatusChange={onStatusChange}
              onEdit={(task) => setTaskModal({ open: true, initial: task })}
              onDelete={onTaskDelete}
            />
          ))}
        </div>
      )}

      <Modal
        open={taskModal.open}
        onClose={() => setTaskModal({ open: false, initial: null })}
        title={taskModal.initial ? "Edit Task" : "New Task"}
      >
        <TaskForm
          initial={taskModal.initial || { project: id }}
          projects={[project]}
          users={project.members}
          onSubmit={onTaskSubmit}
          onCancel={() => setTaskModal({ open: false, initial: null })}
          submitting={submitting}
        />
      </Modal>

      <Modal
        open={editProjectOpen}
        onClose={() => setEditProjectOpen(false)}
        title="Edit Project"
      >
        <ProjectForm
          initial={project}
          users={users}
          onSubmit={onProjectUpdate}
          onCancel={() => setEditProjectOpen(false)}
          submitting={submitting}
        />
      </Modal>
    </div>
  );
};

export default ProjectDetail;
