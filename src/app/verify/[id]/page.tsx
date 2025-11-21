'use client';

import { useEffect, useState } from 'react';
import { notFound } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert, Clock, Calendar, Hash, Package, Factory, AlertTriangle, Loader2 } from "lucide-react";
import ProductTimeline from "@/components/verify/product-timeline";
import TemperatureChart from "@/components/verify/temperature-chart";
import { differenceInDays, formatDistanceToNow } from 'date-fns';
import { fetchProduct } from '@/lib/actions';
import { Product } from '@/lib/types';

export default function VerifyPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isAuthentic, setIsAuthentic] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getProduct() {
      setIsLoading(true);
      const result = await fetchProduct(params.id);
      if (result.success && result.data) {
        setProduct(result.data);
        setIsAuthentic(true);
      } else {
        setIsAuthentic(false);
      }
      setIsLoading(false);
    }
    getProduct();
  }, [params.id]);


  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }

  if (isAuthentic === false) {
     return (
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="overflow-hidden">
          <CardHeader className='p-6 bg-destructive/5'>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <ShieldAlert className="h-16 w-16 text-destructive flex-shrink-0" />
              <div>
                <h1 className='text-3xl font-bold font-headline text-destructive'>
                  Counterfeit Warning
                </h1>
                <CardDescription className="text-base">
                  This product is NOT registered. It is likely counterfeit. DO NOT USE.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  if (!product) {
      notFound();
  }

  const expiryDate = product ? new Date(product.expiryDate) : null;
  const daysToExpiry = expiryDate ? differenceInDays(expiryDate, new Date()) : 0;

  const getExpiryBadge = () => {
    if (!expiryDate) return null;
    if (daysToExpiry < 0) return <Badge variant="destructive">Expired</Badge>;
    if (daysToExpiry < 30) return <Badge variant="destructive" className="bg-yellow-500 text-white">Expires Soon</Badge>;
    return <Badge className="bg-green-600">Expires in {formatDistanceToNow(expiryDate)}</Badge>;
  };
  
  const isColdChainBreached = product.coldChain?.sensorReadings.some(
      (reading) => reading.temperature < product.coldChain!.minTemp || reading.temperature > product.coldChain!.maxTemp
  ) ?? false;


  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="overflow-hidden">
        <CardHeader className={`p-6 ${isAuthentic ? 'bg-primary/5' : 'bg-destructive/5'}`}>
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {isAuthentic ? (
              <ShieldCheck className="h-16 w-16 text-green-500 flex-shrink-0" />
            ) : (
              <ShieldAlert className="h-16 w-16 text-destructive flex-shrink-0" />
            )}
            <div>
              <h1 className={`text-3xl font-bold font-headline ${isAuthentic ? 'text-primary' : 'text-destructive'}`}>
                {isAuthentic ? 'Product Authentic' : 'Counterfeit Warning'}
              </h1>
              <CardDescription className="text-base">
                {isAuthentic
                  ? `This ${product.name} has been verified on the ChainGuardian platform.`
                  : 'This product is NOT registered. It is likely counterfeit. DO NOT USE.'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
                 <h2 className="text-xl font-bold font-headline">{product.name}</h2>
                 <p className="text-muted-foreground">{product.description}</p>
                 <div className="flex flex-wrap gap-2">{getExpiryBadge()}</div>
                 {isColdChainBreached && (
                     <div className="flex items-center gap-2 p-2 rounded-md bg-destructive/10 text-destructive">
                        <AlertTriangle className="h-5 w-5"/>
                        <p className="font-semibold text-sm">Cold chain integrity compromised!</p>
                     </div>
                 )}
            </div>
            <div className="flex justify-center items-center">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="rounded-lg object-cover shadow-md"
                    data-ai-hint={product.imageHint}
                />
            </div>
        </CardContent>
      </Card>
      
      {isAuthentic && (
          <>
            <Card>
                <CardHeader><CardTitle>Product Information</CardTitle></CardHeader>
                <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2"><Factory className="h-4 w-4 text-muted-foreground"/><span><strong>Manufacturer:</strong> {product.manufacturer}</span></div>
                    <div className="flex items-center gap-2"><Package className="h-4 w-4 text-muted-foreground"/><span><strong>Category:</strong> {product.category}</span></div>
                    <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-muted-foreground"/><span><strong>Batch:</strong> {product.batchNumber}</span></div>
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground"/><span><strong>Mfg. Date:</strong> {new Date(product.manufacturingDate).toLocaleDateString()}</span></div>
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground"/><span><strong>Exp. Date:</strong> {new Date(product.expiryDate).toLocaleDateString()}</span></div>
                </CardContent>
            </Card>

            {product.supplyChain && product.supplyChain.length > 0 && (
                <Card>
                    <CardHeader><CardTitle>Supply Chain Journey</CardTitle></CardHeader>
                    <CardContent>
                        <ProductTimeline events={product.supplyChain} />
                    </CardContent>
                </Card>
            )}
            
            {product.coldChain?.required && (
                <Card>
                    <CardHeader>
                        <CardTitle>Cold Chain Monitoring</CardTitle>
                        <CardDescription>
                            Temperature history from sensor readings throughout the supply chain. Required range: {product.coldChain.minTemp}°C - {product.coldChain.maxTemp}°C.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TemperatureChart readings={product.coldChain.sensorReadings} minTemp={product.coldChain.minTemp} maxTemp={product.coldChain.maxTemp}/>
                    </CardContent>
                </Card>
            )}
        </>
      )}
    </div>
  );
}
