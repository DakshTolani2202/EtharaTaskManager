import { Link } from "react-router-dom";
import { Users, ArrowRight } from "lucide-react";

const ProjectCard = ({ project }) => (
  <Link
    to={`/projects/${project._id}`}
    className="card group block p-5 transition hover:-translate-y-0.5 hover:border-brand-500/50 hover:shadow-glow"
  >
    <div className="flex items-start justify-between">
      <h3 className="text-base font-semibold text-gray-100 group-hover:text-brand-300">
        {project.title}
      </h3>
      <ArrowRight
        size={18}
        className="text-gray-500 transition group-hover:translate-x-1 group-hover:text-brand-400"
      />
    </div>
    {project.description && (
      <p className="mt-2 line-clamp-2 text-sm text-gray-400">{project.description}</p>
    )}
    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
      <Users size={14} />
      {project.members?.length || 0} members
    </div>
  </Link>
);

export default ProjectCard;
