'use server';
/**
 * @fileOverview An AI tool to analyze scan patterns and geographical data to identify potential counterfeit products.
 *
 * - analyzeScanPatterns - A function that handles the analysis of scan patterns for counterfeit detection.
 * - AnalyzeScanPatternsInput - The input type for the analyzeScanPatterns function.
 * - AnalyzeScanPatternsOutput - The return type for the analyzeScanPatterns function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeScanPatternsInputSchema = z.object({
  productScans: z
    .array(
      z.object({
        timestamp: z.string().describe('The timestamp of the scan.'),
        location: z
          .object({
            latitude: z.number().describe('The latitude of the scan location.'),
            longitude: z.number().describe('The longitude of the scan location.'),
          })
          .describe('The geographical location of the scan.'),
        scanSource: z.string().describe('The source of the scan (e.g., consumer app, retailer app).'),
        productId: z.string().describe('The unique identifier for the product.'),
      })
    )
    .describe('An array of product scan data.'),
  expectedScanFrequency: z
    .string()
    .describe(
      'The typical scan frequency for the product (e.g., daily, weekly, monthly). Use words like daily and weekly instead of numbers.'
    ),
  expectedGeographicalDistribution: z
    .string()
    .describe(
      'The expected geographical distribution of the product (e.g., primarily in Lagos, Nigeria; widely distributed across West Africa).' 
    ),
});
export type AnalyzeScanPatternsInput = z.infer<typeof AnalyzeScanPatternsInputSchema>;

const AnalyzeScanPatternsOutputSchema = z.object({
  isCounterfeitRisk: z
    .boolean()
    .describe(
      'A boolean indicating whether the scan patterns suggest a high risk of counterfeiting.'
    ),
  riskFactors: z
    .array(
      z.string().describe('A list of factors contributing to the counterfeit risk assessment.')
    )
    .describe(
      'An array of strings detailing the specific factors that contribute to the overall risk assessment, e.g. Unusual clustering of scans in a small area, sudden spike in scans after a period of inactivity.'
    ),
  suggestedActions: z
    .array(
      z
        .string()
        .describe(
          'A list of suggested actions to take based on the risk assessment, such as investigate further, alert manufacturer, etc.'
        )
    )
    .describe('Recommended actions to mitigate potential counterfeiting.'),
});
export type AnalyzeScanPatternsOutput = z.infer<typeof AnalyzeScanPatternsOutputSchema>;

export async function analyzeScanPatterns(input: AnalyzeScanPatternsInput): Promise<AnalyzeScanPatternsOutput> {
  return analyzeScanPatternsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeScanPatternsPrompt',
  input: {schema: AnalyzeScanPatternsInputSchema},
  output: {schema: AnalyzeScanPatternsOutputSchema},
  prompt: `You are an expert in supply chain security and counterfeit detection. Your task is to analyze product scan data and identify potential counterfeit risks.

  Analyze the following product scan data:
  {{#each productScans}}
  - Timestamp: {{this.timestamp}}, Location: {{this.location.latitude}}, {{this.location.longitude}}, Source: {{this.scanSource}}, Product ID: {{this.productId}}
  {{/each}}

  Consider the following factors when assessing counterfeit risk:
  - **Scan Frequency:** The expected scan frequency is {{expectedScanFrequency}}.
  - **Geographical Distribution:** The expected geographical distribution is {{expectedGeographicalDistribution}}.

  Based on the scan data and the expected scan frequency and geographical distribution, determine if there is a high risk of counterfeiting. Provide a list of risk factors contributing to your assessment and suggest actions to take.

  Output in JSON format:
  {
    "isCounterfeitRisk": boolean,
    "riskFactors": string[],
    "suggestedActions": string[]
  }`,
});

const analyzeScanPatternsFlow = ai.defineFlow(
  {
    name: 'analyzeScanPatternsFlow',
    inputSchema: AnalyzeScanPatternsInputSchema,
    outputSchema: AnalyzeScanPatternsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
