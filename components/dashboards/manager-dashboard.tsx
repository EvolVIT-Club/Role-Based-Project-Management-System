'use client';

import { useAuth } from '@/lib/auth-context';
import { projects, tasks, users } from '@/lib/dummy-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { Users, FolderOpen, AlertCircle, Bell } from 'lucide-react';
import { User } from '@/lib/types';

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [membersUnderManager, setMembersUnderManager] = useState<User[]>([]);

  useEffect(() => {
    if (user?.id) {
      const members = users.filter((u) => u.role === 'member');
      setMembersUnderManager(members);
    }
  }, [user?.id]);

  const managerProjects = projects.filter((p) => p.managerId === user?.id);
  const projectTaskCount = (projectId: string) =>
    tasks.filter((t) => t.projectId === projectId).length;
  
  // Show newest 2 projects as "new" notifications
  const newProjects = managerProjects.slice(-2);

  return (
    <>
      {/* Members Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Members Under You</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {membersUnderManager.map((member) => (
              <div
                key={member.id}
                className="p-4 bg-background rounded-lg border border-border"
              >
                <p className="font-medium text-foreground">{member.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{member.department}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Manager Dashboard</h1>
          <p className="text-muted-foreground">Manage your projects and team</p>
        </div>

        {/* New Projects Notification */}
        {newProjects.length > 0 && (
          <Card className="bg-blue-500/10 border border-blue-500/30 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Bell className="w-6 h-6 text-blue-500 mt-1" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-500 mb-3">New Projects Assigned</h3>
                <div className="space-y-2">
                  {newProjects.map((project) => (
                    <div key={project.id} className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                      <p className="font-medium text-foreground text-sm">{project.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{project.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Your Projects</p>
                <p className="text-3xl font-bold text-primary">{managerProjects.length}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-lg">
                <FolderOpen className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Team Members</p>
                <p className="text-3xl font-bold text-accent">{membersUnderManager.length}</p>
              </div>
              <div className="bg-accent/10 p-3 rounded-lg">
                <Users className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Tasks</p>
                <p className="text-3xl font-bold text-green-500">
                  {tasks.filter((t) =>
                    managerProjects.some((p) => p.id === t.projectId) &&
                    t.status !== 'done'
                  ).length}
                </p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Projects */}
        <Card className="bg-card border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Your Projects</h2>
          {managerProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {managerProjects.map((project) => (
                <div
                  key={project.id}
                  className="p-4 bg-background rounded-lg border border-border"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-foreground">{project.name}</h3>
                    <Badge
                      variant={
                        project.status === 'completed'
                          ? 'secondary'
                          : 'default'
                      }
                    >
                      {project.status === 'in-progress' ? 'In Progress' : 'Planning'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {projectTaskCount(project.id)} tasks
                  </p>
                  <Progress
                    value={project.progress}
                    className="h-2 bg-muted mb-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    {project.progress}% complete
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No projects assigned yet.</p>
          )}
        </Card>
      </div>
    </>
  );
}
