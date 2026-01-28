'use client';

import { projects, tasks } from '@/lib/dummy-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, AlertCircle, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function AdminDashboard() {
  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const inProgressProjects = projects.filter((p) => p.status === 'in-progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const totalTasks = tasks.length;

  const recentProjectUpdates = projects.slice(0, 3);
  const recentTaskChanges = tasks.slice(0, 3);

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 61) return 'bg-lime-400';
    if (progress >= 31) return 'bg-orange-500';
    if (progress >= 1) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      planning: { variant: 'outline', label: 'Planning' },
      'in-progress': { variant: 'default', label: 'In Progress' },
      completed: { variant: 'secondary', label: 'Completed' },
      'to-do': { variant: 'outline', label: 'To Do' },
      done: { variant: 'secondary', label: 'Done' },
    };
    const config = statusConfig[status] || { variant: 'default' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and latest activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Projects</p>
              <p className="text-3xl font-bold text-primary">{projects.length}</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">In Progress</p>
              <p className="text-3xl font-bold text-accent">{inProgressProjects}</p>
            </div>
            <div className="bg-accent/10 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-accent" />
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-500">{completedProjects}</p>
            </div>
            <div className="bg-green-500/10 p-3 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Task Completion</p>
              <p className="text-3xl font-bold text-primary">{Math.round((completedTasks / totalTasks) * 100)}%</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>

      {/* Latest Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Project Updates */}
        <Card className="bg-card border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Latest Project Updates</h2>
          <div className="space-y-4">
            {recentProjectUpdates.map((project) => (
              <div key={project.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-foreground">{project.name}</h3>
                  {getStatusBadge(project.status)}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                  <span>{project.progress}% complete</span>
                </div>
                <Progress
                  value={project.progress}
                  className="h-2 bg-background"
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Task Changes */}
        <Card className="bg-card border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Task Changes</h2>
          <div className="space-y-3">
            {recentTaskChanges.map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between p-3 bg-background rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{task.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                </div>
                {getStatusBadge(task.status)}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* System Alerts */}
      <Card className="bg-card border-border p-6">
        <div className="flex items-start gap-4">
          <div className="bg-amber-500/10 p-3 rounded-lg flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Important System Alert</h3>
            <p className="text-sm text-muted-foreground">
              Several projects are approaching their deadline. Review project status and team workload to ensure timely completion.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
