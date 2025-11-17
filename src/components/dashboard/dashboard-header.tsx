import { MobileNav } from './dashboard-sidebar';

export default function DashboardHeader() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 md:px-6 md:h-16 sticky top-0 z-30">
      <div className="md:hidden">
        <MobileNav />
      </div>
      <div className="w-full flex-1">
        {/* Can add a search bar here if needed */}
      </div>
    </header>
  );
}
