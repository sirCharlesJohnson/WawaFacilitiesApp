import React, { useState } from 'react';
import { ArrowLeft, Printer, Plus, CheckCircle, Clock, Users, Snowflake, Home, Trash2, Car, Fuel, AlertTriangle } from 'lucide-react';

interface DailyTasksProps {
  onBack: () => void;
  onTaskComplete?: (taskTitle: string, source: 'daily' | 'loop') => void;
  notes?: { [key: number]: string };
  onNotesUpdate?: (notes: { [key: number]: string }) => void;
}

interface Task {
  id: number;
  title: string;
  category: string;
  location: string;
  frequency: string;
  priority: 'High Priority' | 'Medium Priority';
  icon: React.ComponentType<any>;
  completed: boolean;
}

export default function DailyTasks({ onBack, onTaskComplete, notes = {}, onNotesUpdate }: DailyTasksProps) {
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const [activeCategory, setActiveCategory] = useState('All');

  const tasks: Task[] = [
    // Restrooms
    {
      id: 1,
      title: "Restroom Cleaning - 1st shift",
      category: "Restrooms",
      location: "Restrooms",
      frequency: "1st shift only",
      priority: "High Priority",
      icon: Users,
      completed: false
    },

    // Cold Box and Beer Cave
    {
      id: 2,
      title: "Check holes and fill them first",
      category: "Cold Box and Beer Cave",
      location: "Cold Box and Beer Cave",
      frequency: "Multiple times per shift",
      priority: "High Priority",
      icon: Snowflake,
      completed: false
    },
    {
      id: 3,
      title: "Pack out cold box",
      category: "Cold Box and Beer Cave",
      location: "Cold Box and Beer Cave",
      frequency: "As needed throughout shift",
      priority: "High Priority",
      icon: Snowflake,
      completed: false
    },
    {
      id: 4,
      title: "Code and label checks",
      category: "Cold Box and Beer Cave",
      location: "Cold Box and Beer Cave",
      frequency: "Daily",
      priority: "High Priority",
      icon: Snowflake,
      completed: false
    },
    {
      id: 5,
      title: "Put away any orders, organize backstock, clean under racks",
      category: "Cold Box and Beer Cave",
      location: "Cold Box and Beer Cave",
      frequency: "Daily",
      priority: "High Priority",
      icon: Snowflake,
      completed: false
    },

    // Inside
    {
      id: 6,
      title: "Inside trash and cardboard breakdown",
      category: "Inside",
      location: "Inside",
      frequency: "Multiple times per shift",
      priority: "Medium Priority",
      icon: Trash2,
      completed: false
    },
    {
      id: 7,
      title: "Maintain sales floor cleanliness, sweep, mop and spill cleanup",
      category: "Inside",
      location: "Inside",
      frequency: "Multiple times per shift",
      priority: "High Priority",
      icon: Home,
      completed: false
    },
    {
      id: 8,
      title: "Clean vestibule, floor is dry and free of spills/obstacles",
      category: "Inside",
      location: "Inside",
      frequency: "Daily",
      priority: "Medium Priority",
      icon: Home,
      completed: false
    },
    {
      id: 9,
      title: "Maintain backroom - including dry stock and backstock",
      category: "Inside",
      location: "Inside",
      frequency: "Daily",
      priority: "Medium Priority",
      icon: Home,
      completed: false
    },

    // Outside (NJ - Fuel Associates)
    {
      id: 10,
      title: "Outside trash",
      category: "Outside (NJ - Fuel Associates)",
      location: "Outside (NJ - Fuel Associates)",
      frequency: "Multiple times per shift",
      priority: "High Priority",
      icon: Trash2,
      completed: false
    },
    {
      id: 11,
      title: "Sweep parking lot (including leaf blow when necessary)",
      category: "Outside (NJ - Fuel Associates)",
      location: "Outside (NJ - Fuel Associates)",
      frequency: "Daily",
      priority: "Medium Priority",
      icon: Car,
      completed: false
    },
    {
      id: 12,
      title: "Clean landscaping",
      category: "Outside (NJ - Fuel Associates)",
      location: "Outside (NJ - Fuel Associates)",
      frequency: "Daily",
      priority: "Medium Priority",
      icon: Home,
      completed: false
    },
    {
      id: 13,
      title: "Clean parking lot/porch/sidewalk for spills/ice/debris",
      category: "Outside (NJ - Fuel Associates)",
      location: "Outside (NJ - Fuel Associates)",
      frequency: "Multiple times per shift",
      priority: "High Priority",
      icon: Car,
      completed: false
    },
    {
      id: 14,
      title: "Maintain trash area and shed",
      category: "Outside (NJ - Fuel Associates)",
      location: "Outside (NJ - Fuel Associates)",
      frequency: "Daily",
      priority: "Medium Priority",
      icon: Trash2,
      completed: false
    },

    // Fuel (if Fuel Store)
    {
      id: 15,
      title: "Fuel Walk - ensure all pumps working, price sign/pump topper and pump price match, video at pump is working, no unnecessary cones on court, fire extinguishers in code, e-stop buttons labeled, check supplies: washer fluid, towels, squeegees",
      category: "Fuel (if Fuel Store)",
      location: "Fuel (if Fuel Store)",
      frequency: "Multiple times per shift",
      priority: "High Priority",
      icon: Fuel,
      completed: false
    },
    {
      id: 16,
      title: "Sweep Fuel Court and clean any fuel/oil spills",
      category: "Fuel (if Fuel Store)",
      location: "Fuel (if Fuel Store)",
      frequency: "Multiple times per shift",
      priority: "High Priority",
      icon: Fuel,
      completed: false
    },
    {
      id: 17,
      title: "Clean and Empty MPD trashcans",
      category: "Fuel (if Fuel Store)",
      location: "Fuel (if Fuel Store)",
      frequency: "Daily",
      priority: "Medium Priority",
      icon: Trash2,
      completed: false
    },
    {
      id: 18,
      title: "UST Spill Bucket Inspection",
      category: "Fuel (if Fuel Store)",
      location: "Fuel (if Fuel Store)",
      frequency: "Daily",
      priority: "High Priority",
      icon: AlertTriangle,
      completed: false
    },
    {
      id: 19,
      title: "Check and Fill Spill Kits",
      category: "Fuel (if Fuel Store)",
      location: "Fuel (if Fuel Store)",
      frequency: "Daily",
      priority: "Medium Priority",
      icon: AlertTriangle,
      completed: false
    },
    {
      id: 20,
      title: "Check GRinD and Fill Paper",
      category: "Fuel (if Fuel Store)",
      location: "Fuel (if Fuel Store)",
      frequency: "Daily",
      priority: "Medium Priority",
      icon: Fuel,
      completed: false
    },
    {
      id: 21,
      title: "Check Air Pump",
      category: "Fuel (if Fuel Store)",
      location: "Fuel (if Fuel Store)",
      frequency: "Daily",
      priority: "Medium Priority",
      icon: Fuel,
      completed: false
    },
    {
      id: 22,
      title: "Complete fuel compliance on MyWawa",
      category: "Fuel (if Fuel Store)",
      location: "Fuel (if Fuel Store)",
      frequency: "Daily",
      priority: "High Priority",
      icon: Fuel,
      completed: false
    }
  ];

  const categories = [
    'All',
    'Restrooms',
    'Cold Box and Beer Cave',
    'Inside',
    'Outside (NJ - Fuel Associates)',
    'Fuel (if Fuel Store)',
    'Special Tasks'
  ];

  const filteredTasks = activeCategory === 'All' 
    ? tasks 
    : tasks.filter(task => task.category === activeCategory);

  const totalTasks = tasks.length;
  const completedCount = completedTasks.size;
  const progress = Math.round((completedCount / totalTasks) * 100);


  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const completedTasksList = tasks
        .filter(task => completedTasks.has(task.id))
        .map(task => `• ${task.title} (${task.location})`)
        .join('\n');
      
      const reportContent = `
        <html>
          <head>
            <title>Daily Tasks Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; }
              .summary { background: #f5f5f5; padding: 15px; margin: 15px 0; }
              .tasks { margin: 15px 0; }
              .notes { margin-top: 20px; }
            </style>
          </head>
          <body>
            <h1>Facilities Daily Role Guide Report</h1>
            <div class="summary">
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
              <p><strong>Tasks Completed:</strong> ${completedCount}/${totalTasks}</p>
              <p><strong>Progress:</strong> ${progress}%</p>
              <p><strong>Active Category:</strong> ${activeCategory}</p>
            </div>
            <div class="tasks">
              <h2>Completed Tasks:</h2>
              <pre>${completedTasksList || 'No tasks completed'}</pre>
            </div>
            <div class="notes">
              <h2>Notes:</h2>
              ${Object.entries(notes)
                .filter(([_, note]) => note.trim())
                .map(([taskId, note]) => {
                  const task = tasks.find(t => t.id === parseInt(taskId));
                  return `<p><strong>${task?.title || 'Unknown Task'}:</strong> ${note}</p>`;
                })
                .join('') || '<p>No notes recorded</p>'}
            </div>
          </body>
        </html>
      `;
      
      printWindow.document.write(reportContent);
      printWindow.document.close();
      printWindow.print();
    }
  };


  const handleTaskComplete = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
        // Notify parent component when task is completed
        if (task && onTaskComplete) {
          onTaskComplete(task.title, 'daily');
        }
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </button>
            
            <button 
              onClick={handlePrintReport}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <Printer className="w-5 h-5 mr-1" />
              <span className="hidden sm:inline">Print Report</span>
            </button>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Facilities Daily Role Guide</h1>
          <p className="text-gray-600 mb-6">Track your daily and shift-specific responsibilities</p>
          
          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-700">{completedCount}/{totalTasks} tasks completed today</span>
          </div>

          {/* Progress Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Daily Progress</h2>
              <span className="text-3xl font-bold text-blue-600">{progress}%</span>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{completedCount} completed</span>
              <span>{totalTasks - completedCount} remaining</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
            <button className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
              <Plus className="w-4 h-4 mr-1" />
              Add Special Task
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
              {/* Task Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  <button
                    onClick={() => handleTaskComplete(task.id)}
                    className={`p-2 rounded-full transition-colors mt-1 ${
                      completedTasks.has(task.id)
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center">
                        <task.icon className="w-4 h-4 mr-1" />
                        {task.location}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {task.frequency}
                      </span>
                    </div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      task.priority === 'High Priority'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleTaskComplete(task.id)}
                  className={`p-2 rounded-full transition-colors ${
                    completedTasks.has(task.id)
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
                  }`}
                >
                  <CheckCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Notes Section */}
              <div>
                <textarea
                  placeholder="Add notes about this task..."
                  value={notes[task.id] || ''}
                  onChange={(e) => onNotesUpdate?.({ ...notes, [task.id]: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Completion Status */}
        {completedCount === totalTasks && (
          <div className="mt-6 p-6 bg-green-100 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <h3 className="text-green-800 font-semibold text-lg">All Daily Tasks Completed!</h3>
                <p className="text-green-700 mt-1">
                  Excellent work! All {totalTasks} tasks have been completed for today.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}