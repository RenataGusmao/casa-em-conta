export interface PersonTotals {
  personId: number
  personName: string
  totalIncome: number
  totalExpense: number
  balance: number
}

export interface OverallTotals {
  totalIncome: number
  totalExpense: number
  balance: number
}

export interface TotalsReport {
  people: PersonTotals[]
  overall: OverallTotals
}