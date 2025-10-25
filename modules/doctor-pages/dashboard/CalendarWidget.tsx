import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ChevronRight, ChevronLeft, Video, Phone, User, Loader2 } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { API_CONFIG } from '@/lib/api-config';

interface Appointment {
  id: number;
  patientName: string;
  time: string;
  endTime: string;
  date: string;
  purpose: string;
  type: string;
  status: string;
  method: string;
  notes: string;
  patientId: number;
}

const CalendarWidget = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [calendarOffset, setCalendarOffset] = useState(0);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState('all');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState<number | null>(null);

  // Get doctor ID from localStorage
  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      setDoctorId(parseInt(userId));
    }
  }, []);

  // Fetch appointments from API
  useEffect(() => {
    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/appointments/doctor/${doctorId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        }
      );

      if (response.ok) {
        const result = await response.json();
        const formattedAppointments = (result.data || []).map((apt: any) => ({
          id: apt.appointment_id,
          patientName: apt.patient_name || 'Unknown Patient',
          time: apt.start_time?.substring(0, 5) || '00:00',
          endTime: apt.end_time?.substring(0, 5) || '00:00',
          date: apt.appointment_date,
          purpose: apt.reason_for_visit || apt.appointment_type || 'Consultation',
          type: apt.appointment_type || 'consultation',
          status: apt.status || 'confirmed',
          method: apt.visit_type || 'in-person',
          notes: apt.notes || '',
          patientId: apt.patient_id
        }));
        setAppointments(formattedAppointments);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter appointments based on selected date
  useEffect(() => {
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
    const filtered = appointments.filter(appointment => 
      appointment.date === selectedDateStr
    );
    
    // Apply additional filters
    if (filter !== 'all') {
      return setFilteredAppointments(filtered.filter(app => app.method === filter));
    }
    
    setFilteredAppointments(filtered);
  }, [selectedDate, appointments, filter]);

  // Generate dates for mini calendar
  const generateCalendarDays = () => {
    const days = [];
    for (let i = -3 + calendarOffset; i <= 3 + calendarOffset; i++) {
      const date = addDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      days.push({
        date,
        dayName: format(date, 'EEE'),
        dayNumber: format(date, 'd'),
        isToday: isSameDay(date, today),
        hasAppointments: appointments.some(app => app.date === dateStr)
      });
    }
    return days;
  };

  const calendarDays = generateCalendarDays();

  // Get appointment type color
  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case 'consultation':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'check-up':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'follow-up':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get appointment status indicator
  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-amber-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get appointment method icon
  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'video':
        return <Video size={14} className="text-blue-600" />;
      case 'phone':
        return <Phone size={14} className="text-purple-600" />;
      case 'in-person':
        return <User size={14} className="text-emerald-600" />;
      default:
        return null;
    }
  };

  // Navigate calendar
  const navigateCalendar = (direction: number) => {
    setCalendarOffset(calendarOffset + direction);
  };

  // Convert 24-hour time to 12-hour format with AM/PM
  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#006D77] flex items-center">
          <Calendar className="mr-2" size={20} />
          Today's Schedule
        </h2>
        <Link href="/Doctor/Calendar" className="text-[#006D77] hover:underline flex items-center">
          View Full Schedule <ChevronRight size={16} />
        </Link>
      </div>
      
      {/* Mini Calendar Navigation */}
      <div className="flex justify-between items-center mb-2">
        <button 
          onClick={() => navigateCalendar(-7)}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-600"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-medium text-gray-700">
          {format(calendarDays[0].date, 'MMM d')} - {format(calendarDays[6].date, 'MMM d, yyyy')}
        </span>
        <button 
          onClick={() => navigateCalendar(7)}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-600"
        >
          <ChevronRight size={16} />
        </button>
      </div>
      
      {/* Mini Calendar */}
      <div className="flex justify-between mb-4">
        {calendarDays.map((day) => (
          <div 
            key={day.date.toString()}
            onClick={() => setSelectedDate(day.date)}
            className={`flex flex-col items-center p-2 rounded-lg cursor-pointer transition-colors relative
              ${day.isToday ? 'bg-[#006D77] text-white' : 
                selectedDate.toDateString() === day.date.toDateString() ? 'bg-[#E8F3F4] text-[#006D77]' : 'hover:bg-gray-100'}
            `}
          >
            <span className="text-xs font-medium">{day.dayName}</span>
            <span className="text-sm font-bold">{day.dayNumber}</span>
            {day.hasAppointments && !day.isToday && selectedDate.toDateString() !== day.date.toDateString() && (
              <span className="absolute bottom-1 w-1.5 h-1.5 bg-[#006D77] rounded-full"></span>
            )}
          </div>
        ))}
      </div>

      {/* Appointment Filters */}
      <div className="flex mb-3 space-x-2 text-xs">
        <button 
          onClick={() => setFilter('all')}
          className={`px-2 py-1 rounded-md transition-colors ${filter === 'all' ? 'bg-[#006D77] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('in-person')}
          className={`px-2 py-1 rounded-md transition-colors flex items-center ${filter === 'in-person' ? 'bg-[#006D77] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          <User size={12} className="mr-1" /> In-person
        </button>
        <button 
          onClick={() => setFilter('video')}
          className={`px-2 py-1 rounded-md transition-colors flex items-center ${filter === 'video' ? 'bg-[#006D77] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          <Video size={12} className="mr-1" /> Video
        </button>
        <button 
          onClick={() => setFilter('phone')}
          className={`px-2 py-1 rounded-md transition-colors flex items-center ${filter === 'phone' ? 'bg-[#006D77] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
        >
          <Phone size={12} className="mr-1" /> Phone
        </button>
      </div>
      
      {/* Appointments List */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#006D77] mr-2" />
            <span className="text-gray-600">Loading appointments...</span>
          </div>
        ) : filteredAppointments.length > 0 ? (
          filteredAppointments
            .sort((a, b) => {
              const [hoursA, minutesA] = a.time.split(':').map(Number);
              const [hoursB, minutesB] = b.time.split(':').map(Number);
              return hoursA * 60 + minutesA - (hoursB * 60 + minutesB);
            })
            .map(appointment => (
              <div 
                key={appointment.id}
                className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-[#F0F9FA] transition-colors"
              >
                <div className="mr-3 bg-[#E8F3F4] p-2 rounded-md flex-shrink-0">
                  <Clock size={18} className="text-[#006D77]" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <p className="font-medium text-gray-800 flex items-center">
                      {appointment.patientName}
                      <span className={`ml-2 w-2 h-2 rounded-full ${getStatusIndicator(appointment.status)}`}></span>
                    </p>
                    <div className="flex items-center">
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 flex items-center">
                        {getMethodIcon(appointment.method)}
                        <span className="ml-1">{appointment.method}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{formatTime(appointment.time)} - {formatTime(appointment.endTime)}</span>
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getAppointmentTypeColor(appointment.type)}`}>
                      {appointment.purpose}
                    </span>
                  </div>
                  {appointment.notes && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{appointment.notes}</p>
                  )}
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No appointments scheduled for this day</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarWidget;