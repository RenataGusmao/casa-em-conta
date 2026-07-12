import { apiRequest } from './api'
import type { TotalsReport } from '../types/report'

export function getTotalsReport(): Promise<TotalsReport> {
  return apiRequest<TotalsReport>(
    'reports/totals',
    undefined,
    'Não foi possível carregar os totais.',
  )
}