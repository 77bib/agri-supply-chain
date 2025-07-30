import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  stock: number
  batchId: string
  harvestDate: string
  expiryDate: string
  farmer: string
  certifications: string[]
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered"
  date: string
  customerName: string
  customerEmail: string
  shippingAddress: string
}

export interface Farmer {
  id: string
  name: string
  location: string
  contact: string
  products: string[]
  rating: number
  status: "active" | "inactive"
}

export interface Transporter {
  id: string
  name: string
  contact: string
  vehicles: number
  currentDeliveries: number
  rating: number
  status: "active" | "inactive"
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: string
  registrationDate: string
  status: "active" | "inactive"
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
}

interface StoreState {
  // Auth
  isAdmin: boolean
  setIsAdmin: (isAdmin: boolean) => void

  // Products
  products: Product[]
  setProducts: (products: Product[]) => void
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void

  // Cart
  cart: CartItem[]
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void

  // Orders
  orders: Order[]
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: Order["status"]) => void

  // Farmers
  farmers: Farmer[]
  setFarmers: (farmers: Farmer[]) => void
  updateFarmer: (id: string, farmer: Partial<Farmer>) => void

  // Transporters
  transporters: Transporter[]
  setTransporters: (transporters: Transporter[]) => void
  updateTransporter: (id: string, transporter: Partial<Transporter>) => void

  // Clients
  clients: Client[]
  setClients: (clients: Client[]) => void
  addClient: (client: Client) => void
  updateClient: (id: string, client: Partial<Client>) => void
  deleteClient: (id: string) => void

  // Current user
  currentUser: Client | null
  setCurrentUser: (user: Client | null) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Auth
      isAdmin: false,
      setIsAdmin: (isAdmin) => set({ isAdmin }),

      // Products
      products: [],
      setProducts: (products) => set({ products }),
      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, product],
        })),
      updateProduct: (id, updatedProduct) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      // Cart
      cart: [],
      addToCart: (product, quantity) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.product.id === product.id)
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
              ),
            }
          }
          return { cart: [...state.cart, { product, quantity }] }
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        })),
      updateCartQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
        })),
      clearCart: () => set({ cart: [] }),

      // Orders
      orders: [],
      addOrder: (order) =>
        set((state) => ({
          orders: [...state.orders, order],
        })),
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
        })),

      // Farmers
      farmers: [],
      setFarmers: (farmers) => set({ farmers }),
      updateFarmer: (id, updatedFarmer) =>
        set((state) => ({
          farmers: state.farmers.map((f) => (f.id === id ? { ...f, ...updatedFarmer } : f)),
        })),

      // Transporters
      transporters: [],
      setTransporters: (transporters) => set({ transporters }),
      updateTransporter: (id, updatedTransporter) =>
        set((state) => ({
          transporters: state.transporters.map((t) => (t.id === id ? { ...t, ...updatedTransporter } : t)),
        })),

      // Clients
      clients: [],
      setClients: (clients) => set({ clients }),
      addClient: (client) =>
        set((state) => ({
          clients: [...state.clients, client],
        })),
      updateClient: (id, updatedClient) =>
        set((state) => ({
          clients: state.clients.map((c) => (c.id === id ? { ...c, ...updatedClient } : c)),
        })),
      deleteClient: (id) =>
        set((state) => ({
          clients: state.clients.filter((c) => c.id !== id),
        })),

      // Current user
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
    }),
    {
      name: "agrichain-store",
    },
  ),
)
