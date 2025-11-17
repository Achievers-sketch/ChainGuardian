import { Factory, ClipboardCheck, Warehouse, Truck, Ship, Store, User, Package, Coffee, Droplets } from 'lucide-react';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const amoxicillinImage = PlaceHolderImages.find(p => p.id === 'amoxicillin-product');
const coffeeImage = PlaceHolderImages.find(p => p.id === 'coffee-beans-product');
const oilImage = PlaceHolderImages.find(p => p.id === 'engine-oil-product');
const fakeOilImage = PlaceHolderImages.find(p => p.id === 'fake-oil-product');


export const mockProducts: Product[] = [
  {
    id: 'amx-2024-1105',
    name: 'Amoxicillin 500mg',
    category: 'Pharmaceuticals',
    description: 'Broad-spectrum antibiotic capsules for treating bacterial infections.',
    manufacturer: 'HealthFirst Pharma Inc.',
    manufacturingDate: '2024-03-15T08:00:00Z',
    expiryDate: '2025-09-15T08:00:00Z',
    batchNumber: 'AMX-2024-1105',
    quantity: 10000,
    imageUrl: amoxicillinImage?.imageUrl || '',
    imageHint: amoxicillinImage?.imageHint || '',
    supplyChain: [
      { status: 'Manufacturing Completed', timestamp: '2024-03-15T10:00:00Z', handler: 'HealthFirst Pharma Inc.', location: 'Lagos, Nigeria', icon: Factory },
      { status: 'Quality Control Passed', timestamp: '2024-03-15T14:30:00Z', handler: 'QA Department', location: 'Lagos, Nigeria', icon: ClipboardCheck },
      { status: 'Stored in Warehouse', timestamp: '2024-03-16T09:00:00Z', handler: 'Lagos Central Warehouse', location: 'Lagos, Nigeria', icon: Warehouse },
      { status: 'In Transit', timestamp: '2024-03-18T11:00:00Z', handler: 'DHL Supply Chain', location: 'Departed Lagos', icon: Truck },
      { status: 'Arrived at Port', timestamp: '2024-03-25T17:00:00Z', handler: 'Apapa Port Authority', location: 'Lagos Port Complex', icon: Ship },
      { status: 'Arrived at Retail', timestamp: '2024-03-28T10:00:00Z', handler: 'MediCure Pharmacy', location: 'Abuja, Nigeria', icon: Store },
      { status: 'Sold to Consumer', timestamp: '2024-04-02T13:45:00Z', handler: 'Consumer', location: 'Abuja, Nigeria', icon: User },
    ],
    coldChain: {
      required: true,
      minTemp: 2,
      maxTemp: 8,
      sensorReadings: [
        { time: 'Day 1', temperature: 4.5 },
        { time: 'Day 2', temperature: 5.1 },
        { time: 'Day 3', temperature: 4.8 },
        { time: 'Day 4', temperature: 5.3 },
        { time: 'Day 5', temperature: 5.0 },
        { time: 'Day 6', temperature: 4.7 },
        { time: 'Day 7', temperature: 5.2 },
      ],
    },
  },
  {
    id: 'eth-cof-2024-007',
    name: 'Ethiopian Yirgacheffe Coffee Beans',
    category: 'Agricultural Products',
    description: 'Single-origin, fair trade certified coffee beans with bright, fruity notes.',
    manufacturer: 'Yirgacheffe Coffee Farmers Cooperative Union',
    manufacturingDate: '2024-02-01T00:00:00Z',
    expiryDate: '2025-02-01T00:00:00Z',
    batchNumber: 'ETH-COF-2024-007',
    quantity: 500,
    imageUrl: coffeeImage?.imageUrl || '',
    imageHint: coffeeImage?.imageHint || '',
    supplyChain: [
      { status: 'Harvested', timestamp: '2024-02-01T09:00:00Z', handler: 'Local Farm', location: 'Yirgacheffe, Ethiopia', icon: Coffee },
      { status: 'Washed and Dried', timestamp: '2024-02-03T15:00:00Z', handler: 'Washing Station', location: 'Yirgacheffe, Ethiopia', icon: ClipboardCheck },
      { status: 'Stored at Cooperative', timestamp: '2024-02-10T11:00:00Z', handler: 'YCFCU Warehouse', location: 'Addis Ababa, Ethiopia', icon: Warehouse },
      { status: 'Shipped to Roaster', timestamp: '2024-02-15T08:00:00Z', handler: 'Global Shipping Co.', location: 'Port of Djibouti', icon: Ship },
      { status: 'Roasted', timestamp: '2024-03-05T14:00:00Z', handler: 'Artisan Roasters', location: 'London, UK', icon: Factory },
      { status: 'Arrived at Cafe', timestamp: '2024-03-10T09:00:00Z', handler: 'The Daily Grind', location: 'London, UK', icon: Store },
    ],
  },
  {
    id: 'syn-oil-2024-q1',
    name: 'Full Synthetic 5W-30 Engine Oil',
    category: 'Auto Spare Parts',
    description: 'Premium synthetic engine oil for modern gasoline engines.',
    manufacturer: 'AutoGuard Lubricants',
    manufacturingDate: '2024-01-20T00:00:00Z',
    expiryDate: '2029-01-20T00:00:00Z',
    batchNumber: 'SYN-OIL-2024-Q1',
    quantity: 25000,
    imageUrl: oilImage?.imageUrl || '',
    imageHint: oilImage?.imageHint || '',
    supplyChain: [
      { status: 'Production', timestamp: '2024-01-20T12:00:00Z', handler: 'AutoGuard Plant', location: 'Durban, South Africa', icon: Factory },
      { status: 'Quality Assurance', timestamp: '2024-01-21T10:00:00Z', handler: 'QA Lab', location: 'Durban, South Africa', icon: ClipboardCheck },
      { status: 'Distribution Center', timestamp: '2024-01-25T16:00:00Z', handler: 'Gauteng DC', location: 'Johannesburg, South Africa', icon: Warehouse },
      { status: 'Shipped to Retailer', timestamp: '2024-02-05T09:00:00Z', handler: 'Freightliners SA', location: 'On route to Nairobi', icon: Truck },
      { status: 'Received at Auto Shop', timestamp: '2024-02-15T14:00:00Z', handler: 'Nairobi Auto Parts', location: 'Nairobi, Kenya', icon: Store },
    ],
  },
  {
    id: 'vaccine-xyz-2024-b2',
    name: 'Polio Vaccine Batch B2',
    category: 'Pharmaceuticals',
    description: 'Inactivated Poliovirus Vaccine (IPV) for immunization programs.',
    manufacturer: 'Global Health United',
    manufacturingDate: '2024-01-10T00:00:00Z',
    expiryDate: '2025-01-10T00:00:00Z',
    batchNumber: 'VACCINE-XYZ-2024-B2',
    quantity: 50000,
    imageUrl: amoxicillinImage?.imageUrl || '',
    imageHint: amoxicillinImage?.imageHint || '',
    supplyChain: [
      { status: 'Manufacturing', timestamp: '2024-01-10T12:00:00Z', handler: 'GHU Biologics', location: 'Geneva, Switzerland', icon: Factory },
      { status: 'Shipped via Cold Chain', timestamp: '2024-01-12T08:00:00Z', handler: 'CoolCargo Logistics', location: 'Geneva Airport', icon: Truck },
      { status: 'Arrived at Central Store', timestamp: '2024-01-13T20:00:00Z', handler: 'National Medical Stores', location: 'Accra, Ghana', icon: Warehouse },
      { status: 'Distributed to Clinic', timestamp: '2024-01-15T11:00:00Z', handler: 'Regional Health Service', location: 'Kumasi, Ghana', icon: Store },
    ],
    coldChain: {
      required: true,
      minTemp: 2,
      maxTemp: 8,
      sensorReadings: [
        { time: '10h', temperature: 4.1 },
        { time: '20h', temperature: 3.9 },
        { time: '30h', temperature: 5.5 },
        { time: '40h', temperature: 9.2 }, // Breach
        { time: '50h', temperature: 15.1 }, // Critical Breach
        { time: '60h', temperature: 14.5 }, // Still breached
        { time: '70h', temperature: 5.0 }, // Recovered
      ],
    },
  },
];

export const unregisteredProduct = {
  id: 'unregistered-fake-oil',
  name: 'Counterfeit Engine Oil',
  category: 'Unknown',
  description: 'This product is not registered in the ChainGuardian system. It is likely counterfeit.',
  manufacturer: 'Unknown',
  manufacturingDate: 'Unknown',
  expiryDate: 'Unknown',
  batchNumber: 'UNKNOWN-ID-123',
  quantity: 0,
  imageUrl: fakeOilImage?.imageUrl || '',
  imageHint: fakeOilImage?.imageHint || '',
  supplyChain: [],
};
