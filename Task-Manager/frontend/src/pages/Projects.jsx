import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import ProjectCard from "../components/ProjectCard";
import ProjectForm from "../components/ProjectForm";
import { projectAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { errorMessage } from "../utils/helpers";

const Projects = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchProjects = async (q = "") => {
    setLoading(true);
    try {
      const res = await projectAPI.list({ search: q, limit: 30 });
      setProjects(res.data.projects);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    if (isAdmin) projectAPI.users().then((res) => setUsers(res.data));
  }, [isAdmin]);

  useEffect(() => {
    const t = setTimeout(() => fetchProjects(search), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [search]);

  const create = async (data) => {
    setSubmitting(true);
    try {
      await projectAPI.create(data);
      toast.success("Project created");
      setShowModal(false);
      fetchProjects(search);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Projects</h2>
          <p className="text-sm text-gray-400">Manage your team projects</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowModal(true)}>
            <Plus size={16} /> New Project
          </Button>
        )}
      </div>

      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input pl-9"
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          message={isAdmin ? "Create one to get started." : "Ask an admin to add you to a project."}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Create Project">
        <ProjectForm
          users={users}
          onSubmit={create}
          onCancel={() => setShowModal(false)}
          submitting={submitting}
        />
      </Modal>
    </div>
  );
};

export default Projects;
