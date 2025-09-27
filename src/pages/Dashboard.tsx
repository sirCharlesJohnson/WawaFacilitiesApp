import React from 'react';
import { BarChart3, Users, CheckCircle, AlertTriangle, Clock, Camera, FileText, Settings, Shield, Package, AlertCircle, Image, TrendingUp } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: 'customer-loop' | 'daily-tasks' | 'photos') => void;
  completedTasks: number;
  recentActivities: Array<{
    id: string;
    type: 'task' | 'photo' | 'loop' | 'issue';
    title: string;
    description: string;
    timestamp: Date;
    icon: 'check' | 'camera' | 'clock' | 'alert';
    color: 'green' | 'blue' | 'orange' | 'red';
  }>;
  totalPhotos: number;
}

export default function Dashboard({ onNavigate, completedTasks, recentActivities, totalPhotos }: DashboardProps) {
  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', active: true },
    { icon: Clock, label: 'Customer Loop', onClick: () => onNavigate('customer-loop') },
    { icon: CheckCircle, label: 'Daily Tasks', onClick: () => onNavigate('daily-tasks') },
    { icon: FileText, label: 'Work Orders' },
    { icon: Settings, label: 'Equipment' },
    { icon: Shield, label: 'Safety' },
    { icon: Users, label: 'Vendors' },
    { icon: Package, label: 'Inventory' },
    { icon: AlertTriangle, label: 'Issues' },
    { icon: Image, label: 'Photos', onClick: () => onNavigate('photos') }
  ];

  const getActivityIcon = (icon: string) => {
    switch (icon) {
      case 'check': return CheckCircle;
      case 'camera': return Camera;
      case 'clock': return Clock;
      case 'alert': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  const getActivityColor = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-600 bg-green-50';
      case 'blue': return 'text-blue-600 bg-blue-50';
      case 'orange': return 'text-orange-600 bg-orange-50';
      case 'red': return 'text-red-600 bg-red-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  const stats = [
    { label: 'Tasks Completed Today', value: completedTasks.toString(), color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle },
    { label: 'Pending Work Orders', value: '3', color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Safety Incidents', value: '0', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Photos Captured', value: totalPhotos.toString(), color: 'text-blue-600', bg: 'bg-blue-50', icon: Camera }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Wawa Facilities Dashboard</h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600">Welcome to the Wawa Facilities Associate Management System</p>
            <div className="flex items-center text-sm text-gray-500">
              <TrendingUp className="w-4 h-4 mr-1" />
              Live Updates Active
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.bg} rounded-lg p-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
                </div>
                {stat.icon && (
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <nav className="space-y-2">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      item.active
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Live
                </div>
                {recentActivities.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No recent activities</p>
                    <p className="text-sm text-gray-400 mt-1">Complete tasks to see real-time updates here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivities.map((activity) => {
                      const IconComponent = getActivityIcon(activity.icon);
                      const colorClasses = getActivityColor(activity.color);
                      
                      return (
                        <div key={activity.id} className={`flex items-start space-x-3 p-4 rounded-lg ${colorClasses.split(' ')[1]}`}>
                          <IconComponent className={`w-5 h-5 mt-0.5 ${colorClasses.split(' ')[0]}`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}