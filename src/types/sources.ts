export interface SourceFormData {
  id?: string;
  name: string;
  type:
    | "Bank Account"
    | "Credit Card"
    | "Cash"
    | "Digital Wallet"
    | "Other"
    | "Investment";
  currency: string;
  initial_balance?: number;
  notes?: string;
  credit_limit?: number;
  interest_rate?: number;
  billing_cycle_start?: number;
}