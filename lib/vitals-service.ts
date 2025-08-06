/**
 * Service for handling vital signs data and wearable device integrations
 */

// Supported wearable device types
export const SUPPORTED_DEVICES = [
  'Apple Watch',
  'Fitbit',
  'Samsung Galaxy Watch',
  'Garmin',
  'Oura Ring',
  'Withings',
  'Google Pixel Watch',
  'Amazfit',
  'Xiaomi Mi Band',
  'Polar'
];

// Type definitions
export interface BloodPressureValue {
  systolic: number;
  diastolic: number;
}

export interface VitalThreshold {
  min?: number;
  max?: number;
  systolic?: number;
  diastolic?: number;
}

export interface VitalThresholds {
  warning: VitalThreshold;
  critical: VitalThreshold;
}

export interface AllVitalThresholds {
  bloodPressure: VitalThresholds;
  heartRate: VitalThresholds;
  oxygenSaturation: VitalThresholds;
  temperature: VitalThresholds;
  [key: string]: VitalThresholds;
}

export type VitalValue = number | string | BloodPressureValue;

export interface Device {
  id: string;
  name: string;
  type: string;
  supported: boolean;
  metrics: string[];
}

export interface ConnectedDevice {
  id: string;
  status: string;
  lastSync: Date;
}

