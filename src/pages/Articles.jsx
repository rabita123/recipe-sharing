import React, { useState, useEffect, Fragment } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Menu, Transition } from '@headlessui/react'
import { 
  LightBulbIcon,
  AcademicCapIcon,
  BeakerIcon,
  NewspaperIcon,
  ArrowRightIcon,
  HeartIcon,
  ClockIcon,
  BookOpenIcon,
  SparklesIcon,
  ChevronDownIcon,
  TagIcon
} from '@heroicons/react/24/outline'
import { getArticles, getCategories } from '../services/articles'

// Define iconMap outside the component
const ICON_MAP = {
  NewspaperIcon,
  LightBulbIcon,
  AcademicCapIcon,
  BeakerIcon,
  HeartIcon,
  ClockIcon,
  BookOpenIcon,
  SparklesIcon
}

// Helper function to get icon component
const getIconComponent = (iconName) => {
  if (!iconName) return NewspaperIcon
  const Icon = ICON_MAP[iconName]
  return Icon || NewspaperIcon
}

function ArticleCard({ article }) {
  return (
    <Link
      to={`/articles/${article.id}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
    >
      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center mb-3">
          <TagIcon className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-500 capitalize">
            {article.category}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">
          {article.title}
        </h3>
        <p className="text-gray-600 line-clamp-2 text-sm mb-4">
          {article.description}
        </p>
        <div className="flex items-center text-emerald-600">
          <span className="text-sm font-medium">Read article</span>
          <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  )
}

function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      <div className="animate-pulse">
        <div className="aspect-w-16 aspect-h-9 bg-gray-200" />
        <div className="p-6">
          <div className="flex items-center mb-3">
            <div className="h-4 w-4 bg-gray-200 rounded mr-2" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4" />
          <div className="flex items-center">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-4 bg-gray-200 rounded ml-2" />
          </div>
        </div>
      </div>
    </div>
  )
}

function CategoryIcon({ icon, className }) {
  const Icon = getIconComponent(icon)
  return <Icon className={className} />
}

function Articles() {
  const [searchParams] = useSearchParams()
  const [articles, setArticles] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const category = searchParams.get('category')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [articlesData, categoriesData] = await Promise.all([
          getArticles(category),
          getCategories()
        ])
        setArticles(articlesData)
        setCategories([
          { id: '', name: 'All Articles', icon: 'NewspaperIcon', color: 'emerald' },
          ...categoriesData
        ])
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [category])

  const activeCategory = categories.find(c => 
    (!category && !c.id) || category === c.id
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {activeCategory?.name || 'All Articles'}
        </h1>
        <p className="mt-2 text-gray-600">
          {activeCategory?.description || 'Learn cooking tips, techniques, and the science behind your favorite recipes'}
        </p>
      </div>

      {/* Category Filters - Desktop */}
      <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        {categories.map((cat) => {
          const isActive = (!category && !cat.id) || category === cat.id
          return (
            <Link
              key={cat.id}
              to={cat.id ? `/articles?category=${cat.id}` : '/articles'}
              className={`flex items-center p-4 rounded-xl border ${
                isActive
                  ? `bg-${cat.color}-50 border-${cat.color}-200 text-${cat.color}-700`
                  : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
              } transition-all duration-200`}
            >
              <CategoryIcon 
                icon={cat.icon} 
                className={`h-5 w-5 mr-2 ${
                  isActive ? `text-${cat.color}-500` : ''
                } transition-colors`}
              />
              <span className="font-medium">{cat.name}</span>
            </Link>
          )
        })}
      </div>

      {/* Category Dropdown - Mobile */}
      <div className="md:hidden mb-8">
        <Menu as="div" className="relative">
          <Menu.Button className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
            <span className="flex items-center">
              {activeCategory && (
                <CategoryIcon 
                  icon={activeCategory.icon} 
                  className={`h-5 w-5 mr-2 text-${activeCategory.color}-500`}
                />
              )}
              {activeCategory?.name || 'All Articles'}
            </span>
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute z-10 mt-2 w-full rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
              <div className="py-1">
                {categories.map((cat) => {
                  const isActive = (!category && !cat.id) || category === cat.id
                  return (
                    <Menu.Item key={cat.id}>
                      {({ active }) => (
                        <Link
                          to={cat.id ? `/articles?category=${cat.id}` : '/articles'}
                          className={`${
                            active ? 'bg-gray-50' : ''
                          } flex items-center px-4 py-3 text-sm ${
                            isActive ? `text-${cat.color}-600` : 'text-gray-700'
                          }`}
                        >
                          <CategoryIcon 
                            icon={cat.icon} 
                            className={`h-5 w-5 mr-2 ${
                              isActive ? `text-${cat.color}-500` : 'text-gray-400'
                            }`}
                          />
                          {cat.name}
                        </Link>
                      )}
                    </Menu.Item>
                  )
                })}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <NewspaperIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try selecting a different category or check back later for new articles.
          </p>
        </div>
      )}
    </div>
  )
}

export default Articles 