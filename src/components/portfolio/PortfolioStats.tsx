export const PortfolioStats = ({ totalValue, totalAssets }: { totalValue: number; totalAssets: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-6 bg-defi-light dark:bg-defi-dark-light rounded-lg">
        <h3 className="text-gray-600 dark:text-gray-400 text-sm">Total Portfolio Value</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          ${totalValue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
      </div>
      <div className="p-6 bg-defi-light dark:bg-defi-dark-light rounded-lg">
        <h3 className="text-gray-600 dark:text-gray-400 text-sm">Total Assets</h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalAssets}</p>
      </div>
    </div>
  );
}; 