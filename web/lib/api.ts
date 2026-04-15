import type {
  AnalyticsSummary,
  MonthlyBreakdown,
  HealthScoreResult,
  LoanSimulatorResult,
  Transaction,
  UploadResponse,
} from './types';

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001') + '/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error((err as { message?: string }).message ?? 'Request failed');
  }
  const json = (await res.json()) as ApiResponse<T>;
  return json.data;
}

export const api = {
  upload: (formData: FormData): Promise<Response> =>
    fetch(`${BASE}/transactions/upload`, { method: 'POST', body: formData }),

  getTransactions: (bid: string) =>
    get<Transaction[]>(`${BASE}/transactions/${bid}`),

  getSummary: (bid: string) =>
    get<AnalyticsSummary>(`${BASE}/analytics/${bid}/summary`),

  getMonthly: (bid: string) =>
    get<MonthlyBreakdown[]>(`${BASE}/analytics/${bid}/monthly`),

  getCategories: (bid: string) =>
    get<Record<string, number>>(`${BASE}/analytics/${bid}/categories`),

  getHealthScore: (bid: string) =>
    get<HealthScoreResult>(`${BASE}/health-score/${bid}`),

  getLoanDecision: (bid: string) =>
    get<LoanSimulatorResult>(`${BASE}/loan-simulator/${bid}`),

  deleteBusiness: async (businessId: string): Promise<void> => {
    const res = await fetch(`${BASE}/transactions/${businessId}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Delete failed' }));
      throw new Error((err as { message?: string }).message ?? 'Delete failed');
    }
  },

  uploadRaw: async (formData: FormData): Promise<UploadResponse> => {
    const res = await fetch(`${BASE}/transactions/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error((err as { message?: string }).message ?? 'Upload failed');
    }
    const json = (await res.json()) as ApiResponse<UploadResponse>;
    return json.data;
  },
};
