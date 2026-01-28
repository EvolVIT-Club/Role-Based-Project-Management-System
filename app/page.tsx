'use client';

import React from "react"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = login(username, password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Invalid username or password. Try: admin/admin123');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { username: 'admin', password: 'admin123', role: 'Admin' },
    { username: 'sarah', password: 'sarah123', role: 'Manager' },
    { username: 'emily', password: 'emily123', role: 'Member' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="inline-block bg-primary p-3 rounded-lg mb-4">
            <div className="w-8 h-8 bg-background rounded flex items-center justify-center">
              <span className="text-primary font-bold text-lg">PM</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Project Manager</h1>
          <p className="text-muted-foreground">Enterprise Project Management System</p>
        </div>

        {/* Login Card */}
        <Card className="bg-card border border-border p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 h-auto"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Card>

        {/* Demo Credentials */}
        <div className="space-y-3">
          <p className="text-center text-sm text-muted-foreground mb-4">Demo Credentials:</p>
          {demoCredentials.map((cred) => (
            <div
              key={cred.username}
              className="p-3 bg-card border border-border rounded-lg hover:bg-card/80 cursor-pointer transition-colors"
              onClick={() => {
                setUsername(cred.username);
                setPassword(cred.password);
              }}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">{cred.role}</span>
                <span className="text-xs text-muted-foreground">{cred.username}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
