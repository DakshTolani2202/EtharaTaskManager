import { useEffect, useState } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";

const empty = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
  assignedTo: "",
  project: "",
};

const TaskForm = ({ initial, projects = [], users = [], onSubmit, onCancel, submitting }) => {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        description: initial.description || "",
        status: initial.status || "todo",
        priority: initial.priority || "medium",
        dueDate: initial.dueDate ? initial.dueDate.slice(0, 10) : "",
        assignedTo: initial.assignedTo?._id || initial.assignedTo || "",
        project: initial.project?._id || initial.project || "",
      });
    } else {
      setForm(empty);
    }
  }, [initial]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.project) errs.project = "Project is required";
    if (Object.keys(errs).length) return setErrors(errs);
    setErrors({});
    const payload = { ...form };
    if (!payload.dueDate) delete payload.dueDate;
    if (!payload.assignedTo) payload.assignedTo = null;
    onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <Input
        label="Title"
        name="title"
        value={form.title}
        onChange={change}
        error={errors.title}
      />
      <div>
        <label className="block text-sm font-medium text-gray-300">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={change}
          rows={3}
          className="input mt-1"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-300">Status</label>
          <select name="status" value={form.status} onChange={change} className="input mt-1">
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Priority</label>
          <select name="priority" value={form.priority} onChange={change} className="input mt-1">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Due Date"
          name="dueDate"
          type="date"
          value={form.dueDate}
          onChange={change}
        />
        <div>
          <label className="block text-sm font-medium text-gray-300">Assigned To</label>
          <select
            name="assignedTo"
            value={form.assignedTo}
            onChange={change}
            className="input mt-1"
          >
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300">Project</label>
        <select name="project" value={form.project} onChange={change} className="input mt-1">
          <option value="">Select a project</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </select>
        {errors.project && <p className="text-xs text-red-400">{errors.project}</p>}
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : initial ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
