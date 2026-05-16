import { useEffect, useState } from "react";
import Button from "./ui/Button";
import Input from "./ui/Input";

const ProjectForm = ({ initial, users = [], onSubmit, onCancel, submitting }) => {
  const [form, setForm] = useState({ title: "", description: "", members: [] });
  const [error, setError] = useState("");

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || "",
        description: initial.description || "",
        members: (initial.members || []).map((m) => m._id || m),
      });
    } else {
      setForm({ title: "", description: "", members: [] });
    }
  }, [initial]);

  const toggleMember = (id) => {
    setForm((f) =>
      f.members.includes(id)
        ? { ...f, members: f.members.filter((m) => m !== id) }
        : { ...f, members: [...f.members, id] }
    );
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Title is required");
    setError("");
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <Input
        label="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        error={error}
      />
      <div>
        <label className="block text-sm font-medium text-gray-300">Description</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300">Members</label>
        <div className="mt-1 max-h-44 overflow-y-auto rounded-lg border border-surface-border bg-surface-muted p-2">
          {users.length === 0 && (
            <p className="text-xs text-gray-500">No users available</p>
          )}
          {users.map((u) => (
            <label
              key={u._id}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm text-gray-200 hover:bg-surface-raised"
            >
              <input
                type="checkbox"
                className="accent-brand-500"
                checked={form.members.includes(u._id)}
                onChange={() => toggleMember(u._id)}
              />
              <span>
                {u.name}{" "}
                <span className="text-xs text-gray-500">({u.email})</span>
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : initial ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