export interface HistoricalDataPoint {
  timestamp: Date;
  value: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface BloodPressureDataPoint {
  timestamp: Date;
  systolic: number;
  diastolic: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface PredictionResult {
  timestamp: Date;
  predictedValue: number;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface VitalsInsight {
  type: 'trend' | 'anomaly' | 'recommendation';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  metric: string;
  value?: number;
  recommendation?: string;
}

export interface Caregiver {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  relationship: string;
}

// Available vital metrics
export const VITAL_METRICS = {
  bloodPressure: {
    name: 'Blood Pressure',
    units: 'mmHg',
    defaultThresholds: {
      warning: { systolic: 130, diastolic: 85 },
      critical: { systolic: 140, diastolic: 90 }
    }
  },
  heartRate: {
    name: 'Heart Rate',
    units: 'bpm',
    defaultThresholds: {
      warning: { min: 50, max: 90 },
      critical: { min: 45, max: 100 }
    }
  },
  oxygenSaturation: {
    name: 'Oxygen Saturation',
    units: '%',
    defaultThresholds: {
      warning: { min: 94 },
      critical: { min: 90 }
    }
  },
  temperature: {
    name: 'Temperature',
    units: '°F',
    defaultThresholds: {
      warning: { min: 97.0, max: 99.5 },
      critical: { min: 96.0, max: 100.4 }
    }
  },
  hydrationLevel: {
    name: 'Hydration Level',
    units: '%',
    defaultThresholds: {
      warning: { min: 60 },
      critical: { min: 50 }
    }
  }
};

// Interface for vital reading
export interface VitalReading {
  type: string;
  value: VitalValue;
  timestamp: Date;
  source: string;
  deviceId?: string;
  units?: string;
}

// Check if a vital reading is in critical range
export const isCriticalReading = (reading: VitalReading, thresholds: AllVitalThresholds): boolean => {
  const metric = reading.type;
  const value = reading.value;
  
  if (metric === 'bloodPressure') {
    const systolic = typeof value === 'string' ? 
      parseInt(value.split('/')[0]) : 
      typeof value === 'object' && 'systolic' in value ? (value as BloodPressureValue).systolic : 0;
    const diastolic = typeof value === 'string' ? 
      parseInt(value.split('/')[1]) : 
      typeof value === 'object' && 'diastolic' in value ? (value as BloodPressureValue).diastolic : 0;
    
    return systolic >= (thresholds.bloodPressure.critical.systolic || 0) || 
           diastolic >= (thresholds.bloodPressure.critical.diastolic || 0);
  }
  
  const metricThresholds = thresholds[metric]?.critical;
  if (!metricThresholds) return false;
  
  const numericValue = typeof value === 'number' ? value : parseFloat(String(value));
  if (metricThresholds.min && numericValue < metricThresholds.min) return true;
  if (metricThresholds.max && numericValue > metricThresholds.max) return true;
  
  return false;
};

// Check if a vital reading is in warning range (but not critical)
export const isWarningReading = (reading: VitalReading, thresholds: AllVitalThresholds): boolean => {
  const metric = reading.type;
  const value = reading.value;
  
  // If it's already critical, it's not just a warning
  if (isCriticalReading(reading, thresholds)) return false;
  
  if (metric === 'bloodPressure') {
    const systolic = typeof value === 'string' ? 
      parseInt(value.split('/')[0]) : 
      typeof value === 'object' && 'systolic' in value ? (value as BloodPressureValue).systolic : 0;
    const diastolic = typeof value === 'string' ? 
      parseInt(value.split('/')[1]) : 
      typeof value === 'object' && 'diastolic' in value ? (value as BloodPressureValue).diastolic : 0;
    
    return systolic >= (thresholds.bloodPressure.warning.systolic || 0) || 
           diastolic >= (thresholds.bloodPressure.warning.diastolic || 0);
  }
  
  const metricThresholds = thresholds[metric]?.warning;
  if (!metricThresholds) return false;
  
  const numericValue = typeof value === 'number' ? value : parseFloat(String(value));
  if (metricThresholds.min && numericValue < metricThresholds.min) return true;
  if (metricThresholds.max && numericValue > metricThresholds.max) return true;
  
  return false;
};

// Format a vital reading for display
export const formatVitalReading = (reading: VitalReading): string => {
  const { type, value, units } = reading;
  
  switch (type) {
    case 'bloodPressure':
      if (typeof value === 'string') return value;
      if (typeof value === 'object' && 'systolic' in value) {
        const bpValue = value as BloodPressureValue;
        return `${bpValue.systolic}/${bpValue.diastolic} mmHg`;
      }
      return `${value} mmHg`;
      
    case 'heartRate':
      return `${value} bpm`;
      
    case 'oxygenSaturation':
      return `${value}%`;
      
    case 'temperature':
      return `${value}°F`;
      
    case 'hydrationLevel':
      return `${value}%`;
      
    default:
      return `${value} ${units || ''}`;
  }
};

// Offline data caching tools
export const offlineCache = {
  // Store a reading in local storage
  storeReading: (reading: VitalReading): void => {
    try {
      // Get existing cached readings or initialize empty array
      const cachedReadingsJson = localStorage.getItem('offlineVitalReadings');
      const cachedReadings = cachedReadingsJson ? JSON.parse(cachedReadingsJson) : [];
      
      // Add the new reading with timestamp
      cachedReadings.push({
        ...reading,
        timestamp: reading.timestamp.toISOString()
      });
      
      // Save back to local storage
      localStorage.setItem('offlineVitalReadings', JSON.stringify(cachedReadings));
      localStorage.setItem('lastOfflineBackup', new Date().toISOString());
    } catch (error) {
      console.error('Failed to cache reading offline:', error);
    }
  },
  
  // Get all cached readings
  getReadings: (): VitalReading[] => {
    try {
      const cachedReadingsJson = localStorage.getItem('offlineVitalReadings');
      if (!cachedReadingsJson) return [];
      
      const cachedReadings = JSON.parse(cachedReadingsJson);
      
      // Convert ISO strings back to Date objects
      return cachedReadings.map((reading: VitalReading & { timestamp: string }) => ({
        ...reading,
        timestamp: new Date(reading.timestamp)
      }));
    } catch (error) {
      console.error('Failed to retrieve cached readings:', error);
      return [];
    }
  },
  
  // Clear synced readings from cache
  clearSyncedReadings: (syncedReadingIds: string[]): void => {
    try {
      const cachedReadingsJson = localStorage.getItem('offlineVitalReadings');
      if (!cachedReadingsJson) return;
      
      const cachedReadings = JSON.parse(cachedReadingsJson);
      const remainingReadings = cachedReadings.filter((reading: VitalReading & { id: string }) => 
        !syncedReadingIds.includes(reading.id)
      );
      
      localStorage.setItem('offlineVitalReadings', JSON.stringify(remainingReadings));
    } catch (error) {
      console.error('Failed to clear synced readings:', error);
    }
  },
  
  // Get number of pending readings
  getPendingCount: (): number => {
    try {
      const cachedReadingsJson = localStorage.getItem('offlineVitalReadings');
      if (!cachedReadingsJson) return 0;
      
      const cachedReadings = JSON.parse(cachedReadingsJson);
      return cachedReadings.length;
    } catch (error) {
      console.error('Failed to get pending count:', error);
      return 0;
    }
  }
};

// Functions for wearable device integration
export const wearableSync = {
  // Mock function to simulate device discovery
  discoverDevices: async (): Promise<Device[]> => {
    // This would use Web Bluetooth API or device-specific SDKs in a real implementation
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { 
            id: 'dev1', 
            name: 'Apple Watch Series 8',
            type: 'watch',
            supported: true,
            metrics: ['heart-rate', 'spo2', 'ecg']
          },
          { 
            id: 'dev2', 
            name: 'Fitbit Sense',
            type: 'watch',
            supported: true,
            metrics: ['heart-rate', 'spo2', 'temperature']
          }
        ]);
      }, 2000);
    });
  },
  
  // Connect to a device
  connectDevice: async (deviceId: string): Promise<ConnectedDevice> => {
    // This would use device-specific connection logic in a real implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          resolve({
            id: deviceId,
            status: 'connected',
            lastSync: new Date()
          });
        } else {
          reject(new Error('Failed to connect to device'));
        }
      }, 2000);
    });
  },
  
  // Sync data from a device
  syncDevice: async (deviceId: string): Promise<VitalReading[]> => {
    // This would pull actual data from the device in a real implementation
    return new Promise(resolve => {
      setTimeout(() => {
        const readings: VitalReading[] = [
          {
            type: 'heartRate',
            value: Math.floor(65 + Math.random() * 15),
            timestamp: new Date(),
            source: 'wearable',
            deviceId
          },
          {
            type: 'oxygenSaturation',
            value: Math.floor(95 + Math.random() * 5),
            timestamp: new Date(),
            source: 'wearable',
            deviceId
          }
        ];
        resolve(readings);
      }, 3000);
    });
  }
};

