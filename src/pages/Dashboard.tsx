import React from 'react';
import { BarChart3, Users, CheckCircle, AlertTriangle, Clock, Camera, FileText, Settings, Shield, Package, AlertCircle, Image } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: 'customer-loop' | 'daily-tasks') => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
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
    { icon: Image, label: 'Photos' }
  ];

  const stats = [
    { label: 'Tasks Completed Today', value: '12', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending Work Orders', value: '3', color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Safety Incidents', value: '0', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Equipment Issues', value: '1', color: 'text-red-600', bg: 'bg-red-50' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Wawa Facilities Dashboard</h1>
          <p className="text-gray-600">Welcome to the Wawa Facilities Associate Management System</p>
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
                <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Customer Loop #1 Completed</p>
                    <p className="text-sm text-gray-600">All 5 areas inspected successfully</p>
                    <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <Camera className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Photos Uploaded</p>
                    <p className="text-sm text-gray-600">5 inspection photos added to system</p>
                    <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Equipment Issue Reported</p>
                    <p className="text-sm text-gray-600">Coffee machine #2 needs maintenance</p>
                    <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}