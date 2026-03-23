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

// ── Tipos ──────────────────────────────────────────────
export type Reseña = {
  id: string
  usuario: number
  usuario_nombre: string
  calificacion: number
  comentario: string
  created_at: string
}

export type DetallePedido = {
  producto_id: string
  producto_nombre: string
  producto_imagen: string | null
  cantidad: number
  precio_unitario: string
  subtotal: number
}

export type PedidoDetallado = {
  id: string
  fecha: string
  estado: string
  total: string
  detalles: DetallePedido[]
}

// ── Reseñas ─────────────────────────────────────────────
export async function getReseñas(productoId: string): Promise<Reseña[]> {
  const response = await fetch(`/api/productos/${productoId}/reseñas/`)
  if (!response.ok) throw new Error('Error al cargar reseñas')
  return response.json()
}

export async function crearReseña(
  productoId: string,
  data: { calificacion: number; comentario: string },
  accessToken: string
): Promise<Reseña> {
  const response = await fetch(`/api/productos/${productoId}/reseñas/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Error al enviar reseña')
  }
  return response.json()
}

// ── Historial detallado ──────────────────────────────────
export async function getPedidoDetallado(
  pedidoId: string,
  accessToken: string
): Promise<PedidoDetallado> {
  const response = await fetch(`/api/pedidos/${pedidoId}/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) throw new Error('Error al cargar el pedido')
  return response.json()
}