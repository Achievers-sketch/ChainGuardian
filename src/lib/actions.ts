'use server';

import { analyzeScanPatterns, type AnalyzeScanPatternsInput, type AnalyzeScanPatternsOutput } from '@/ai/flows/analyze-scan-patterns-for-counterfeits';
import { getProduct, registerProduct } from '@/lib/services';

export async function analyzeScans(input: AnalyzeScanPatternsInput): Promise<{ success: true; data: AnalyzeScanPatternsOutput } | { success: false; error: string }> {
  try {
    const result = await analyzeScanPatterns(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error analyzing scan patterns:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred while analyzing scan patterns.' };
  }
}


export async function register(
  productData: any
): Promise<{ success: boolean; message: string }> {
  try {
    await registerProduct(productData);
    return { success: true, message: 'Product registered successfully!' };
  } catch (error: any) {
    console.error('Error registering product:', error);
    return { success: false, message: error.message || 'Failed to register product.' };
  }
}

export async function fetchProduct(
  id: string
): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const product = await getProduct(id);
    if (product) {
      return { success: true, data: product };
    }
    return { success: false, message: 'Product not found.' };
  } catch (error: any) {
    console.error(`Error fetching product ${id}:`, error);
    return { success: false, message: error.message || 'Failed to fetch product.' };
  }
}
