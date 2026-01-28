'use client';

import { useAuth } from '@/lib/auth-context';
import { users, projects } from '@/lib/dummy-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { Users, Briefcase, TrendingUp } from 'lucide-react';
import { User } from '@/lib/types';

export default function ManagersPage() {
  const [selectedManager, setSelectedManager] = useState<User | null>(null);
  const managers = users.filter((u) => u.role === 'manager');

  const getManagerProjects = (managerId: string) => {
    return projects.filter((p) => p.managerId === managerId);
  };

  const getManagerWorkload = (managerId: string) => {
    const managerProjects = getManagerProjects(managerId);
    return managerProjects.reduce((acc, p) => acc + p.memberIds.length, 0);
  };

  return (
    <>
      {/* Manager Details Dialog */}
      {selectedManager && (
        <Dialog open={!!selectedManager} onOpenChange={() => setSelectedManager(null)}>
          <DialogContent className="bg-card border-border max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-foreground">{selectedManager.name} - Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Name</p>
                  <p className="font-medium text-foreground">{selectedManager.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="font-medium text-foreground">{selectedManager.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Department</p>
                  <p className="font-medium text-foreground">{selectedManager.department}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Experience</p>
                  <p className="font-medium text-foreground">{selectedManager.experience} years</p>
                </div>
              </div>

              {/* Projects */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Assigned Projects</h3>
                <div className="space-y-2">
                  {getManagerProjects(selectedManager.id).map((project) => (
                    <div key={project.id} className="p-3 bg-background rounded-lg border border-border">
                      <p className="font-medium text-foreground text-sm">{project.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {project.memberIds.length} team members
                      </p>
                    </div>
                  ))}
                  {getManagerProjects(selectedManager.id).length === 0 && (
                    <p className="text-sm text-muted-foreground">No projects assigned.</p>
                  )}
                </div>
              </div>

              {/* Workload */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Current Workload</p>
                <Progress
                  value={selectedManager.currentWorkload}
                  className="h-2 bg-background mb-1"
                />
                <p className="text-xs text-muted-foreground">{selectedManager.currentWorkload}%</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Managers</h1>
          <p className="text-muted-foreground">Manage your managers and view their workload</p>
        </div>

        {/* Managers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {managers.map((manager) => {
            const managerProjects = getManagerProjects(manager.id);
            return (
              <Card
                key={manager.id}
                className="bg-card border-border p-6 hover:border-primary/50 cursor-pointer transition-colors"
                onClick={() => setSelectedManager(manager)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{manager.name}</h3>
                    <p className="text-xs text-muted-foreground">{manager.department}</p>
                  </div>
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Experience */}
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {manager.experience} years experience
                    </span>
                  </div>

                  {/* Projects */}
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {managerProjects.length} projects
                    </span>
                  </div>

                  {/* Workload */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-muted-foreground">Workload</p>
                      <Badge variant="outline" className="text-xs">
                        {manager.currentWorkload}%
                      </Badge>
                    </div>
                    <Progress
                      value={manager.currentWorkload}
                      className="h-2 bg-background"
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {managers.length === 0 && (
          <Card className="bg-card border-border p-12 text-center">
            <p className="text-muted-foreground">No managers found</p>
          </Card>
        )}
      </div>
    </>
  );
}
