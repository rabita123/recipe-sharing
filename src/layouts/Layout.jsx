import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'
import Navigation from '../components/Navigation'

function Layout({ children }) {
  const { user, signOut } = useAuth()

  const navigation = [
    { name: 'Home', href: '/', current: true },
    ...(user ? [
      { name: 'Add Recipe', href: '/add-recipe', current: false },
      { name: 'Profile', href: '/profile', current: false }
    ] : []),
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout