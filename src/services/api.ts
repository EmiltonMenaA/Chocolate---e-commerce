export type HealthResponse = {
  status: string
  framework: string
  version: string
}

export async function getBackendHealth(): Promise<HealthResponse> {
  const response = await fetch('/api/health/')

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status}`)
  }

  return response.json() as Promise<HealthResponse>
}