// Functions for predictive analytics
export const predictiveAnalytics = {
  // Predict blood pressure for next 7 days
  predictBloodPressure: (historicalData: BloodPressureDataPoint[]): PredictionResult[] => {
    // In a real implementation, this would use a statistical model or ML
    // For demo purposes, we'll create synthetic predictions
    if (historicalData.length === 0) return [];
    
    const lastReading = historicalData[historicalData.length - 1];
    const predictions: PredictionResult[] = [];
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // Add some random variation to create realistic predictions
      const systolicVariation = Math.floor(Math.random() * 7) - 3; // -3 to +3
      const diastolicVariation = Math.floor(Math.random() * 5) - 2; // -2 to +2
      
      const predictedSystolic = lastReading.systolic + systolicVariation;
      const predictedDiastolic = lastReading.diastolic + diastolicVariation;
      
      predictions.push({
        timestamp: date,
        predictedValue: (predictedSystolic + predictedDiastolic) / 2, // Average for single value
        confidence: Math.max(0.5, 1 - (i * 0.1)), // Decreasing confidence
        riskLevel: predictedSystolic > 140 || predictedDiastolic > 90 ? 'high' : 
                  predictedSystolic > 130 || predictedDiastolic > 85 ? 'medium' : 'low'
      });
    }
    
    return predictions;
  },
  
  // Predict hydration risk
  predictHydrationRisk: (historicalData: HistoricalDataPoint[]): PredictionResult[] => {
    // Again, simplified for demo purposes
    if (historicalData.length === 0) return [];
    
    const lastValue = historicalData[historicalData.length - 1].value;
    const predictions: PredictionResult[] = [];
    
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // Create a pattern that shows dehydration risk on days 3-5
      let value: number;
      
      if (i >= 3 && i <= 5) {
        value = Math.max(lastValue - 10 + (i - 3) * 2, 50);
      } else {
        value = lastValue + Math.floor(Math.random() * 5) - 2;
      }
      
      predictions.push({
        timestamp: date,
        predictedValue: value,
        confidence: Math.max(0.4, 1 - (i * 0.1)),
        riskLevel: value < 60 ? 'high' : value < 65 ? 'medium' : 'low'
      });
    }
    
    return predictions;
  },
  
  // Generate AI insights based on vital trends
  generateInsights: (vitalsData: VitalReading[]): VitalsInsight[] => {
    const insights: VitalsInsight[] = [];
    
    // Group readings by type
    const groupedData: { [key: string]: VitalReading[] } = {};
    vitalsData.forEach(reading => {
      if (!groupedData[reading.type]) {
        groupedData[reading.type] = [];
      }
      groupedData[reading.type].push(reading);
    });
    
    // Blood pressure insights
    if (groupedData.bloodPressure && groupedData.bloodPressure.length >= 2) {
      const bpData = groupedData.bloodPressure.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      const latestBP = bpData[bpData.length - 1];
      const prevBP = bpData[bpData.length - 2];
      
      if (typeof latestBP.value === 'object' && typeof prevBP.value === 'object' && 
          'systolic' in latestBP.value && 'systolic' in prevBP.value) {
        const latest = latestBP.value as BloodPressureValue;
        const prev = prevBP.value as BloodPressureValue;
        
        if (latest.systolic > prev.systolic + 5) {
          insights.push({
            type: "trend",
            severity: "warning",
            message: `Your systolic blood pressure has increased by ${latest.systolic - prev.systolic} points in your last reading.`,
            metric: "bloodPressure",
            value: latest.systolic,
            recommendation: "Consider reducing sodium intake and monitoring more frequently."
          });
        } else if (latest.systolic < prev.systolic - 5) {
          insights.push({
            type: "trend",
            severity: "info",
            message: "Your blood pressure readings are showing improvement over the last few days.",
            metric: "bloodPressure",
            value: latest.systolic,
            recommendation: "Continue your current medication and exercise regimen."
          });
        }
      }
    }
    
    // Add more insights for other vital types as needed
    return insights;
  }
};

// Functions for alert management
export const alertManagement = {
  // Send alert to caregivers
  notifyCaregivers: async (reading: VitalReading, caregivers: Caregiver[]): Promise<boolean> => {
    // This would integrate with SMS/email services in a real implementation
    console.log(`Alert would be sent to ${caregivers.length} caregivers about ${reading.type}`);
    return true;
  },
  
  // Send test alert to a caregiver
  sendTestAlert: async (caregiverId: string): Promise<boolean> => {
    // This would send an actual test message in a real implementation
    console.log(`Test alert would be sent to caregiver ${caregiverId}`);
    return true;
  }
};

const vitalsService = {
  SUPPORTED_DEVICES,
  VITAL_METRICS,
  isCriticalReading,
  isWarningReading,
  formatVitalReading,
  offlineCache,
  wearableSync,
  predictiveAnalytics,
  alertManagement
};

export default vitalsService;
