type HttpOptions = RequestInit & { json?: unknown }

const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '/api'

export async function http<T>(path: string, { json, headers, ...init }: HttpOptions = {}): Promise<T> {
  const finalHeaders = new Headers(headers)
  if (json) finalHeaders.set('Content-Type', 'application/json')

  const response = await fetch(baseUrl + path, {
    headers: finalHeaders,
    body: json ? JSON.stringify(json) : init.body,
    ...init,
  })

  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await response.json() : (await response.text()) as unknown

  if (!response.ok) {
    const message = isJson && data && typeof data === 'object' && 'message' in (data as any)
      ? (data as any).message
      : response.statusText
    throw new Error(String(message || 'Request failed'))
  }

  return data as T
}

export const httpGet = <T>(path: string, init?: HttpOptions) => http<T>(path, { ...init, method: 'GET' })
export const httpPost = <T>(path: string, json?: unknown, init?: HttpOptions) => http<T>(path, { ...init, method: 'POST', json })
export const httpPut = <T>(path: string, json?: unknown, init?: HttpOptions) => http<T>(path, { ...init, method: 'PUT', json })
export const httpPatch = <T>(path: string, json?: unknown, init?: HttpOptions) => http<T>(path, { ...init, method: 'PATCH', json })
export const httpDelete = <T>(path: string, init?: HttpOptions) => http<T>(path, { ...init, method: 'DELETE' })


