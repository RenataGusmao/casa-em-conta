export type HealthResponse = {
  status: string
  application: string
}

const fallbackBaseUrl = 'https://localhost:7154/api'

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? fallbackBaseUrl

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${apiBaseUrl}/health`)

  if (!response.ok) {
    throw new Error('API health check failed')
  }

  return response.json()
}
