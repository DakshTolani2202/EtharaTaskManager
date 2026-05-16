import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-surface-base p-6 text-center">
    <h1 className="text-7xl font-bold text-brand-400">404</h1>
    <p className="mt-2 text-lg font-semibold text-gray-100">Page not found</p>
    <p className="mt-1 text-sm text-gray-400">
      The page you're looking for doesn't exist.
    </p>
    <Link to="/" className="mt-6">
      <Button>Go to Dashboard</Button>
    </Link>
  </div>
);

export default NotFound;
