export default function CustomerDashboard() {
  const orders = [
    {
      id: 1,
      date: "2026-03-01",
      total: "$89.98",
      status: "Entregado",
      items: 2
    },
    {
      id: 2,
      date: "2026-02-15",
      total: "$49.99",
      status: "En tránsito",
      items: 1
    }
  ]

  return (
    <div className="px-6 lg:px-20 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-cocoa-900 dark:text-white mb-8">
          Mi Cuenta
        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Welcome Card */}
          <div className="md:col-span-3 bg-white dark:bg-cocoa-800 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-cocoa-900 dark:text-white mb-2">
              ¡Bienvenida, María!
            </h2>
            <p className="text-cocoa-700 dark:text-slate-300">
              Aquí puedes ver tu perfil, órdenes anteriores y preferencias
            </p>
          </div>

          {/* Stats */}
          <div className="bg-white dark:bg-cocoa-800 rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-4xl text-primary mb-2 block">
              shopping_bag
            </span>
            <p className="text-3xl font-bold text-cocoa-900 dark:text-white">5</p>
            <p className="text-cocoa-700 dark:text-slate-300">Órdenes Total</p>
          </div>

          <div className="bg-white dark:bg-cocoa-800 rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-4xl text-green-500 mb-2 block">
              favorite
            </span>
            <p className="text-3xl font-bold text-cocoa-900 dark:text-white">12</p>
            <p className="text-cocoa-700 dark:text-slate-300">Favoritos</p>
          </div>

          <div className="bg-white dark:bg-cocoa-800 rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-4xl text-blue-500 mb-2 block">
              card_membership
            </span>
            <p className="text-3xl font-bold text-cocoa-900 dark:text-white">Gold</p>
            <p className="text-cocoa-700 dark:text-slate-300">Membresía</p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white dark:bg-cocoa-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-cocoa-200 dark:border-cocoa-700">
            <h3 className="text-2xl font-bold text-cocoa-900 dark:text-white">
              Órdenes Recientes
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cocoa-200 dark:border-cocoa-700 bg-cocoa-50 dark:bg-cocoa-700">
                  <th className="px-6 py-3 text-left font-semibold text-cocoa-900 dark:text-white">
                    ID de Orden
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-cocoa-900 dark:text-white">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-cocoa-900 dark:text-white">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-cocoa-900 dark:text-white">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-cocoa-900 dark:text-white">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-cocoa-200 dark:border-cocoa-700 hover:bg-cocoa-50 dark:hover:bg-cocoa-700">
                    <td className="px-6 py-4 font-semibold text-cocoa-900 dark:text-white">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 text-cocoa-700 dark:text-slate-300">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 text-cocoa-700 dark:text-slate-300">
                      {order.items}
                    </td>
                    <td className="px-6 py-4 font-bold text-primary">
                      {order.total}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === "Entregado"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {order.status}
                      </span>
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
