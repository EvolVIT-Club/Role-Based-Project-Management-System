'use client';

import { useAuth } from '@/lib/auth-context';
import { projects, tasks } from '@/lib/dummy-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2, Clock, Bell } from 'lucide-react';
import Link from 'next/link';

export default function MemberDashboard() {
  const { user } = useAuth();

  const memberTasks = tasks.filter((t) => t.assignedTo === user?.id);
  const completedTasks = memberTasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = memberTasks.filter((t) => t.status === 'in-progress').length;
  const todoTasks = memberTasks.filter((t) => t.status === 'to-do').length;
  const newTasks = memberTasks.filter((t) => t.status === 'to-do').slice(0, 2);
  
  // Get projects member is assigned to
  const memberProjects = projects.filter((p) => p.memberIds.includes(user?.id || ''));
  const newProjects = memberProjects.slice(-2);

  const taskProgress = memberTasks.length > 0
    ? Math.round((completedTasks / memberTasks.length) * 100)
    : 0;

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      'to-do': { variant: 'outline', label: 'To Do' },
      'in-progress': { variant: 'default', label: 'In Progress' },
      done: { variant: 'secondary', label: 'Done' },
    };
    const config = statusConfig[status] || { variant: 'default' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'text-red-500';
    if (priority === 'medium') return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">My Dashboard</h1>
        <p className="text-muted-foreground">View your assigned tasks and projects</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Tasks</p>
              <p className="text-3xl font-bold text-primary">{memberTasks.length}</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">To Do</p>
              <p className="text-3xl font-bold text-yellow-500">{todoTasks}</p>
            </div>
            <div className="bg-yellow-500/10 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">In Progress</p>
              <p className="text-3xl font-bold text-blue-500">{inProgressTasks}</p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-500">{completedTasks}</p>
            </div>
            <div className="bg-green-500/10 p-3 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Progress */}
      <Card className="bg-card border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Overall Progress</h2>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <Progress value={taskProgress} className="h-3 bg-background mb-2" />
            <p className="text-sm text-muted-foreground">
              {completedTasks} of {memberTasks.length} tasks completed
            </p>
          </div>
          <div className="text-3xl font-bold text-primary">{taskProgress}%</div>
        </div>
      </Card>

      {/* New Projects Notification */}
      {newProjects.length > 0 && (
        <Card className="bg-purple-500/10 border border-purple-500/30 p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Bell className="w-6 h-6 text-purple-500 mt-1" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-purple-500 mb-3">New Projects Assigned</h3>
              <div className="space-y-2">
                {newProjects.map((project) => (
                  <div key={project.id} className="p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                    <p className="font-medium text-foreground text-sm">{project.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* New Task Notifications */}
      {newTasks.length > 0 && (
        <Card className="bg-blue-500/10 border border-blue-500/30 p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Bell className="w-6 h-6 text-blue-500 mt-1" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-500 mb-3">New Tasks Assigned</h3>
              <div className="space-y-2">
                {newTasks.map((task) => (
                  <Link
                    key={task.id}
                    href="/dashboard/tasks"
                    className="block p-3 bg-blue-500/5 rounded-lg border border-blue-500/20 hover:border-blue-500/50 transition-colors"
                  >
                    <p className="font-medium text-foreground text-sm">{task.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Projects List */}
      <Card className="bg-card border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Your Projects</h2>
        {memberProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memberProjects.map((project) => (
              <div
                key={project.id}
                className="p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-foreground">{project.name}</h3>
                  <Badge
                    variant={
                      project.status === 'in-progress'
                        ? 'default'
                        : 'outline'
                    }
                  >
                    {project.status === 'in-progress' ? 'In Progress' : 'Planning'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress
                    value={project.progress}
                    className="h-2 bg-muted"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No projects assigned yet.</p>
        )}
      </Card>

      {/* Tasks List */}
      <Card className="bg-card border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Your Tasks</h2>
          <Link href="/dashboard/tasks">
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/20">
              View All
            </Badge>
          </Link>
        </div>
        {memberTasks.length > 0 ? (
          <div className="space-y-3">
            {memberTasks.slice(0, 5).map((task) => (
              <Link
                key={task.id}
                href="/dashboard/tasks"
              >
                <div
                  className="p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-foreground">{task.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium capitalize ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {getStatusBadge(task.status)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No tasks assigned yet.</p>
        )}
      </Card>
    </div>
  );
}
