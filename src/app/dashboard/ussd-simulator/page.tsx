import UssdSimulator from '@/components/ussd-simulator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function UssdSimulatorPage() {
  return (
    <div className="space-y-8">
       <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">USSD Simulator</h1>
        <p className="text-muted-foreground">
          Simulate product verification on a feature phone for low-tech users.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Feature Phone Verification</CardTitle>
          <CardDescription>
            This interactive simulator demonstrates how users without smartphones can verify products using USSD codes.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-4 md:p-8">
            <UssdSimulator />
        </CardContent>
      </Card>
    </div>
  );
}
