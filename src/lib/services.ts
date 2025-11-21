'use server';

import { createPublicClient, http, getContract, Address } from 'viem';
import { sepolia } from 'viem/chains';
import { abi } from './abi';
import { Product } from './types';
import { Factory, ClipboardCheck, Warehouse, Truck, Ship, Store, User } from 'lucide-react';

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL),
});

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address;

const contract = getContract({
  address: contractAddress,
  abi,
  client: publicClient,
});

function mapEventToIcon(status: string) {
  if (status.includes('Manufacturing')) return Factory;
  if (status.includes('Quality Control')) return ClipboardCheck;
  if (status.includes('Warehouse')) return Warehouse;
  if (status.includes('Transit')) return Truck;
  if (status.includes('Port')) return Ship;
  if (status.includes('Retail')) return Store;
  if (status.includes('Sold')) return User;
  return Package;
}

async function formatProduct(productData: any, id: string): Promise<Product> {
  const history = await contract.read.getProductHistory([id]);

  const supplyChain = history.map((event: any) => ({
    status: event.status,
    timestamp: new Date(Number(event.timestamp) * 1000).toISOString(),
    handler: event.handler,
    location: event.location,
    icon: mapEventToIcon(event.status),
  }));

  return {
    id,
    name: productData.name,
    category: productData.category,
    description: '',
    manufacturer: productData.manufacturer,
    manufacturingDate: new Date(Number(productData.manufacturingDate) * 1000).toISOString(),
    expiryDate: new Date(Number(productData.expiryDate) * 1000).toISOString(),
    batchNumber: productData.batchNumber,
    quantity: Number(productData.quantity),
    imageUrl: `https://picsum.photos/seed/${productData.name}/400/300`,
    imageHint: 'product image',
    supplyChain: supplyChain,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const productIds = await contract.read.getAllProductIds();
    const products = await Promise.all(
      productIds.map(async (id: string) => {
        const productData = await contract.read.products([id]);
        return await formatProduct(productData, id);
      })
    );
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const productData = await contract.read.products([id]);
    if (productData.name) {
      return await formatProduct(productData, id);
    }
    return null;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

export async function registerProduct(productData: any) {
    // This is a placeholder for server-side registration.
    // In a real app, you would use a wallet with write access.
    console.log("Registering product on server (simulation):", productData);
    // const { request } = await publicClient.simulateContract({
    //   address: contractAddress,
    //   abi,
    //   functionName: 'registerProduct',
    //   args: [
    //       productData.batchNumber, // Using batch number as ID
    //       productData.productName,
    //       productData.category,
    //       productData.manufacturer,
    //       Math.floor(new Date(productData.manufacturingDate).getTime() / 1000),
    //       Math.floor(new Date(productData.expiryDate).getTime() / 1000),
    //       productData.batchNumber,
    //       productData.quantity
    //   ],
    //   // You need an account to write to the contract
    //   // account: '0x...' 
    // });
    // This part is commented out because it requires a private key.
    // await walletClient.writeContract(request);
    return;
}
