export interface MonthlyBreakdown {
  month: string;
  revenue: number;
  expenses: number;
  net: number;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  avgMonthlyRevenue: number;
  numMonths: number;
}

export interface ComponentScore {
  name: string;
  score: number;
  maxScore: number;
  explanation: string;
}

export interface HealthScoreResult {
  score: number | null;
  label: string;
  breakdown: ComponentScore[];
  explanation?: string;
}

export interface LoanSimulatorResult {
  decision: 'Approved' | 'Conditional' | 'Declined';
  riskLevel: 'Low' | 'Medium' | 'High';
  estimatedLoanAmount: number;
  reasoning: string[];
  generatedAt: string;
}

export interface Transaction {
  id: string;
  businessId: string;
  date: string;
  description: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
}

export interface UploadResponse {
  businessId: string;
  businessName: string;
  transactionCount: number;
}
