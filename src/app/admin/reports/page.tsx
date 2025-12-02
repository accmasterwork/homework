'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, FileText, Download, Calendar, Users, AlertTriangle, TrendingUp, Activity } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminReportsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleGenerateReport = async (reportType: string) => {
    setIsGenerating(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock CSV data
      const reportData = generateMockReportData(reportType);
      downloadReport(reportData, reportType);
      
      toast.success(`${reportType} report generated and downloaded successfully!`);
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockReportData = (reportType: string): string => {
    const headers = ['Date', 'Metric', 'Value', 'Change'];
    const rows = [
      ['2024-11-28', 'Active Users', '245', '+12%'],
      ['2024-11-27', 'Active Users', '233', '+8%'],
      ['2024-11-26', 'Active Users', '216', '+5%'],
      ['2024-11-25', 'Active Users', '205', '+3%'],
      ['2024-11-24', 'Active Users', '199', '+2%'],
    ];
    
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      csvContent += row.join(',') + '\n';
    });
    
    return csvContent;
  };

  const downloadReport = (data: string, reportType: string) => {
    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const fileName = `${reportType.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadExistingReport = (report: any) => {
    // Generate mock data for the existing report
    const reportData = generateMockReportData(report.type);
    downloadReport(reportData, report.name);
    toast.success(`Downloaded ${report.name}`);
  };

  const reportTypes = [
    {
      id: 'user-activity',
      title: 'User Activity Report',
      description: 'Detailed analysis of user engagement, login patterns, and activity trends',
      icon: Users,
      color: 'bg-blue-100 text-blue-800',
      metrics: ['Active Users', 'Session Duration', 'Page Views', 'Feature Usage']
    },
    {
      id: 'project-analytics',
      title: 'Project Analytics Report',
      description: 'Comprehensive overview of project creation, growth, and performance metrics',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-800',
      metrics: ['Project Creation Rate', 'Stars & Forks', 'Contributor Growth', 'Issue Resolution']
    },
    {
      id: 'security-audit',
      title: 'Security Audit Report',
      description: 'Security incidents, failed login attempts, and vulnerability assessments',
      icon: AlertTriangle,
      color: 'bg-red-100 text-red-800',
      metrics: ['Failed Logins', 'Security Incidents', 'Vulnerability Scans', 'Access Patterns']
    },
    {
      id: 'platform-performance',
      title: 'Platform Performance Report',
      description: 'System performance, uptime, response times, and resource utilization',
      icon: Activity,
      color: 'bg-purple-100 text-purple-800',
      metrics: ['Uptime', 'Response Times', 'Error Rates', 'Resource Usage']
    }
  ];

  const recentReports = [
    {
      id: '1',
      name: 'Monthly User Activity - November 2024',
      type: 'User Activity',
      generatedAt: '2024-11-28T10:30:00Z',
      size: '2.4 MB',
      status: 'completed'
    },
    {
      id: '2',
      name: 'Project Analytics - Q4 2024',
      type: 'Project Analytics',
      generatedAt: '2024-11-25T14:15:00Z',
      size: '1.8 MB',
      status: 'completed'
    },
    {
      id: '3',
      name: 'Security Audit - Weekly Report',
      type: 'Security Audit',
      generatedAt: '2024-11-24T09:00:00Z',
      size: '856 KB',
      status: 'completed'
    },
    {
      id: '4',
      name: 'Platform Performance - November 2024',
      type: 'Platform Performance',
      generatedAt: '2024-11-20T16:45:00Z',
      size: '3.1 MB',
      status: 'completed'
    }
  ];

  const quickStats = {
    totalReports: 47,
    reportsThisMonth: 12,
    avgGenerationTime: '2.3 minutes',
    totalDataSize: '156.7 MB'
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <FileText className="h-8 w-8 mr-3" />
            Reports & Analytics
          </h1>
          <p className="text-muted-foreground mt-2">
            Generate and download comprehensive reports about platform usage and performance
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold text-foreground">{quickStats.totalReports}</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-foreground">{quickStats.reportsThisMonth}</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Generation</p>
                  <p className="text-2xl font-bold text-foreground">{quickStats.avgGenerationTime}</p>
                </div>
                <Activity className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Size</p>
                  <p className="text-2xl font-bold text-foreground">{quickStats.totalDataSize}</p>
                </div>
                <Download className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Types */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Generate New Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTypes.map((report) => {
              const IconComponent = report.icon;
              return (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${report.color}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{report.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {report.description}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-foreground mb-2">Includes:</p>
                        <div className="flex flex-wrap gap-2">
                          {report.metrics.map((metric, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleGenerateReport(report.title)}
                        disabled={isGenerating}
                        className="w-full"
                      >
                        {isGenerating ? 'Generating...' : 'Generate Report'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Previously generated reports available for download</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-muted rounded-lg">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{report.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{report.type}</span>
                        <span>•</span>
                        <span>{new Date(report.generatedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{report.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={report.status === 'completed' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {report.status}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center space-x-1"
                      onClick={() => handleDownloadExistingReport(report)}
                    >
                      <Download className="h-3 w-3" />
                      <span>Download</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Report Scheduling */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Automated Reports</CardTitle>
            <CardDescription>Schedule reports to be generated automatically</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Weekly Security Audit</h4>
                    <Badge variant="outline" className="text-green-600">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Every Monday at 9:00 AM</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Monthly User Activity</h4>
                    <Badge variant="outline" className="text-green-600">Active</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">1st of each month at 8:00 AM</p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Quarterly Analytics</h4>
                    <Badge variant="outline" className="text-gray-600">Inactive</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Every 3 months</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline">
                  Manage Schedules
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
