import { PortfolioOverview } from '@/components/portfolio/PortfolioOverview';

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-defi-primary to-defi-secondary bg-clip-text text-transparent">
        Portfolio Overview
      </h1>
      <PortfolioOverview />
    </div>
  );
} 