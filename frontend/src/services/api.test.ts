import { afterEach, describe, expect, it, vi } from 'vitest'

type ApiModule = typeof import('./api')

function mockFetch(response: Response) {
  const fetchMock = vi.fn(async () => response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

async function loadApi(viteApiBaseUrl: string | undefined): Promise<ApiModule> {
  vi.resetModules()
  vi.unstubAllEnvs()
  vi.stubEnv('VITE_API_BASE_URL', viteApiBaseUrl)

  return import('./api')
}

describe('apiRequest', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('usa a variável VITE_API_BASE_URL quando configurada', async () => {
    const { apiBaseUrl } = await loadApi('http://localhost:9999/api/')

    expect(apiBaseUrl).toBe('http://localhost:9999/api')
  })

  it.each([undefined, '', '   '])(
    'usa o fallback local quando VITE_API_BASE_URL não existe ou está vazia',
    async (viteApiBaseUrl) => {
      const { apiBaseUrl } = await loadApi(viteApiBaseUrl)

      expect(apiBaseUrl).toBe('http://localhost:5077/api')
    },
  )

  it('retorna JSON em requisição bem-sucedida e usa a URL base', async () => {
    const { apiBaseUrl, apiRequest } = await loadApi('http://localhost:9999/api/')
    const fetchMock = mockFetch(
      new Response(JSON.stringify({ id: 1, name: 'Mariana Freitas' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const result = await apiRequest<{ id: number; name: string }>('/people/')

    expect(result).toEqual({ id: 1, name: 'Mariana Freitas' })
    expect(fetchMock).toHaveBeenCalledWith(`${apiBaseUrl}/people`, { headers: {} })
  })

  it('trata resposta 204 sem interpretar JSON', async () => {
    const { apiRequest } = await loadApi('http://localhost:9999/api')
    mockFetch(new Response(null, { status: 204 }))

    await expect(apiRequest<void>('people/1', { method: 'DELETE' })).resolves.toBeUndefined()
  })

  it('transforma mensagem de erro da API em erro legível', async () => {
    const { apiRequest } = await loadApi('http://localhost:9999/api')
    mockFetch(
      new Response(JSON.stringify({ message: 'Pessoa não encontrada.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    await expect(apiRequest('people/999', undefined, 'Falha.')).rejects.toThrow(
      'Pessoa não encontrada.',
    )
  })

  it('usa mensagem alternativa quando erro da API não possui JSON válido', async () => {
    const { apiRequest } = await loadApi('http://localhost:9999/api')
    mockFetch(new Response('erro', { status: 500 }))

    await expect(apiRequest('people', undefined, 'Falha amigável.')).rejects.toThrow(
      'Falha amigável.',
    )
  })

  it('não expõe mensagem técnica em falha de rede', async () => {
    const { apiRequest } = await loadApi('http://localhost:9999/api')
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('Failed to fetch')
      }),
    )

    await expect(apiRequest('people')).rejects.toThrow('Não foi possível conectar à API.')
    await expect(apiRequest('people')).rejects.not.toThrow('Failed to fetch')
  })
})