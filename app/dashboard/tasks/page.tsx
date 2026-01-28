'use client';

import { useAuth } from '@/lib/auth-context';
import { tasks, projects, users } from '@/lib/dummy-data';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { Task } from '@/lib/types';

export default function TasksPage() {
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [taskStatuses, setTaskStatuses] = useState<Record<string, string>>({});

  const isManager = user?.role === 'manager';
  const isMember = user?.role === 'member';

  let displayTasks = tasks;
  if (isMember) {
    displayTasks = tasks.filter((t) => t.assignedTo === user?.id);
  } else if (isManager) {
    const managerProjects = projects.filter((p) => p.managerId === user?.id);
    displayTasks = tasks.filter((t) =>
      managerProjects.some((p) => p.id === t.projectId)
    );
  }

  if (filterStatus !== 'all') {
    displayTasks = displayTasks.filter((t) => t.status === filterStatus);
  }

  const getProject = (projectId: string) => {
    return projects.find((p) => p.id === projectId);
  };

  const getAssignee = (userId: string) => {
    return users.find((u) => u.id === userId);
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'text-red-500 bg-red-500/10 border-red-500/30';
    if (priority === 'medium') return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
    return 'text-green-500 bg-green-500/10 border-green-500/30';
  };

  const getStatusColor = (status: string) => {
    if (status === 'done') return 'bg-green-500/10 text-green-500 border-green-500/30';
    if (status === 'in-progress')
      return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
    return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
  };

  const handleStatusChange = (taskId: string, newStatus: string) => {
    setTaskStatuses((prev) => ({
      ...prev,
      [taskId]: newStatus,
    }));
  };

  const getDisplayStatus = (taskId: string, originalStatus: string) => {
    return taskStatuses[taskId] || originalStatus;
  };

  return (
    <>
      {/* Task Details Dialog */}
      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
          <DialogContent className="bg-card border-border max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-foreground">{selectedTask.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Description */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Description</p>
                <p className="text-sm text-foreground leading-relaxed">{selectedTask.description}</p>
              </div>

              {/* Project & Assignee */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Project</p>
                  <p className="text-sm font-medium text-foreground">
                    {getProject(selectedTask.projectId)?.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getProject(selectedTask.projectId)?.description}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Assigned To</p>
                  <p className="text-sm font-medium text-foreground">
                    {getAssignee(selectedTask.assignedTo)?.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getAssignee(selectedTask.assignedTo)?.department} Department
                  </p>
                </div>
              </div>

              {/* Priority & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Priority</p>
                  <Badge variant="outline" className={getPriorityColor(selectedTask.priority)}>
                    {selectedTask.priority.charAt(0).toUpperCase() +
                      selectedTask.priority.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Select
                    value={getDisplayStatus(selectedTask.id, selectedTask.status)}
                    onValueChange={(value) =>
                      handleStatusChange(selectedTask.id, value)
                    }
                  >
                    <SelectTrigger className="bg-background border-border text-foreground h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="to-do">To Do</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Created</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(selectedTask.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Due Date</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(selectedTask.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Tasks</h1>
          <p className="text-muted-foreground">
            {isManager
              ? 'Manage your team tasks'
              : 'View and track your assigned tasks'}
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter:</span>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 bg-card border-border text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="to-do">To Do</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tasks List */}
        <div className="grid grid-cols-1 gap-4">
          {displayTasks.length > 0 ? (
            displayTasks.map((task) => (
              <Card
                key={task.id}
                className="bg-card border-border p-6 hover:border-primary/50 cursor-pointer transition-colors"
                onClick={() => setSelectedTask(task)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{task.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {task.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    <Badge
                      variant="outline"
                      className={getPriorityColor(task.priority)}
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border">
                  {/* Project */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Project:</span>
                    <span className="text-xs font-medium text-foreground">
                      {getProject(task.projectId)?.name}
                    </span>
                  </div>

                  {/* Assignee */}
                  {isManager && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Assigned:</span>
                      <span className="text-xs font-medium text-foreground">
                        {getAssignee(task.assignedTo)?.name}
                      </span>
                    </div>
                  )}

                  {/* Due Date */}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="ml-auto">
                    <Badge
                      variant="outline"
                      className={getStatusColor(
                        getDisplayStatus(task.id, task.status)
                      )}
                    >
                      {getDisplayStatus(task.id, task.status) === 'to-do'
                        ? 'To Do'
                        : getDisplayStatus(task.id, task.status) === 'in-progress'
                          ? 'In Progress'
                          : 'Done'}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="bg-card border-border p-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tasks found</p>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
