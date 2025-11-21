'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { fetchProducts } from "@/lib/services"
import { Activity, Package, ShieldAlert, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuery } from '@tanstack/react-query';

const StatCard = ({ title, value, icon: Icon, description }: { title: string, value: string, icon: React.ElementType, description: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold font-headline">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

export default function DashboardPage() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const recentProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to ChainGuardian. Here's an overview of your supply chain activity.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Products Registered" value={products.length.toString()} icon={Package} description="+2 this month" />
        <StatCard title="Total Scans" value="1,254" icon={Activity} description="+180 in last 24h" />
        <StatCard title="Counterfeit Alerts" value="3" icon={ShieldAlert} description="1 new alert today" />
        <StatCard title="Value Protected" value="$1.2M" icon={DollarSign} description="Estimated value of goods" />
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
                <CardTitle>Recent Product Registrations</CardTitle>
                <CardDescription>
                    The latest products added to the blockchain.
                </CardDescription>
            </div>
             <Button asChild size="sm">
                <Link href="/dashboard/products">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? <p>Loading products...</p> :
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Batch Number</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>{product.batchNumber}</TableCell>
                    <TableCell className="text-right">{product.quantity.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          }
        </CardContent>
      </Card>
    </div>
  )
}
