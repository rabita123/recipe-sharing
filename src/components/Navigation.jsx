import { Fragment, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, Transition } from '@headlessui/react'
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon,
  PlusIcon,
  HomeIcon,
  BookOpenIcon,
  FireIcon,
  ClockIcon,
  HeartIcon,
  SparklesIcon,
  CakeIcon,
  MagnifyingGlassIcon,
  NewspaperIcon,
  AcademicCapIcon,
  BeakerIcon,
  LightBulbIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

function Navigation() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const recipeCategories = [
    { name: 'All Recipes', icon: BookOpenIcon, href: '/recipes' },
    { name: 'Popular', icon: FireIcon, href: '/recipes?sort=popular' },
    { name: 'Quick & Easy', icon: ClockIcon, href: '/recipes?category=quick' },
    { name: 'Breakfast', icon: CakeIcon, href: '/recipes?category=breakfast' },
    { name: 'Main Course', icon: SparklesIcon, href: '/recipes?category=main' },
    { name: 'Desserts', icon: HeartIcon, href: '/recipes?category=desserts' }
  ]

  const articleCategories = [
    { name: 'All Articles', icon: NewspaperIcon, href: '/articles' },
    { name: 'Cooking Tips', icon: LightBulbIcon, href: '/articles?category=tips' },
    { name: 'Techniques', icon: AcademicCapIcon, href: '/articles?category=techniques' },
    { name: 'Kitchen Science', icon: BeakerIcon, href: '/articles?category=science' }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    const searchTerm = e.target.search.value
    if (searchTerm.trim()) {
      navigate(`/recipes?searchTerm=${encodeURIComponent(searchTerm)}`)
      setIsMobileMenuOpen(false)
    }
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
            <Link 
              to="/" 
              className="flex-shrink-0 flex items-center ml-4 sm:ml-0"
            >
              <span className="text-xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                Recipe Share
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:space-x-8 items-center">
            <Link
              to="/"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                isActive('/') 
                  ? 'border-emerald-500 text-emerald-600' 
                  : 'border-transparent text-gray-500 hover:text-emerald-600 hover:border-gray-300'
              }`}
            >
              <HomeIcon className="h-5 w-5 mr-1" />
              Home
            </Link>

            <Menu as="div" className="relative">
              {({ open }) => (
                <>
                  <Menu.Button 
                    className={`group inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                      open || location.pathname === '/recipes'
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-emerald-600 hover:border-gray-300'
                    }`}
                  >
                    <BookOpenIcon className="h-5 w-5 mr-1" />
                    Recipes
                    <svg className={`ml-2 h-5 w-5 transition-transform ${open ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Menu.Items className="absolute left-0 mt-3 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
                      <div className="py-1">
                        {recipeCategories.map((category) => (
                          <Menu.Item key={category.name}>
                            {({ active }) => (
                              <Link
                                to={category.href}
                                className={`${
                                  active ? 'bg-gray-50 text-emerald-600' : 'text-gray-700'
                                } group flex items-center px-4 py-3 text-sm hover:bg-gray-50 transition-colors`}
                              >
                                <category.icon className={`${
                                  active ? 'text-emerald-600' : 'text-gray-400'
                                } h-5 w-5 mr-3 transition-colors`} />
                                {category.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>

            <Menu as="div" className="relative">
              {({ open }) => (
                <>
                  <Menu.Button 
                    className={`group inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                      open || location.pathname === '/articles'
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-emerald-600 hover:border-gray-300'
                    }`}
                  >
                    <NewspaperIcon className="h-5 w-5 mr-1" />
                    Articles
                    <svg className={`ml-2 h-5 w-5 transition-transform ${open ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Menu.Items className="absolute left-0 mt-3 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
                      <div className="py-1">
                        {articleCategories.map((category) => (
                          <Menu.Item key={category.name}>
                            {({ active }) => (
                              <Link
                                to={category.href}
                                className={`${
                                  active ? 'bg-gray-50 text-emerald-600' : 'text-gray-700'
                                } group flex items-center px-4 py-3 text-sm hover:bg-gray-50 transition-colors`}
                              >
                                <category.icon className={`${
                                  active ? 'text-emerald-600' : 'text-gray-400'
                                } h-5 w-5 mr-3 transition-colors`} />
                                {category.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>

            {user && (
              <Link
                to="/add-recipe"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                  isActive('/add-recipe')
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-500 hover:text-emerald-600 hover:border-gray-300'
                }`}
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                Add Recipe
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg px-4 hidden lg:flex items-center justify-center">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  name="search"
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  placeholder="Search recipes..."
                />
              </div>
            </form>
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            {user ? (
              <Menu as="div" className="ml-3 relative">
                <Menu.Button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                  <UserCircleIcon className="h-8 w-8 text-gray-600" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/profile"
                            className={`${
                              active ? 'bg-gray-50 text-emerald-600' : 'text-gray-700'
                            } group flex items-center px-4 py-3 text-sm hover:bg-gray-50 transition-colors`}
                          >
                            <UserCircleIcon className={`${
                              active ? 'text-emerald-600' : 'text-gray-400'
                            } h-5 w-5 mr-3 transition-colors`} />
                            My Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => signOut()}
                            className={`${
                              active ? 'bg-gray-50 text-emerald-600' : 'text-gray-700'
                            } group flex items-center w-full px-4 py-3 text-sm hover:bg-gray-50 transition-colors`}
                          >
                            <ArrowRightIcon className={`${
                              active ? 'text-emerald-600' : 'text-gray-400'
                            } h-5 w-5 mr-3 transition-colors`} />
                            Sign Out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-500 hover:text-emerald-600 px-3 py-2 rounded-lg text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="bg-emerald-500 text-white hover:bg-emerald-600 px-4 py-2 rounded-lg text-sm font-medium hidden sm:block transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <Transition
        show={isMobileMenuOpen}
        enter="transition duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {/* Mobile Search */}
            <div className="px-4 pb-2">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    name="search"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    placeholder="Search recipes..."
                  />
                </div>
              </form>
            </div>

            {/* Mobile Navigation Links */}
            <Link
              to="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/')
                  ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-emerald-600'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="flex items-center">
                <HomeIcon className="h-5 w-5 mr-2" />
                Home
              </div>
            </Link>

            {/* Mobile Recipe Categories */}
            <div className="space-y-1">
              <div className="pl-3 pr-4 py-2 text-base font-medium text-gray-500 border-l-4 border-transparent">
                Recipe Categories
              </div>
              {recipeCategories.map((category) => (
                <Link
                  key={category.name}
                  to={category.href}
                  className="block pl-8 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-emerald-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <category.icon className="h-5 w-5 mr-2" />
                    {category.name}
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile Article Categories */}
            <div className="space-y-1">
              <div className="pl-3 pr-4 py-2 text-base font-medium text-gray-500 border-l-4 border-transparent">
                Article Categories
              </div>
              {articleCategories.map((category) => (
                <Link
                  key={category.name}
                  to={category.href}
                  className="block pl-8 pr-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-emerald-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <category.icon className="h-5 w-5 mr-2" />
                    {category.name}
                  </div>
                </Link>
              ))}
            </div>

            {user && (
              <Link
                to="/add-recipe"
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive('/add-recipe')
                    ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-emerald-600'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Recipe
                </div>
              </Link>
            )}
          </div>
        </div>
      </Transition>
    </nav>
  )
}

export default Navigation 