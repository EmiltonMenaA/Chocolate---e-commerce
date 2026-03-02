import { Link } from 'react-router-dom'

export default function VendorDashboard() {
  const products = [
    {
      id: 1,
      name: "Serum Facial Premium",
      price: 49.99,
      sales: 145,
      revenue: "$7248.55",
      status: "Activo"
    },
    {
      id: 2,
      name: "Crema Hidratante",
      price: 39.99,
      sales: 89,
      revenue: "$3559.11",
      status: "Activo"
    },
    {
      id: 3,
      name: "Máscara Facial",
      price: 34.99,
      sales: 62,
      revenue: "$2169.38",
      status: "Pausado"
    }
  ]

  return (
    <div className="px-6 lg:px-20 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-cocoa-900 dark:text-white">
            Panel del Vendedor
          </h1>
          <Link
            to="/vendor-dashboard/add-product"
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Añadir Producto
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-cocoa-800 rounded-xl p-6">
            <span className="material-symbols-outlined text-4xl text-primary mb-2 block">
              trending_up
            </span>
            <p className="text-3xl font-bold text-cocoa-900 dark:text-white">$12,977.04</p>
            <p className="text-cocoa-700 dark:text-slate-300 text-sm">Ingresos Totales</p>
          </div>

          <div className="bg-white dark:bg-cocoa-800 rounded-xl p-6">
            <span className="material-symbols-outlined text-4xl text-green-500 mb-2 block">
              inventory_2
            </span>
            <p className="text-3xl font-bold text-cocoa-900 dark:text-white">296</p>
            <p className="text-cocoa-700 dark:text-slate-300 text-sm">Ventas Totales</p>
          </div>

          <div className="bg-white dark:bg-cocoa-800 rounded-xl p-6">
            <span className="material-symbols-outlined text-4xl text-blue-500 mb-2 block">
              shopping_bag
            </span>
            <p className="text-3xl font-bold text-cocoa-900 dark:text-white">3</p>
            <p className="text-cocoa-700 dark:text-slate-300 text-sm">Productos</p>
          </div>

          <div className="bg-white dark:bg-cocoa-800 rounded-xl p-6">
            <span className="material-symbols-outlined text-4xl text-yellow-500 mb-2 block">
              star
            </span>
            <p className="text-3xl font-bold text-cocoa-900 dark:text-white">4.8</p>
            <p className="text-cocoa-700 dark:text-slate-300 text-sm">Calificación</p>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white dark:bg-cocoa-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-cocoa-200 dark:border-cocoa-700">
            <h3 className="text-2xl font-bold text-cocoa-900 dark:text-white">
              Mis Productos
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cocoa-200 dark:border-cocoa-700 bg-cocoa-50 dark:bg-cocoa-700">
                  <th className="px-6 py-3 text-left font-semibold text-cocoa-900 dark:text-white">
                    Nombre del Producto
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-cocoa-900 dark:text-white">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-cocoa-900 dark:text-white">
                    Ventas
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-cocoa-900 dark:text-white">
                    Ingresos
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-cocoa-900 dark:text-white">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-cocoa-900 dark:text-white">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b border-cocoa-200 dark:border-cocoa-700 hover:bg-cocoa-50 dark:hover:bg-cocoa-700">
                    <td className="px-6 py-4 font-semibold text-cocoa-900 dark:text-white">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-cocoa-700 dark:text-slate-300">
                      ${product.price}
                    </td>
                    <td className="px-6 py-4 text-cocoa-700 dark:text-slate-300">
                      {product.sales}
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">
                      {product.revenue}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        product.status === "Activo"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-primary hover:text-red-600 font-semibold text-sm mr-4">
                        Editar
                      </button>
                      <button className="text-red-600 hover:text-red-700 font-semibold text-sm">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
