'use client';

import { useAuth } from '@/lib/auth-context';
import AdminDashboard from '@/components/dashboards/admin-dashboard';
import ManagerDashboard from '@/components/dashboards/manager-dashboard';
import MemberDashboard from '@/components/dashboards/member-dashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === 'admin') return <AdminDashboard />;
  if (user.role === 'manager') return <ManagerDashboard />;
  return <MemberDashboard />;
}
