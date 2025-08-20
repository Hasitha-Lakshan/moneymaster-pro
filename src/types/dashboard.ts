export interface SourceBalance {
  source_id: string;
  source_name: string;
  type:
    | "Bank Account"
    | "Credit Card"
    | "Cash"
    | "Digital Wallet"
    | "Investment"
    | "Other";
  currency: string;
  current_balance: number;
  credit_limit: number;
  available_credit?: number;
}

export interface LendingOutstanding {
  transaction_id: string;
  person_name: string;
  initial_outstanding: number;
  current_outstanding: number;
  due_date?: string;
  status: "Ongoing" | "Paid" | "Partial Paid";
}

export interface BorrowingOutstanding {
  transaction_id: string;
  person_name: string;
  initial_outstanding: number;
  current_outstanding: number;
  due_date?: string;
  status: "Ongoing" | "Repaid" | "Partial Repaid";
}

export interface InvestmentSummary {
  source_id: string;
  source_name: string;
  total_value: number;
  net_invested: number;
}

export interface MonthlySummary {
  month: string; // timestamp string
  total_income: number;
  total_expense: number;
  transaction_count: number;
}
