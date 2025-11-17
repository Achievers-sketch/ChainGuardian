import { Logo } from "@/components/icons";
import Link from "next/link";

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-4 border-b bg-card">
         <Link href="/dashboard" className="flex items-center gap-2 font-semibold w-fit">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-headline text-lg">ChainGuardian</span>
        </Link>
      </header>
      <main className="flex-1 p-4 md:p-8 lg:p-12">
        {children}
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t bg-card">
        Powered by ChainGuardian
      </footer>
    </div>
  );
}
