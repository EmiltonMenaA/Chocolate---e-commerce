import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-cocoa-900 dark:bg-cocoa-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center font-bold">
                C
              </div>
              <span className="text-xl font-bold">Chocolat</span>
            </div>
            <p className="text-slate-400">
              Productos naturales de lujo para tu cuidado de la piel.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 text-primary">Navegación</h3>
            <div className="flex flex-col gap-2">
              <Link to="/products" className="text-slate-400 hover:text-white transition-colors">
                Catálogo
              </Link>
              <Link to="/skin-quiz" className="text-slate-400 hover:text-white transition-colors">
                Skin Quiz
              </Link>
              <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                Acerca de
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold mb-4 text-primary">Servicio al Cliente</h3>
            <div className="flex flex-col gap-2">
              <a href="mailto:support@chocolat.com" className="text-slate-400 hover:text-white transition-colors">
                Contacto
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Preguntas Frecuentes
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Devoluciones
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold mb-4 text-primary">Legal</h3>
            <div className="flex flex-col gap-2">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Privacidad
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Términos
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-cocoa-800 pt-8 text-center text-slate-400">
          <p>&copy; 2026 Chocolat. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
