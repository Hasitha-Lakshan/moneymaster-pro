export const getSourceIcon = (type: string) => {
  const icons: Record<string, string> = {
    bank: "🏦",
    credit_card: "💳",
    cash: "💵",
    investment: "📈",
  };
  return icons[type] || "💰";
};

export const getBalanceColor = (balance: number, darkMode: boolean) => {
  if (balance < 0) return darkMode ? "text-red-400" : "text-red-600";
  if (balance > 10000) return darkMode ? "text-green-400" : "text-green-600";
  return darkMode ? "text-white" : "text-gray-900";
};
