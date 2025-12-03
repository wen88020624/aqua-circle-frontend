// API 客戶端配置
// 支援 Web (Vite) 和 React Native (Expo) 的環境變數
const getApiBaseUrl = (): string => {
  // Web (Vite)
  if (typeof import !== 'undefined' && import.meta && import.meta.env) {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  }
  // React Native (Expo)
  if (typeof process !== 'undefined' && process.env && process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }
  // 預設值
  return 'http://localhost:3000';
};

const API_BASE_URL = getApiBaseUrl();

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: any = {};
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      } else {
        errorData = { message: await response.text() };
      }
    } catch {
      errorData = { message: `HTTP error! status: ${response.status}` };
    }
    throw new ApiError(
      errorData.message || errorData.error || `HTTP error! status: ${response.status}`,
      response.status,
      errorData
    );
  }
  
  // 如果回應沒有內容（204 No Content 或空回應），返回空物件
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T;
  }
  
  // 檢查回應是否有內容
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return {} as T;
  }
  
  try {
    return await response.json();
  } catch (error) {
    // 如果 JSON 解析失敗，返回空物件
    return {} as T;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

