'use client';

import { users, tasks } from '@/lib/dummy-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { Briefcase, CheckCircle2, TrendingUp } from 'lucide-react';
import { User } from '@/lib/types';

export default function MembersPage() {
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const members = users.filter((u) => u.role === 'member');

  const getMemberTasks = (memberId: string) => {
    return tasks.filter((t) => t.assignedTo === memberId);
  };

  const getMemberProgress = (memberId: string) => {
    const memberTasks = getMemberTasks(memberId);
    if (memberTasks.length === 0) return 0;
    const completed = memberTasks.filter((t) => t.status === 'done').length;
    return Math.round((completed / memberTasks.length) * 100);
  };

  return (
    <>
      {/* Member Details Dialog */}
      {selectedMember && (
        <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
          <DialogContent className="bg-card border-border max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-foreground">{selectedMember.name} - Profile</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Name</p>
                  <p className="font-medium text-foreground">{selectedMember.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="font-medium text-foreground">{selectedMember.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Department</p>
                  <p className="font-medium text-foreground">{selectedMember.department}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Experience</p>
                  <p className="font-medium text-foreground">{selectedMember.experience} years</p>
                </div>
              </div>

              {/* Tasks */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">Assigned Tasks</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {getMemberTasks(selectedMember.id).map((task) => (
                    <div key={task.id} className="p-3 bg-background rounded-lg border border-border">
                      <div className="flex items-start justify-between">
                        <p className="font-medium text-foreground text-sm flex-1">{task.title}</p>
                        <Badge variant="outline" className="text-xs">
                          {task.status === 'done' ? 'Done' : task.status === 'in-progress' ? 'In Progress' : 'To Do'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{task.priority} priority</p>
                    </div>
                  ))}
                  {getMemberTasks(selectedMember.id).length === 0 && (
                    <p className="text-sm text-muted-foreground">No tasks assigned.</p>
                  )}
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">Task Progress</p>
                  <Badge className="bg-primary text-primary-foreground">
                    {getMemberProgress(selectedMember.id)}%
                  </Badge>
                </div>
                <Progress
                  value={getMemberProgress(selectedMember.id)}
                  className="h-2 bg-background"
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Members</h1>
          <p className="text-muted-foreground">Manage team members and monitor their progress</p>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => {
            const memberTasks = getMemberTasks(member.id);
            const progress = getMemberProgress(member.id);
            return (
              <Card
                key={member.id}
                className="bg-card border-border p-6 hover:border-primary/50 cursor-pointer transition-colors"
                onClick={() => setSelectedMember(member)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-xs text-muted-foreground">{member.department}</p>
                  </div>
                  <div className="bg-accent/10 p-2 rounded-lg">
                    <Briefcase className="w-5 h-5 text-accent" />
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Tasks */}
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {memberTasks.length} tasks
                    </span>
                  </div>

                  {/* Experience */}
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {member.experience} years experience
                    </span>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-muted-foreground">Progress</p>
                      <Badge variant="outline" className="text-xs">
                        {progress}%
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-2 bg-background" />
                  </div>

                  {/* Workload */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-muted-foreground">Workload</p>
                      <Badge variant="outline" className="text-xs">
                        {member.currentWorkload}%
                      </Badge>
                    </div>
                    <Progress
                      value={member.currentWorkload}
                      className="h-2 bg-background"
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {members.length === 0 && (
          <Card className="bg-card border-border p-12 text-center">
            <p className="text-muted-foreground">No members found</p>
          </Card>
        )}
      </div>
    </>
  );
}
