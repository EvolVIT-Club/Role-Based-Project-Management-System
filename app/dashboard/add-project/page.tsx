'use client';

import React from "react"

import { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { users } from '@/lib/dummy-data';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AddProjectPage() {
  const managers = users.filter((u) => u.role === 'manager');
  const members = users.filter((u) => u.role === 'member');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manager: '',
    selectedMembers: [] as string[],
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleMember = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedMembers: prev.selectedMembers.includes(memberId)
        ? prev.selectedMembers.filter((id) => id !== memberId)
        : [...prev.selectedMembers, memberId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', description: '', manager: '', selectedMembers: [] });
      setSubmitted(false);
    }, 3000);
  };

  const selectedManager = managers.find((m) => m.id === formData.manager);
  const selectedMemberObjects = members.filter((m) =>
    formData.selectedMembers.includes(m.id)
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Add Project</h1>
        <p className="text-muted-foreground">Create a new project and assign team members</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Project Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter project name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
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
                  placeholder="Enter project description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  required
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground min-h-24"
                />
              </div>

              {/* Manager Selection */}
              <div className="space-y-2">
                <Label htmlFor="manager" className="text-foreground">
                  Assign Manager
                </Label>
                <Select value={formData.manager} onValueChange={(value) => handleChange('manager', value)}>
                  <SelectTrigger className="bg-background border-border text-foreground">
                    <SelectValue placeholder="Select a manager" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {managers.map((manager) => (
                      <SelectItem key={manager.id} value={manager.id}>
                        {manager.name} - {manager.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Success Message */}
              {submitted && (
                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className="text-sm text-green-500">Project created successfully!</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 h-auto"
              >
                Create Project
              </Button>

              {/* Info Alert */}
              <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-500">
                  You can add members to this project after creation.
                </p>
              </div>
            </form>
          </Card>
        </div>

        {/* Team Selection Sidebar */}
        <div className="space-y-6">
          {/* Manager Brief */}
          {selectedManager && (
            <Card className="bg-card border-border p-6 sticky top-6">
              <h3 className="font-semibold text-foreground mb-4">Selected Manager</h3>
              <div className="space-y-4">
                <div className="p-4 bg-background rounded-lg border border-primary/30">
                  <p className="font-medium text-foreground mb-2">{selectedManager.name}</p>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p>Department: {selectedManager.department}</p>
                    <p>Experience: {selectedManager.experience} years</p>
                    <p>Current Workload: {selectedManager.currentWorkload}%</p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${selectedManager.currentWorkload}%` }}
                        />
                      </div>
                      <span className="font-medium text-foreground">
                        {selectedManager.currentWorkload}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          <Card className="bg-card border-border p-6 sticky top-6">
            <h3 className="font-semibold text-foreground mb-4">Assign Team Members</h3>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {members.map((member) => (
                <div key={member.id} className="p-3 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={member.id}
                      checked={formData.selectedMembers.includes(member.id)}
                      onCheckedChange={() => toggleMember(member.id)}
                      className="mt-1"
                    />
                    <label
                      htmlFor={member.id}
                      className="flex-1 text-sm cursor-pointer"
                    >
                      <p className="font-medium text-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground mb-2">{member.department}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Workload:</span>
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent"
                            style={{ width: `${member.currentWorkload}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-foreground">
                          {member.currentWorkload}%
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {selectedMemberObjects.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">
                  {selectedMemberObjects.length} member(s) selected
                </p>
                <div className="space-y-2">
                  {selectedMemberObjects.map((member) => (
                    <div
                      key={member.id}
                      className="p-2 bg-background rounded-lg border border-border"
                    >
                      <p className="text-xs font-medium text-foreground">
                        {member.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Workload: {member.currentWorkload}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
