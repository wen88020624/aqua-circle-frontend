// API client for Web (Vite) and React Native (Expo)
type ViteImportMeta = ImportMeta & {
  env?: {
    VITE_API_BASE_URL?: string
  }
}

const getApiBaseUrl = (): string => {
  // Vite replaces import.meta.env at build time for web bundles.
  const viteUrl = (import.meta as ViteImportMeta).env?.VITE_API_BASE_URL
  if (viteUrl) {
    return viteUrl
  }

  if (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL
  }

  return 'http://localhost:3000'
}

const API_BASE_URL = getApiBaseUrl()

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: { message?: string; error?: string } = {}
    try {
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        errorData = (await response.json()) as { message?: string; error?: string }
      } else {
        errorData = { message: await response.text() }
      }
    } catch {
      errorData = { message: `HTTP error! status: ${response.status}` }
    }
    throw new ApiError(
      errorData.message || errorData.error || `HTTP error! status: ${response.status}`,
      response.status,
      errorData
    )
  }

  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T
  }

  const contentType = response.headers.get('content-type')
  if (!contentType?.includes('application/json')) {
    return {} as T
  }

  try {
    return await response.json()
  } catch {
    return {} as T
  }
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    return handleResponse<T>(response)
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
