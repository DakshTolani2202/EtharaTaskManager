import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  FolderKanban,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
} from "recharts";
import { dashboardAPI } from "../services/api";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import { formatDate, statusLabel } from "../utils/helpers";

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const StatCard = ({ icon: Icon, label, value, tone = "brand" }) => {
  const tones = {
    brand: "bg-brand-500/15 text-brand-300 ring-brand-500/30",
    green: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
    amber: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
    red: "bg-red-500/15 text-red-300 ring-red-500/30",
    blue: "bg-blue-500/15 text-blue-300 ring-blue-500/30",
    gray: "bg-gray-500/15 text-gray-300 ring-gray-500/30",
  };
  return (
    <Card>
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg ring-1 ${tones[tone]}`}
        >
          <Icon size={22} />
        </div>
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </Card>
  );
};

const tooltipStyle = {
  backgroundColor: "#15151f",
  border: "1px solid #2a2a3a",
  borderRadius: 8,
  color: "#e5e7eb",
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI
      .stats()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) return <EmptyState title="Could not load dashboard" />;

  const { totals, charts, recentActivity } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Dashboard</h2>
        <p className="text-sm text-gray-400">Your workspace at a glance.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={ListTodo} label="Total Tasks" value={totals.totalTasks} tone="brand" />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={totals.completedTasks}
          tone="green"
        />
        <StatCard
          icon={Clock}
          label="Pending"
          value={totals.pendingTasks}
          tone="amber"
        />
        <StatCard
          icon={AlertTriangle}
          label="Overdue"
          value={totals.overdueTasks}
          tone="red"
        />
        <StatCard
          icon={FolderKanban}
          label="Projects"
          value={totals.totalProjects}
          tone="blue"
        />
        <StatCard
          icon={Activity}
          label="In Progress"
          value={totals.inProgressTasks}
          tone="blue"
        />
        <StatCard
          icon={ListTodo}
          label="To Do"
          value={totals.todoTasks}
          tone="gray"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-base font-semibold text-gray-100">Tasks by Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.byStatus}>
                <CartesianGrid stroke="#2a2a3a" strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis allowDecimals={false} stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#1c1c29" }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 text-base font-semibold text-gray-100">Tasks by Priority</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.byPriority}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  stroke="#15151f"
                  label
                >
                  {charts.byPriority.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ color: "#9ca3af" }} />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 text-base font-semibold text-gray-100">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <EmptyState title="No recent tasks" />
        ) : (
          <div className="divide-y divide-surface-border">
            {recentActivity.map((t) => (
              <div key={t._id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-100">{t.title}</p>
                  <p className="text-xs text-gray-400">
                    {t.project?.title} · {t.assignedTo?.name || "Unassigned"} · updated{" "}
                    {formatDate(t.updatedAt)}
                  </p>
                </div>
                <Badge variant={t.status}>{statusLabel(t.status)}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
