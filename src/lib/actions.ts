'use server';

import { analyzeScanPatterns, type AnalyzeScanPatternsInput, type AnalyzeScanPatternsOutput } from '@/ai/flows/analyze-scan-patterns-for-counterfeits';

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
