import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiBaseUrl, apiRequest } from './api'

function mockFetch(response: Response) {
  const fetchMock = vi.fn(async () => response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('apiRequest', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('retorna JSON em requisição bem-sucedida e usa a URL base', async () => {
    const fetchMock = mockFetch(
      new Response(JSON.stringify({ id: 1, name: 'Ana' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const result = await apiRequest<{ id: number; name: string }>('people')

    expect(result).toEqual({ id: 1, name: 'Ana' })
    expect(fetchMock.mock.calls[0]?.[0]).toBe(`${apiBaseUrl}/people`)
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({ headers: {} })
  })

  it('trata resposta 204 sem interpretar JSON', async () => {
    mockFetch(new Response(null, { status: 204 }))

    await expect(apiRequest<void>('people/1', { method: 'DELETE' })).resolves.toBeUndefined()
  })

  it('transforma mensagem de erro da API em erro legível', async () => {
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
    mockFetch(new Response('erro', { status: 500 }))

    await expect(apiRequest('people', undefined, 'Falha amigável.')).rejects.toThrow(
      'Falha amigável.',
    )
  })

  it('não expõe mensagem técnica em falha de rede', async () => {
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