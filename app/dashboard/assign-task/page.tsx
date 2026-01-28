'use client';

import React from "react"

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { users, projects } from '@/lib/dummy-data';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AssignTaskPage() {
  const { user } = useAuth();
  
  // Get team members under this manager
  const managerProjects = projects.filter((p) => p.managerId === user?.id);
  const teamMembers = users.filter((u) => u.role === 'member');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    customProject: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        title: '',
        description: '',
        project: '',
        customProject: '',
        assignedTo: '',
        priority: 'medium',
        dueDate: '',
      });
      setSubmitted(false);
    }, 3000);
  };

  const selectedMember = teamMembers.find((m) => m.id === formData.assignedTo);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Assign Task</h1>
        <p className="text-muted-foreground">Create and assign a new task to team members</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Task Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">
                  Task Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter task title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  required
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter task description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  required
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground min-h-24"
                />
              </div>

              {/* Project Selection */}
              <div className="space-y-2">
                <Label htmlFor="project" className="text-foreground">
                  Select Project
                </Label>
                <Select value={formData.project} onValueChange={(value) => handleChange('project', value)}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {managerProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Project Input (if "Other" is selected) */}
              {formData.project === 'other' && (
                <div className="space-y-2">
                  <Label htmlFor="customProject" className="text-foreground">
                    Project Name
                  </Label>
                  <Input
                    id="customProject"
                    type="text"
                    placeholder="Enter project name"
                    value={formData.customProject}
                    onChange={(e) => handleChange('customProject', e.target.value)}
                    required={formData.project === 'other'}
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              )}

              {/* Member Assignment */}
              <div className="space-y-2">
                <Label htmlFor="assignedTo" className="text-foreground">
                  Assign To Member
                </Label>
                <Select value={formData.assignedTo} onValueChange={(value) => handleChange('assignedTo', value)}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select a team member" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} - {member.currentWorkload}% workload
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-foreground">
                  Priority Level
                </Label>
                <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-foreground">
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                  required
                  className="bg-background border-border text-foreground"
                />
              </div>

              {/* Success Message */}
              {submitted && (
                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className="text-sm text-green-500">Task assigned successfully!</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={formData.project === 'other' && !formData.customProject}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 h-auto disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign Task
              </Button>

              {/* Info Alert */}
              <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-500">
                  The assigned member will receive a notification about the new task on their dashboard.
                </p>
              </div>
            </form>
          </Card>
        </div>

        {/* Member Details Sidebar */}
        <div>
          {selectedMember ? (
            <Card className="bg-card border-border p-6 sticky top-6">
              <h3 className="font-semibold text-foreground mb-4">Member Details</h3>
              <div className="space-y-4">
                <div className="p-4 bg-background rounded-lg border border-primary/30">
                  <p className="font-medium text-foreground mb-3">{selectedMember.name}</p>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Department</p>
                      <p className="text-foreground font-medium">{selectedMember.department}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Experience</p>
                      <p className="text-foreground font-medium">{selectedMember.experience} years</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Current Workload</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              selectedMember.currentWorkload > 80
                                ? 'bg-red-500'
                                : selectedMember.currentWorkload > 60
                                  ? 'bg-yellow-500'
                                  : 'bg-green-500'
                            }`}
                            style={{ width: `${selectedMember.currentWorkload}%` }}
                          />
                        </div>
                        <span className="font-medium text-foreground">
                          {selectedMember.currentWorkload}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedMember.currentWorkload > 80 && (
                  <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-500">
                      This member has high workload. Consider distribution.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="bg-card border-border p-6 sticky top-6">
              <p className="text-sm text-muted-foreground">
                Select a team member to view their details and workload information.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
