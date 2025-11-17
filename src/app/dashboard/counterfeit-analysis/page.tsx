'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { analyzeScans } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, X, Shield, ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react';
import type { AnalyzeScanPatternsOutput } from '@/ai/flows/analyze-scan-patterns-for-counterfeits';

const scanSchema = z.object({
  timestamp: z.string().datetime(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  scanSource: z.string().min(1),
  productId: z.string().min(1),
});

const formSchema = z.object({
  productScans: z.array(scanSchema).min(1, 'At least one scan is required.'),
  expectedScanFrequency: z.string().min(1, 'Expected frequency is required.'),
  expectedGeographicalDistribution: z.string().min(1, 'Expected distribution is required.'),
});

export default function CounterfeitAnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalyzeScanPatternsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productScans: [{
        timestamp: new Date().toISOString(),
        latitude: 6.5244,
        longitude: 3.3792,
        scanSource: 'Consumer App',
        productId: 'amx-2024-1105'
      }],
      expectedScanFrequency: 'Weekly',
      expectedGeographicalDistribution: 'Primarily in Lagos, Nigeria',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'productScans',
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysisResult(null);
    const input = {
      ...values,
      productScans: values.productScans.map(scan => ({
        ...scan,
        location: {
          latitude: scan.latitude,
          longitude: scan.longitude,
        }
      }))
    }
    const result = await analyzeScans(input);
    setIsLoading(false);

    if (result.success) {
      setAnalysisResult(result.data);
      toast({
        title: 'Analysis Complete',
        description: 'The AI has finished analyzing the scan patterns.',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">AI Counterfeit Analysis</h1>
        <p className="text-muted-foreground">Analyze scan patterns to identify potential counterfeit risks.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Scan Data Input</CardTitle>
            <CardDescription>Provide the scan data and expected patterns for analysis.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Product Scans</h3>
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="p-4 border rounded-lg relative space-y-2">
                        <FormField control={form.control} name={`productScans.${index}.productId`} render={({ field }) => <Input placeholder="Product ID" {...field} />} />
                        <div className="grid grid-cols-2 gap-2">
                          <FormField control={form.control} name={`productScans.${index}.latitude`} render={({ field }) => <Input type="number" placeholder="Latitude" {...field} />} />
                          <FormField control={form.control} name={`productScans.${index}.longitude`} render={({ field }) => <Input type="number" placeholder="Longitude" {...field} />} />
                        </div>
                        <FormField control={form.control} name={`productScans.${index}.scanSource`} render={({ field }) => <Input placeholder="Scan Source" {...field} />} />
                        <FormField control={form.control} name={`productScans.${index}.timestamp`} render={({ field }) => <Input type="datetime-local" placeholder="Timestamp" {...field} />} />
                        <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => remove(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ timestamp: new Date().toISOString(), latitude: 0, longitude: 0, scanSource: 'Consumer App', productId: '' })}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Scan
                    </Button>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="expectedScanFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Scan Frequency</FormLabel>
                      <FormControl><Input placeholder="e.g., Daily, Weekly, Monthly" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expectedGeographicalDistribution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Geographical Distribution</FormLabel>
                      <FormControl><Input placeholder="e.g., Widely distributed across West Africa" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</> : 'Analyze Patterns'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Analysis Result</CardTitle>
            <CardDescription>The AI's assessment of counterfeit risk based on the data.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
            {!isLoading && !analysisResult && <div className="flex flex-col justify-center items-center h-64 text-center text-muted-foreground"><Shield className="h-12 w-12 mb-4" /> <p>Submit data to see the analysis result.</p></div>}
            {analysisResult && (
              <div className="space-y-6">
                <div className={`p-4 rounded-lg flex items-center gap-4 ${analysisResult.isCounterfeitRisk ? 'bg-destructive/10 border-destructive' : 'bg-green-500/10 border-green-500'} border`}>
                  {analysisResult.isCounterfeitRisk ? <ShieldAlert className="h-8 w-8 text-destructive" /> : <ShieldCheck className="h-8 w-8 text-green-500" />}
                  <div>
                    <h3 className={`text-lg font-bold font-headline ${analysisResult.isCounterfeitRisk ? 'text-destructive' : 'text-green-600'}`}>
                      {analysisResult.isCounterfeitRisk ? 'High Counterfeit Risk' : 'Low Counterfeit Risk'}
                    </h3>
                    <p className="text-sm text-muted-foreground">The AI has determined the risk level based on pattern deviations.</p>
                  </div>
                </div>

                {analysisResult.riskFactors.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Risk Factors Identified:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {analysisResult.riskFactors.map((factor, index) => <li key={index}>{factor}</li>)}
                    </ul>
                  </div>
                )}
                
                {analysisResult.suggestedActions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Suggested Actions:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {analysisResult.suggestedActions.map((action, index) => <li key={index}>{action}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
