export const TransactionType = {
  Expense: 1,
  Income: 2,
} as const

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType]

export interface Transaction {
  id: number
  description: string
  value: number
  type: TransactionType
  personId: number
  personName: string
}

export interface CreateTransactionRequest {
  description: string
  value: number
  type: TransactionType
  personId: number
}