import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type CartItem = {
  id: number | string
  name: string
  price: number
  quantity: number
  image: string
}

type CartItemInput = Omit<CartItem, 'quantity'> & {
  quantity?: number
}

type CartContextValue = {
  cartItems: CartItem[]
  cartCount: number
  subtotal: number
  addToCart: (item: CartItemInput) => void
  updateQuantity: (id: number | string, newQuantity: number) => void
  removeFromCart: (id: number | string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const CART_STORAGE_KEY = 'chocolat-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') {
      return []
    }

    const savedCart = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!savedCart) {
      return []
    }

    try {
      return JSON.parse(savedCart) as CartItem[]
    } catch {
      return []
    }
  })

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (item: CartItemInput) => {
    const quantityToAdd = item.quantity ?? 1

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((currentItem) => currentItem.id === item.id)
      if (!existingItem) {
        return [...currentItems, { ...item, quantity: quantityToAdd }]
      }

      return currentItems.map((currentItem) =>
        currentItem.id === item.id
          ? { ...currentItem, quantity: currentItem.quantity + quantityToAdd }
          : currentItem,
      )
    })
  }

  const updateQuantity = (id: number | string, newQuantity: number) => {
    setCartItems((currentItems) => {
      if (newQuantity <= 0) {
        return currentItems.filter((item) => item.id !== id)
      }

      return currentItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      )
    })
  }

  const removeFromCart = (id: number | string) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }

  return context
}