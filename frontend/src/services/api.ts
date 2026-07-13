export type HealthResponse = {
  status: string
  application: string
}

export type ApiErrorResponse = {
  message?: string
}

const fallbackBaseUrl = 'http://localhost:5077/api'

// O fallback permite executar o projeto localmente mesmo antes da criação do arquivo .env.
export const apiBaseUrl = normalizeBaseUrl(
  import.meta.env.VITE_API_BASE_URL?.trim() || fallbackBaseUrl,
)

export async function apiRequest<T>(
  path: string,
  options?: RequestInit,
  fallbackMessage = 'Não foi possível conectar à API.',
): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${apiBaseUrl}/${trimSlashes(path)}`, {
      ...options,
      headers: {
        ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
        ...options?.headers,
      },
    })
  } catch {
    throw new Error('Não foi possível conectar à API.')
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, fallbackMessage))
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export function getHealth(): Promise<HealthResponse> {
  return apiRequest<HealthResponse>(
    'health',
    undefined,
    'Não foi possível conectar à API.',
  )
}

function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, '')
}

function trimSlashes(path: string) {
  return path.replace(/^\/+|\/+$/g, '')
}

async function getErrorMessage(response: Response, fallbackMessage: string) {
  try {
    const data = (await response.json()) as ApiErrorResponse

    // Centraliza mensagens amigáveis para evitar detalhes técnicos do fetch na interface.
    return data.message?.trim() || fallbackMessage
  } catch {
    return fallbackMessage
  }
}