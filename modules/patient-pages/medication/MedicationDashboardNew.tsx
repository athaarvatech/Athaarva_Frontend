'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus,
  Filter,
  Search,
  Bell,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { usePanel } from '@/hooks/usePanel';
import MedicineCard from '@/components/medicine/MedicineCard';
import MedicinePanel from '@/components/medicine/MedicinePanel';

// Enhanced interfaces for the new design
interface Medication {
  id: number;
  name: string;
  dosage: string;
  purpose: string;
  prescribedBy: string;
  frequency: string;
  timings: string[];
  timeOfDay: ('morning' | 'afternoon' | 'evening' | 'night')[];
  withFood: boolean;
  startDate: string;
  totalPills: number;
  pillsTaken: number;
  pillsRemaining: number;
  refillBy: string;
  nextDose: Date;
  adherence: number;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'paused';
  notes: string;
  reminderEnabled: boolean;
  pillImage: string;
  cost?: number;
  pharmacy?: string;
}

interface DoseSchedule {
  id: string;
  medicationId: number;
  medicationName: string;
  dosage: string;
  time: string;
  timeSlot: 'morning' | 'afternoon' | 'evening' | 'night';
  taken: boolean;
  skipped: boolean;
  takenAt?: string;
  pillsRemaining: number;
  isOverdue: boolean;
  isUpcoming: boolean;
}

