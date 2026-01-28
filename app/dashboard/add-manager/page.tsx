'use client';

import React from "react"

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { departments } from '@/lib/dummy-data';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AddManagerPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'dept-1',
    otherDepartment: '',
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
      setFormData({ name: '', email: '', department: 'dept-1', otherDepartment: '' });
      setSubmitted(false);
    }, 3000);
  };

  const finalDepartment =
    formData.department === 'other' ? formData.otherDepartment : formData.department;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Add Manager</h1>
        <p className="text-muted-foreground">Create a new manager profile</p>
      </div>

      {/* Form */}
      <Card className="bg-card border-border p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter manager name"
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
              placeholder="manager@company.com"
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
            <Select value={formData.department} onValueChange={(value) => handleChange('department', value)}>
              <SelectTrigger className="bg-background border-border text-foreground">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Other Department Input */}
          {formData.department === 'other' && (
            <div className="space-y-2">
              <Label htmlFor="otherDept" className="text-foreground">
                Enter Department Name
              </Label>
              <Input
                id="otherDept"
                type="text"
                placeholder="Enter custom department"
                value={formData.otherDepartment}
                onChange={(e) => handleChange('otherDepartment', e.target.value)}
                required
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          )}

          {/* Success Message */}
          {submitted && (
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-500">Manager added successfully!</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 h-auto"
          >
            Add Manager
          </Button>

          {/* Info Alert */}
          <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-500">
              A temporary password will be generated and sent to the manager via email.
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}
