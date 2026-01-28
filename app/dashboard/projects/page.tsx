'use client';

import { useAuth } from '@/lib/auth-context';
import { projects, users, tasks } from '@/lib/dummy-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { Users, Zap, CheckCircle2 } from 'lucide-react';
import { Project } from '@/lib/types';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const displayProjects = user?.role === 'admin'
    ? projects
    : user?.role === 'manager'
      ? projects.filter((p) => p.managerId === user.id)
      : projects.filter((p) => p.memberIds.includes(user?.id || ''));

  const getManager = (managerId: string) => {
    return users.find((u) => u.id === managerId);
  };

  const getProjectTasks = (projectId: string) => {
    return tasks.filter((t) => t.projectId === projectId);
  };

  const getProjectMembers = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    return project
      ? users.filter((u) => project.memberIds.includes(u.id))
      : [];
  };

  const getStatusColor = (status: string) => {
    if (status === 'completed') return 'bg-green-500/10 text-green-500 border-green-500/30';
    if (status === 'in-progress') return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
    return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
  };

  return (
    <>
      {/* Project Details Dialog */}
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="bg-card border-border max-w-3xl max-h-96 overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">{selectedProject.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Description */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Description</p>
                <p className="text-sm text-foreground">{selectedProject.description}</p>
              </div>

              {/* Status & Progress */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Badge
                    variant="outline"
                    className={getStatusColor(selectedProject.status)}
                  >
                    {selectedProject.status === 'in-progress'
                      ? 'In Progress'
                      : selectedProject.status === 'completed'
                        ? 'Completed'
                        : 'Planning'}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Manager</p>
                  <p className="text-sm font-medium text-foreground">
                    {getManager(selectedProject.managerId)?.name}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">Overall Progress</p>
                  <span className="text-sm font-bold text-primary">
                    {selectedProject.progress}%
                  </span>
                </div>
                <Progress
                  value={selectedProject.progress}
                  className="h-3 bg-background"
                />
              </div>

              {/* Team Members */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Team Members</h3>
                <div className="grid grid-cols-2 gap-2">
                  {getProjectMembers(selectedProject.id).map((member) => (
                    <div key={member.id} className="p-2 bg-background rounded-lg">
                      <p className="text-xs font-medium text-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.department}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tasks Summary */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Tasks Summary</h3>
                <div className="space-y-2">
                  {getProjectTasks(selectedProject.id).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-2 bg-background rounded-lg text-xs">
                      <span className="text-foreground">{task.title}</span>
                      <Badge variant="outline">
                        {task.status === 'done'
                          ? 'Done'
                          : task.status === 'in-progress'
                            ? 'In Progress'
                            : 'To Do'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {user?.role === 'admin' ? 'All Projects' : 'Your Projects'}
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'admin'
              ? 'Overview of all company projects'
              : 'View your assigned projects'}
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayProjects.map((project) => {
            const projectTasks = getProjectTasks(project.id);
            const completedTasks = projectTasks.filter((t) => t.status === 'done').length;
            return (
              <Card
                key={project.id}
                className="bg-card border-border p-6 hover:border-primary/50 cursor-pointer transition-colors"
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{project.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {project.description}
                    </p>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Status */}
                  <div>
                    <Badge
                      variant="outline"
                      className={getStatusColor(project.status)}
                    >
                      {project.status === 'in-progress'
                        ? 'In Progress'
                        : project.status === 'completed'
                          ? 'Completed'
                          : 'Planning'}
                    </Badge>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-muted-foreground">Progress</p>
                      <span className="text-xs font-bold text-primary">
                        {project.progress}%
                      </span>
                    </div>
                    <Progress value={project.progress} className="h-2 bg-background" />
                  </div>

                  {/* Team Info */}
                  <div className="flex items-center gap-4 pt-2 border-t border-border">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {project.memberIds.length} members
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {completedTasks}/{projectTasks.length} tasks
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {displayProjects.length === 0 && (
          <Card className="bg-card border-border p-12 text-center">
            <p className="text-muted-foreground">No projects found</p>
          </Card>
        )}
      </div>
    </>
  );
}
