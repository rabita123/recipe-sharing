import { useState, useEffect } from 'react'
import { shoppingListsService } from '../services/shoppingLists'
import { toast } from 'react-hot-toast'
import { 
  CheckIcon, 
  TrashIcon, 
  PlusIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'

function ShoppingList({ recipeId, ingredients, onClose }) {
  const [lists, setLists] = useState([])
  const [selectedList, setSelectedList] = useState(null)
  const [newListName, setNewListName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadLists()
  }, [])

  const loadLists = async () => {
    try {
      setLoading(true)
      const data = await shoppingListsService.getAll()
      setLists(data || [])
    } catch (error) {
      setError(error.message)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const createList = async (e) => {
    e.preventDefault()
    if (!newListName.trim()) return

    try {
      setLoading(true)
      const list = await shoppingListsService.create(newListName)
      setLists([list, ...lists])
      setSelectedList(list.id)
      setNewListName('')
      toast.success('Shopping list created')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const addToList = async (listId) => {
    try {
      setLoading(true)
      const items = ingredients.map(ingredient => ({
        recipe_id: recipeId,
        ingredient: ingredient.trim(),
        quantity: ''
      }))

      await shoppingListsService.addItems(listId, items)
      await loadLists()
      toast.success('Ingredients added to list')
      onClose()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleItem = async (itemId, checked) => {
    try {
      await shoppingListsService.updateItem(itemId, { checked: !checked })
      const updatedLists = lists.map(list => ({
        ...list,
        shopping_list_items: list.shopping_list_items.map(item =>
          item.id === itemId ? { ...item, checked: !checked } : item
        )
      }))
      setLists(updatedLists)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteList = async (listId) => {
    if (!window.confirm('Are you sure you want to delete this list?')) return

    try {
      await shoppingListsService.deleteList(listId)
      setLists(lists.filter(list => list.id !== listId))
      toast.success('Shopping list deleted')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const printList = (list) => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    
    // Generate HTML content
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${list.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1 {
              color: #333;
              border-bottom: 2px solid #eee;
              padding-bottom: 10px;
            }
            .item {
              padding: 8px 0;
              border-bottom: 1px solid #eee;
            }
            .checked {
              text-decoration: line-through;
              color: #666;
            }
            .recipe-name {
              font-size: 0.9em;
              color: #666;
              margin-left: 8px;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <h1>${list.name}</h1>
          ${list.shopping_list_items?.map((item, index) => `
            <div class="item ${item.checked ? 'checked' : ''}">
              ${index + 1}. ${item.ingredient}
              ${item.recipes?.title ? `<span class="recipe-name">(from ${item.recipes.title})</span>` : ''}
            </div>
          `).join('')}
        </body>
      </html>
    `

    // Write content to the new window
    printWindow.document.write(content)
    printWindow.document.close()

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print()
      // Close the window after printing (optional)
      printWindow.onafterprint = () => printWindow.close()
    }
  }

  if (loading && lists.length === 0) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin h-8 w-8 mx-auto border-4 border-primary-500 border-t-transparent rounded-full"></div>
        <p className="mt-2 text-gray-600">Loading shopping lists...</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Add to Shopping List</h2>

      {/* Create new list form */}
      <form onSubmit={createList} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New list name"
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={loading || !newListName.trim()}
            className="btn-primary"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Lists */}
      <div className="space-y-4">
        {lists.map(list => (
          <div
            key={list.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{list.name}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => printList(list)}
                  className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
                  title="Print list"
                >
                  <DocumentArrowDownIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => deleteList(list.id)}
                  className="p-2 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50"
                  title="Delete list"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* List items */}
            <div className="space-y-2">
              {list.shopping_list_items?.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <button
                    onClick={() => toggleItem(item.id, item.checked)}
                    className={`flex-shrink-0 w-5 h-5 rounded border ${
                      item.checked
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300'
                    }`}
                  >
                    {item.checked && <CheckIcon className="h-4 w-4" />}
                  </button>
                  <span className={item.checked ? 'line-through text-gray-500' : ''}>
                    {item.ingredient}
                    {item.recipes?.title && (
                      <span className="text-gray-500 text-xs ml-1">
                        (from {item.recipes.title})
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>

            {/* Add to list button */}
            {recipeId && (
              <button
                onClick={() => addToList(list.id)}
                className="mt-4 w-full btn-secondary text-sm"
              >
                Add ingredients to this list
              </button>
            )}
          </div>
        ))}
      </div>

      {lists.length === 0 && (
        <p className="text-center text-gray-500">
          No shopping lists yet. Create one to get started!
        </p>
      )}
    </div>
  )
}

export default ShoppingList 