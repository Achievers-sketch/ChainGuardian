import type React from 'react';

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  manufacturer: string;
  manufacturingDate: string;
  expiryDate: string;
  batchNumber: string;
  quantity: number;
  imageUrl: string;
  imageHint: string;
  supplyChain: SupplyChainEvent[];
  coldChain?: {
    required: boolean;
    minTemp: number;
    maxTemp: number;
    sensorReadings: IoTSensorReading[];
  };
}

export interface SupplyChainEvent {
  status: string;
  timestamp: string;
  handler: string;
  location: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface IoTSensorReading {
  time: string;
  temperature: number;
}
