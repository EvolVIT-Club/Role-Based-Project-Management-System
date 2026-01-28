'use client';

import React from "react"

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AddAdminPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Engineering',
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
      setFormData({ name: '', email: '', department: 'Engineering' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Add New Admin</h1>
        <p className="text-muted-foreground">Create a new administrator account for system management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card className="bg-card border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter full name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department" className="text-foreground">
                Department
              </Label>
              <Input
                id="department"
                type="text"
                placeholder="e.g., Engineering"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                required
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Success Message */}
            {submitted && (
              <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-500">Admin account created successfully!</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 h-auto"
            >
              Create Admin Account
            </Button>

            {/* Info Alert */}
            <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-blue-500 font-medium">Admin Privileges</p>
                <p className="text-xs text-blue-500">
                  New admins will have full system access including user management, project creation, and system configuration.
                </p>
              </div>
            </div>
          </form>
        </Card>

        {/* Info Card */}
        <div className="space-y-6">
          <Card className="bg-card border-border p-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Admin Responsibilities</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span>Manage system users (admins, managers, members)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span>Create and oversee projects</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span>Monitor overall system performance</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span>Assign managers to projects</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold mt-1">•</span>
                <span>Review team workload and capacity</span>
              </li>
            </ul>
          </Card>

          <Card className="bg-card border-border p-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Default Login Credentials</h3>
            <div className="space-y-2 text-sm bg-background p-4 rounded-lg border border-border">
              <p><span className="text-muted-foreground">Username:</span> <span className="text-foreground font-medium">admin_[last_name_lowercase]</span></p>
              <p><span className="text-muted-foreground">Password:</span> <span className="text-foreground font-medium">Temporary password sent to email</span></p>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Admin users must change their password on first login for security purposes.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