const MedicationDashboard = () => {
  // Panel state management
  const { isOpen, selectedItem, openPanel, closePanel } = usePanel<Medication>();
  
  // Filter and view states
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'refill-needed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [reminderSettings, setReminderSettings] = useState({
    enabled: true,
    sound: true,
    beforeMinutes: 15
  });

  // Enhanced mock data
  const medications: Medication[] = [
    {
      id: 1,
      name: 'Metformin',
      dosage: '500mg',
      purpose: 'Type 2 Diabetes',
      prescribedBy: 'Dr. Sarah Johnson',
      frequency: 'Twice daily',
      timings: ['8:00 AM', '8:00 PM'],
      timeOfDay: ['morning', 'evening'],
      withFood: true,
      startDate: '2024-01-15',
      totalPills: 60,
      pillsTaken: 45,
      pillsRemaining: 15,
      refillBy: '2024-08-10',
      nextDose: new Date('2024-08-05T20:00:00'),
      adherence: 94,
      priority: 'high',
      status: 'active',
      notes: 'Take with meals to reduce stomach upset.',
      reminderEnabled: true,
      pillImage: '💊',
      cost: 25.99,
      pharmacy: 'CVS Pharmacy'
    },
    {
      id: 2,
      name: 'Lisinopril',
      dosage: '10mg',
      purpose: 'High Blood Pressure',
      prescribedBy: 'Dr. Michael Chen',
      frequency: 'Once daily',
      timings: ['8:00 AM'],
      timeOfDay: ['morning'],
      withFood: false,
      startDate: '2024-02-01',
      totalPills: 30,
      pillsTaken: 26,
      pillsRemaining: 4,
      refillBy: '2024-08-08',
      nextDose: new Date('2024-08-06T08:00:00'),
      adherence: 98,
      priority: 'high',
      status: 'active',
      notes: 'Monitor blood pressure regularly.',
      reminderEnabled: true,
      pillImage: '🔵',
      cost: 18.50,
      pharmacy: 'Walgreens'
    },
    {
      id: 3,
      name: 'Vitamin D3',
      dosage: '2000 IU',
      purpose: 'Vitamin D Deficiency',
      prescribedBy: 'Dr. Sarah Johnson',
      frequency: 'Once daily',
      timings: ['9:00 AM'],
      timeOfDay: ['morning'],
      withFood: true,
      startDate: '2024-03-01',
      totalPills: 90,
      pillsTaken: 70,
      pillsRemaining: 20,
      refillBy: '2024-09-01',
      nextDose: new Date('2024-08-06T09:00:00'),
      adherence: 89,
      priority: 'medium',
      status: 'active',
      notes: 'Support bone health and immune system.',
      reminderEnabled: false,
      pillImage: '🟡',
      cost: 12.99,
      pharmacy: 'CVS Pharmacy'
    },
    {
      id: 4,
      name: 'Omeprazole',
      dosage: '20mg',
      purpose: 'Acid Reflux',
      prescribedBy: 'Dr. Sarah Johnson',
      frequency: 'Once daily',
      timings: ['7:00 AM'],
      timeOfDay: ['morning'],
      withFood: false,
      startDate: '2024-04-01',
      totalPills: 30,
      pillsTaken: 28,
      pillsRemaining: 2,
      refillBy: '2024-08-06',
      nextDose: new Date('2024-08-06T07:00:00'),
      adherence: 96,
      priority: 'medium',
      status: 'active',
      notes: 'Take 30 minutes before breakfast.',
      reminderEnabled: true,
      pillImage: '🟣',
      cost: 15.75,
      pharmacy: 'CVS Pharmacy'
    }
  ];

  // Today's schedule mock data
  const [todaySchedule, setTodaySchedule] = useState<DoseSchedule[]>([
    {
      id: 'dose_1',
      medicationId: 1,
      medicationName: 'Metformin',
      dosage: '500mg',
      time: '8:00 AM',
      timeSlot: 'morning',
      taken: true,
      skipped: false,
      takenAt: '2024-08-05T08:15:00',
      pillsRemaining: 15,
      isOverdue: false,
      isUpcoming: false
    },
    {
      id: 'dose_2',
      medicationId: 2,
      medicationName: 'Lisinopril',
      dosage: '10mg',
      time: '8:00 AM',
      timeSlot: 'morning',
      taken: true,
      skipped: false,
      takenAt: '2024-08-05T08:05:00',
      pillsRemaining: 4,
      isOverdue: false,
      isUpcoming: false
    },
    {
      id: 'dose_3',
      medicationId: 1,
      medicationName: 'Metformin',
      dosage: '500mg',
      time: '8:00 PM',
      timeSlot: 'evening',
      taken: false,
      skipped: false,
      pillsRemaining: 15,
      isOverdue: false,
      isUpcoming: true
    }
  ]);

  // Filter medications based on active filter
  const getFilteredMedications = () => {
    let filtered = medications;

    // Apply status filter
    if (activeFilter === 'active') {
      filtered = filtered.filter(med => med.status === 'active');
    } else if (activeFilter === 'refill-needed') {
      filtered = filtered.filter(med => (med.pillsRemaining / med.totalPills) <= 0.2);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(med => 
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.purpose.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  // Handle medication actions
  const handleMarkTaken = async (medicationId: number) => {
    // Update medication pill count
    const medIndex = medications.findIndex(med => med.id === medicationId);
    if (medIndex !== -1) {
      medications[medIndex].pillsTaken += 1;
      medications[medIndex].pillsRemaining -= 1;
    }

    // Update today's schedule
    setTodaySchedule(prev => prev.map(dose => 
      dose.medicationId === medicationId && !dose.taken
        ? { ...dose, taken: true, takenAt: new Date().toISOString() }
        : dose
    ));

    // You would typically make an API call here
    console.log('Marked medication as taken:', medicationId);
  };

  const handleRequestRefill = async (medicationId: number, quantity: number, preferredDate: string) => {
    // You would typically make an API call here
    console.log('Refill requested:', { medicationId, quantity, preferredDate });
    
    // Show success message (you can implement toast notifications)
    alert(`Refill request submitted successfully!\n${quantity} pills requested for ${preferredDate}`);
  };

  const filteredMedications = getFilteredMedications();
  const upcomingCount = todaySchedule.filter(dose => dose.isUpcoming).length;
  const refillNeededCount = medications.filter(med => (med.pillsRemaining / med.totalPills) <= 0.2).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Medicines</h1>
              <p className="text-gray-600 mt-1">Manage your prescriptions and track your health</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Medicine
              </Button>
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-gray-500" />
                <Switch
                  checked={reminderSettings.enabled}
                  onCheckedChange={(checked) => 
                    setReminderSettings(prev => ({ ...prev, enabled: checked }))
                  }
                />
                <span className="text-sm text-gray-600">Reminders</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm">Active Medications</p>
                  <p className="text-2xl font-bold">{medications.filter(m => m.status === 'active').length}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-emerald-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Need Refill</p>
                  <p className="text-2xl font-bold">{refillNeededCount}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Upcoming Today</p>
                  <p className="text-2xl font-bold">{upcomingCount}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Adherence Rate</p>
                  <p className="text-2xl font-bold">94%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search medications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('all')}
              >
                All
              </Button>
              <Button
                variant={activeFilter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('active')}
              >
                Active
              </Button>
              <Button
                variant={activeFilter === 'refill-needed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('refill-needed')}
                className="relative"
              >
                <Filter className="w-4 h-4 mr-1" />
                Refill Needed
                {refillNeededCount > 0 && (
                  <Badge className="ml-2 bg-orange-500 text-white text-xs px-1.5 py-0.5">
                    {refillNeededCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Medications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedications.map((medication) => (
            <MedicineCard
              key={medication.id}
              medication={medication}
              onViewDetails={openPanel}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredMedications.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No medications found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? `No medications match "${searchQuery}"`
                  : 'No medications match the selected filter'
                }
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Medicine Detail Panel */}
      <MedicinePanel
        isOpen={isOpen}
        medication={selectedItem}
        onClose={closePanel}
        onMarkTaken={handleMarkTaken}
        onRequestRefill={handleRequestRefill}
      />
    </div>
  );
};

export default MedicationDashboard;
