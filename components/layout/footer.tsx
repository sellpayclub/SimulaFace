'use client'

import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-white border-t border-primary-100 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="text-lg font-serif font-bold text-gradient">
              SimulaFace
            </span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/termos" className="hover:text-primary-600 transition-colors">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="hover:text-primary-600 transition-colors">
              Privacidade
            </Link>
            <Link href="/contato" className="hover:text-primary-600 transition-colors">
              Contato
            </Link>
          </nav>

          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} SimulaFace. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

