# Guía de Inicio Rápido - Proyecto React Chocolat

##  Comenzar a Desarrollar

Para iniciar el servidor de desarrollo:

```bash
npm run dev
```

Esto abrirá automáticamente http://localhost:3000 

##  Estructura del Proyecto

### `/src/pages/` - Páginas Principales
- **HomePage.tsx** - Página de inicio con productos destacados
- **ProductCatalog.tsx** - Catálogo con filtros
- **ProductDetail.tsx** - Detalle de producto individual
- **ShoppingCart.tsx** - Carrito de compras
- **Checkout.tsx** - Flujo de compra en 3 pasos
- **LoginPage.tsx** - Inicio de sesión
- **RegisterPage.tsx** - Registro de usuario
- **SkinQuiz.tsx** - Cuestionario personalizado
- **CustomerDashboard.tsx** - Panel del cliente
- **VendorDashboard.tsx** - Panel del vendedor
- **PaymentMethod.tsx** - Selección de método de pago
- **AddProduct.tsx** - Formulario de agregar producto

### `/src/components/` - Componentes Reutilizables
- **Layout.tsx** - Estructura principal (Header + Footer + Outlet)
- **Header.tsx** - Navegación superior
- **Footer.tsx** - Pie de página

##  Personalización

### Colores
Los colores están definidos en `tailwind.config.js`. Edita el objeto `colors` para cambiar:
- `primary`: Color principal (rojo: #da0b43)
- `background-light/dark`: Fondos
- `cocoa`: Paleta de marrones

### Fuentes
En `index.html` están definidas las fuentes. Por defecto:
- Material Symbols (iconos)
- Plus Jakarta Sans (texto)

### Datos
Todos los productos y datos de ejemplo están hardcodeados en las páginas. Para conectar datos reales:

1. **Crea un archivo de hooks** en `/src/hooks/useProducts.ts`
2. **Usa Axios** para llamadas API:

```typescript
import axios from 'axios'

export const useProducts = () => {
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    axios.get('/api/products').then(res => setProducts(res.data))
  }, [])
  
  return products
}
```

## 🔧 Próximos Pasos Recomendados

### 1. Conectar Backend
```typescript
// En cualquier página
import axios from 'axios'

const { data: products } = await axios.get('https://tu-api.com/products')
```

### 2. Agregar Gestión de Estado (Zustand)
```bash
npm install zustand
```

Crear `/src/stores/cartStore.ts`:
```typescript
import { create } from 'zustand'

interface CartItem {
  id: number
  quantity: number
}

export const useCartStore = create((set) => ({
  items: [],
  addToCart: (item: CartItem) => set(state => ({
    items: [...state.items, item]
  }))
}))
```

### 3. Integrar Stripe/PayPal
Para PaymentMethod.tsx:
```bash
npm install @stripe/react-stripe-js @stripe/js
```

### 4. Sistema de Autenticación
Crear `/src/context/AuthContext.tsx` para gestionar usuarios logeados

### 5. Agregar Validaciones
Usar bibliotecas como `react-hook-form` y `zod`:
```bash
npm install react-hook-form zod @hookform/resolvers
```

##  Construir para Producción

```bash
npm run build
```



##  Debugging

- Usa las DevTools de React en el navegador
- Inspecciona componentes con React Dev Tools
- Revisa la consola del navegador (F12)



