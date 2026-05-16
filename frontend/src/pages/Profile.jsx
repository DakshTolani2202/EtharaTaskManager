import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h2 className="text-2xl font-bold text-white">Profile</h2>
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-2xl font-bold text-white shadow-glow">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-100">{user.name}</h3>
            <p className="text-sm text-gray-400">{user.email}</p>
            <div className="mt-1">
              <Badge variant={user.role}>{user.role}</Badge>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between border-b border-surface-border py-2">
            <span className="text-gray-400">Member since</span>
            <span className="font-medium text-gray-100">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
            </span>
          </div>
          <div className="flex justify-between border-b border-surface-border py-2">
            <span className="text-gray-400">Account ID</span>
            <span className="font-mono text-xs text-gray-300">{user._id}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
