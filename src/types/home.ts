export interface Source {
  id: string;
  name: string;
  balance: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface TransactionType {
  id: number;
  name: string;
}

export interface Transaction {
  id: string;
  date: string;
  type_id: string;
  amount: number;
  notes?: string;
}

export interface TransactionWithType extends Transaction {
  type_name: string;
  direction: "in" | "out";
}
