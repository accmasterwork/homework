'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ArrowLeft, Settings, Save, Shield, Mail, Globe, Database } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    // Platform Settings
    platformName: 'Open Source Project Manager',
    platformDescription: 'A comprehensive platform for managing open-source projects',
    platformUrl: 'https://your-domain.com',
    supportEmail: 'support@your-domain.com',
    
    // Security Settings
    requireEmailVerification: true,
    allowPublicRegistration: true,
    sessionTimeout: 24, // hours
    maxLoginAttempts: 5,
    
    // Feature Flags
    enableDiscussions: true,
    enableProjectTemplates: true,
    enableGitHubIntegration: true,
    enableNotifications: true,
    
    // Email Settings
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@your-domain.com',
    
    // Storage Settings
    maxFileSize: 10, // MB
    allowedFileTypes: 'jpg,jpeg,png,gif,pdf,doc,docx,txt,md',
    storageProvider: 'local', // local, s3, cloudinary
    
    // API Settings
    rateLimitRequests: 100,
    rateLimitWindow: 15, // minutes
    enableApiKeys: true,
    
    // Maintenance
    maintenanceMode: false,
    maintenanceMessage: 'The platform is currently under maintenance. Please check back later.'
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (!loading && user && user.email !== 'admin@example.com') {
      router.push('/dashboard');
      return;
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.email !== 'admin@example.com') {
    return null;
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Mock save - in real implementation, this would call /api/admin/settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Admin Dashboard
            </Link>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <Settings className="h-8 w-8 mr-3" />
            Platform Settings
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure platform-wide settings and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Platform Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Platform Configuration
              </CardTitle>
              <CardDescription>Basic platform information and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Platform Name
                  </label>
                  <Input
                    value={settings.platformName}
                    onChange={(e) => updateSetting('platformName', e.target.value)}
                    placeholder="Your Platform Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Platform URL
                  </label>
                  <Input
                    value={settings.platformUrl}
                    onChange={(e) => updateSetting('platformUrl', e.target.value)}
                    placeholder="https://your-domain.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Platform Description
                </label>
                <Textarea
                  value={settings.platformDescription}
                  onChange={(e) => updateSetting('platformDescription', e.target.value)}
                  placeholder="Describe your platform..."
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Support Email
                </label>
                <Input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => updateSetting('supportEmail', e.target.value)}
                  placeholder="support@your-domain.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security & Authentication
              </CardTitle>
              <CardDescription>Configure security policies and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      Require Email Verification
                    </label>
                    <input
                      type="checkbox"
                      checked={settings.requireEmailVerification}
                      onChange={(e) => updateSetting('requireEmailVerification', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      Allow Public Registration
                    </label>
                    <input
                      type="checkbox"
                      checked={settings.allowPublicRegistration}
                      onChange={(e) => updateSetting('allowPublicRegistration', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Session Timeout (hours)
                    </label>
                    <Input
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => updateSetting('sessionTimeout', parseInt(e.target.value))}
                      min="1"
                      max="168"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Max Login Attempts
                    </label>
                    <Input
                      type="number"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => updateSetting('maxLoginAttempts', parseInt(e.target.value))}
                      min="3"
                      max="10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Flags */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>Enable or disable platform features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      Enable Discussions
                    </label>
                    <input
                      type="checkbox"
                      checked={settings.enableDiscussions}
                      onChange={(e) => updateSetting('enableDiscussions', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      Enable Project Templates
                    </label>
                    <input
                      type="checkbox"
                      checked={settings.enableProjectTemplates}
                      onChange={(e) => updateSetting('enableProjectTemplates', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      Enable GitHub Integration
                    </label>
                    <input
                      type="checkbox"
                      checked={settings.enableGitHubIntegration}
                      onChange={(e) => updateSetting('enableGitHubIntegration', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">
                      Enable Notifications
                    </label>
                    <input
                      type="checkbox"
                      checked={settings.enableNotifications}
                      onChange={(e) => updateSetting('enableNotifications', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Email Configuration
              </CardTitle>
              <CardDescription>Configure SMTP settings for email delivery</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    SMTP Host
                  </label>
                  <Input
                    value={settings.smtpHost}
                    onChange={(e) => updateSetting('smtpHost', e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    SMTP Port
                  </label>
                  <Input
                    type="number"
                    value={settings.smtpPort}
                    onChange={(e) => updateSetting('smtpPort', parseInt(e.target.value))}
                    placeholder="587"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    SMTP Username
                  </label>
                  <Input
                    value={settings.smtpUsername}
                    onChange={(e) => updateSetting('smtpUsername', e.target.value)}
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    From Email
                  </label>
                  <Input
                    type="email"
                    value={settings.fromEmail}
                    onChange={(e) => updateSetting('fromEmail', e.target.value)}
                    placeholder="noreply@your-domain.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  SMTP Password
                </label>
                <Input
                  type="password"
                  value={settings.smtpPassword}
                  onChange={(e) => updateSetting('smtpPassword', e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </CardContent>
          </Card>

          {/* Storage Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Storage & Files
              </CardTitle>
              <CardDescription>Configure file upload and storage settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Max File Size (MB)
                  </label>
                  <Input
                    type="number"
                    value={settings.maxFileSize}
                    onChange={(e) => updateSetting('maxFileSize', parseInt(e.target.value))}
                    min="1"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Storage Provider
                  </label>
                  <select
                    value={settings.storageProvider}
                    onChange={(e) => updateSetting('storageProvider', e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="local">Local Storage</option>
                    <option value="s3">Amazon S3</option>
                    <option value="cloudinary">Cloudinary</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Allowed File Types
                </label>
                <Input
                  value={settings.allowedFileTypes}
                  onChange={(e) => updateSetting('allowedFileTypes', e.target.value)}
                  placeholder="jpg,jpeg,png,gif,pdf,doc,docx,txt,md"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Comma-separated list of allowed file extensions
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Mode */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Mode</CardTitle>
              <CardDescription>Enable maintenance mode to temporarily disable the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  Enable Maintenance Mode
                </label>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => updateSetting('maintenanceMode', e.target.checked)}
                  className="rounded"
                />
              </div>
              {settings.maintenanceMode && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Maintenance Message
                  </label>
                  <Textarea
                    value={settings.maintenanceMessage}
                    onChange={(e) => updateSetting('maintenanceMessage', e.target.value)}
                    placeholder="Enter a message to display to users during maintenance..."
                    rows={3}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <Button onClick={handleSave} disabled={isSaving} size="lg" className="flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving Settings...' : 'Save All Settings'}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
