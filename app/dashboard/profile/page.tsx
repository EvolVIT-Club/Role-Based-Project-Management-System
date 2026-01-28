'use client';

import React from "react"

import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Upload } from 'lucide-react';

export default function ProfilePage() {
  const { user, getUserData } = useAuth();
  const userData = user ? getUserData(user.id) : null;

  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(userData?.photoUrl || '');
  const [editData, setEditData] = useState({
    name: userData?.name || '',
    address: userData?.address || '',
    dateOfBirth: userData?.dateOfBirth || '',
    photoUrl: userData?.photoUrl || '',
  });
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [submitMessage, setSubmitMessage] = useState('');

  const handleEditChange = (field: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditMode: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (isEditMode) {
          setEditData((prev) => ({
            ...prev,
            photoUrl: base64,
          }));
        } else {
          setProfilePhoto(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSubmit = () => {
    setSubmitMessage('Profile updated successfully!');
    setTimeout(() => {
      setEditMode(false);
      setSubmitMessage('');
    }, 2000);
  };

  const handlePasswordSubmit = () => {
    if (passwordData.new === passwordData.confirm) {
      setSubmitMessage('Password changed successfully!');
      setPasswordData({ current: '', new: '', confirm: '' });
      setTimeout(() => setSubmitMessage(''), 2000);
    }
  };

  if (!userData) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Tabs defaultValue="view" className="w-full">
        <TabsList className="bg-card border-border">
          <TabsTrigger value="view">View Profile</TabsTrigger>
          <TabsTrigger value="edit">Edit Profile</TabsTrigger>
          <TabsTrigger value="password">Change Password</TabsTrigger>
        </TabsList>

        {/* View Profile Tab */}
        <TabsContent value="view" className="space-y-4">
          <Card className="bg-card border-border p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative group">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto || "/placeholder.svg"}
                      alt={userData.name}
                      className="w-40 h-40 rounded-lg object-cover border-2 border-primary/30"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-lg bg-muted border-2 border-border flex items-center justify-center">
                      <span className="text-5xl font-bold text-muted-foreground">
                        {userData.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <Upload className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, false)}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-muted-foreground text-center">Hover to change photo</p>
              </div>

              {/* Basic Information */}
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                  <p className="text-lg font-medium text-foreground">{userData.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="text-lg font-medium text-foreground">{userData.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Role</p>
                  <p className="text-lg font-medium text-foreground capitalize">
                    {userData.role}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Department</p>
                  <p className="text-lg font-medium text-foreground">{userData.department}</p>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Date of Birth</p>
                  <p className="text-lg font-medium text-foreground">
                    {new Date(userData.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Address</p>
                  <p className="text-lg font-medium text-foreground">{userData.address}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Experience</p>
                  <p className="text-lg font-medium text-foreground">
                    {userData.experience} years
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Current Workload</p>
                  <p className="text-lg font-medium text-foreground">
                    {userData.currentWorkload}%
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Edit Profile Tab */}
        <TabsContent value="edit" className="space-y-4">
          <Card className="bg-card border-border p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profile Photo Upload Section */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative group">
                  {editData.photoUrl ? (
                    <img
                      src={editData.photoUrl || "/placeholder.svg"}
                      alt={editData.name}
                      className="w-40 h-40 rounded-lg object-cover border-2 border-primary/30"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-lg bg-muted border-2 border-border flex items-center justify-center">
                      <span className="text-5xl font-bold text-muted-foreground">
                        {editData.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <Upload className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-muted-foreground text-center">Hover to upload photo</p>
              </div>

              {/* Form Fields */}
              <div className="md:col-span-2">
                <form onSubmit={(e) => { e.preventDefault(); handleEditSubmit(); }} className="space-y-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-foreground">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleEditChange('name', e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-foreground">
                      Date of Birth
                    </Label>
                    <Input
                      id="dob"
                      type="date"
                      value={editData.dateOfBirth.split('T')[0]}
                      onChange={(e) => handleEditChange('dateOfBirth', e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-foreground">
                      Address
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      value={editData.address}
                      onChange={(e) => handleEditChange('address', e.target.value)}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  {/* Success Message */}
                  {submitMessage && (
                    <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <p className="text-sm text-green-500">{submitMessage}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 h-auto"
                  >
                    Save Changes
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Change Password Tab */}
        <TabsContent value="password" className="space-y-4">
          <Card className="bg-card border-border p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative group">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto || "/placeholder.svg"}
                      alt={userData.name}
                      className="w-40 h-40 rounded-lg object-cover border-2 border-primary/30"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-lg bg-muted border-2 border-border flex items-center justify-center">
                      <span className="text-5xl font-bold text-muted-foreground">
                        {userData.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <Upload className="w-6 h-6 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload(e, false)}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-muted-foreground text-center">Hover to change photo</p>
              </div>

              {/* Form Fields */}
              <div className="md:col-span-2">
                <form onSubmit={(e) => { e.preventDefault(); handlePasswordSubmit(); }} className="space-y-6">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="current" className="text-foreground">
                      Current Password
                    </Label>
                    <Input
                      id="current"
                      type="password"
                      value={passwordData.current}
                      onChange={(e) => setPasswordData((prev) => ({ ...prev, current: e.target.value }))}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="new" className="text-foreground">
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="new"
                        type={showPassword ? 'text' : 'password'}
                        value={passwordData.new}
                        onChange={(e) => setPasswordData((prev) => ({ ...prev, new: e.target.value }))}
                        className="bg-background border-border text-foreground pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirm" className="text-foreground">
                      Confirm Password
                    </Label>
                    <Input
                      id="confirm"
                      type="password"
                      value={passwordData.confirm}
                      onChange={(e) => setPasswordData((prev) => ({ ...prev, confirm: e.target.value }))}
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  {/* Error Message */}
                  {passwordData.new &&
                    passwordData.confirm &&
                    passwordData.new !== passwordData.confirm && (
                      <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-sm text-red-500">Passwords do not match</p>
                      </div>
                    )}

                  {/* Success Message */}
                  {submitMessage && (
                    <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <p className="text-sm text-green-500">{submitMessage}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={!passwordData.new || passwordData.new !== passwordData.confirm}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 h-auto disabled:opacity-50"
                  >
                    Change Password
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
