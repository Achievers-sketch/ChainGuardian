// For this prototype, the product registration form will be on this page.
// In a full app, this page might list products and have a button to a separate registration page.
'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { QrCode, Factory } from 'lucide-react';
import Image from 'next/image';
import { register } from '@/lib/actions';

const formSchema = z.object({
  productName: z.string().min(3, 'Product name must be at least 3 characters.'),
  category: z.string().min(1, 'Please select a category.'),
  description: z.string().optional(),
  manufacturer: z.string().min(2, 'Manufacturer is required.'),
  manufacturingDate: z.string().min(1, 'Manufacturing date is required.'),
  expiryDate: z.string().min(1, 'Expiry date is required.'),
  batchNumber: z.string().min(1, 'Batch number is required.'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
});

type Step = 'details' | 'confirm';

export default function ProductsPage() {
  const [step, setStep] = useState<Step>('details');
  const [formData, setFormData] = useState<z.infer<typeof formSchema> | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: '',
      category: '',
      description: '',
      manufacturer: '',
      manufacturingDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      batchNumber: `B-${Date.now()}`,
      quantity: 1000,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setFormData(values);
    setStep('confirm');
  }
  
  async function handleMint() {
    if (!formData) return;

    toast({
      title: 'Minting Product NFT',
      description: 'Your product is being registered on the blockchain...',
    });

    const result = await register(formData);

    if (result.success) {
      toast({
        title: '✅ Success!',
        description: 'Product registered and NFT certificate minted.',
      });
      setStep('details');
      form.reset();
      setFormData(null);
    } else {
      toast({
        title: 'Uh oh! Something went wrong.',
        description: result.message,
        variant: 'destructive',
      });
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Product Registration</h1>
        <p className="text-muted-foreground">Add a new product to the supply chain for tracking.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 'details' ? 'Step 1: Product & Batch Details' : 'Step 2: Confirm & Mint'}
          </CardTitle>
          <CardDescription>
            {step === 'details'
              ? 'Provide information about the product and its batch.'
              : 'Review the details and mint the NFT certificate on the blockchain.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'details' && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="productName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Amoxicillin 500mg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a product category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Pharmaceuticals">Pharmaceuticals</SelectItem>
                            <SelectItem value="Cosmetics">Cosmetics</SelectItem>
                            <SelectItem value="Auto Parts">Auto Spare Parts</SelectItem>
                            <SelectItem value="Electronics">Electronics</SelectItem>
                            <SelectItem value="Luxury Goods">Luxury Goods</SelectItem>
                            <SelectItem value="Agricultural">Agricultural Products</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe the product" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <div className="grid md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="manufacturer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manufacturer</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., HealthFirst Pharma Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="batchNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batch Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                   <FormField
                    control={form.control}
                    name="manufacturingDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Manufacturing Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Proceed to Confirmation</Button>
                </div>
              </form>
            </Form>
          )}

          {step === 'confirm' && formData && (
            <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4 rounded-lg border p-4">
                         <h3 className="font-semibold font-headline">Product Details</h3>
                         <p><strong>Name:</strong> {formData.productName}</p>
                         <p><strong>Category:</strong> {formData.category}</p>
                         <p><strong>Manufacturer:</strong> {formData.manufacturer}</p>
                         <p><strong>Batch:</strong> {formData.batchNumber}</p>
                         <p><strong>Mfg. Date:</strong> {formData.manufacturingDate}</p>
                         <p><strong>Exp. Date:</strong> {formData.expiryDate}</p>
                         <p><strong>Quantity:</strong> {formData.quantity.toLocaleString()}</p>
                    </div>
                     <div className="space-y-4 rounded-lg border p-4 flex flex-col items-center justify-center bg-secondary">
                        <h3 className="font-semibold font-headline">Generated QR Code</h3>
                        <p className="text-sm text-muted-foreground text-center">This QR code will be attached to the product batch.</p>
                        <div className="p-2 bg-white rounded-md">
                           <Image 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/verify/${formData.batchNumber}`}
                                alt="Generated QR Code"
                                width={150}
                                height={150}
                                data-ai-hint="qr code"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <Button variant="outline" onClick={() => setStep('details')}>Back to Edit</Button>
                    <Button onClick={handleMint}>
                        <Factory className="mr-2 h-4 w-4" />
                        Mint Product NFT
                    </Button>
                </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
