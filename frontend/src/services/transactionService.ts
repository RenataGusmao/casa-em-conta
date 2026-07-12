import { apiRequest } from './api'
import type { CreateTransactionRequest, Transaction } from '../types/transaction'

export function getTransactions(): Promise<Transaction[]> {
  return apiRequest<Transaction[]>(
    'transactions',
    undefined,
    'Não foi possível carregar as transações.',
  )
}

export function createTransaction(
  data: CreateTransactionRequest,
): Promise<Transaction> {
  return apiRequest<Transaction>(
    'transactions',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
    'Não foi possível cadastrar a transação.',
  )
}
