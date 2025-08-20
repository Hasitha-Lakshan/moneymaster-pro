export const getSourceIcon = (type: string) => {
  const icons: Record<string, string> = {
    "Bank Account": "🏦",
    "Credit Card": "💳",
    Cash: "💵",
    Investment: "📈",
    "Digital Wallet": "📱",
  };
  return icons[type] || "💰";
};

export const getBalanceColor = (balance: number): string => {
  if (balance < 0) return "text-destructive"; // Red for negative balances
  if (balance > 10000) return "text-success"; // Green for large positive balances
  if (balance > 5000) return "text-warning"; // Yellow/gold for medium balances
  return "text-card-foreground"; // Default text color for normal balances
};

// Optional: Enhanced version with more granular color ranges
export const getDetailedBalanceColor = (balance: number): string => {
  if (balance < 0) return "text-destructive"; // Red - Negative
  if (balance === 0) return "text-muted-foreground"; // Gray - Zero
  if (balance <= 1000) return "text-card-foreground"; // Default - Small positive
  if (balance <= 5000) return "text-info"; // Blue - Medium
  if (balance <= 10000) return "text-warning"; // Yellow - Large
  if (balance <= 50000) return "text-success"; // Green - Very large
  return "text-accent"; // Purple - Exceptional
};