import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save } from 'lucide-react'
import { Button } from '@shared/components/Button'
import { Input, TextArea } from '@shared/components/Input'
import { Card } from '@shared/components/Card'
import { Modal, ConfirmModal } from '@shared/components/Modal'
import { PageLoader } from '@shared/components/Spinner'
import { formatCurrency } from '@shared/utils/formatters'
import { menuAPI } from '@shared/api/endpoints'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export const MenuEditor = () => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, itemId: null })
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', image: '' })

  useEffect(() => {
    fetchMenu()
  }, [])

  const fetchMenu = async () => {
    try {
      const response = await menuAPI.getOwnerMenu()
      setItems(response.data.items)
    } catch (error) {
      toast.error('Failed to load menu')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      if (editingItem) {
        await menuAPI.updateItem(editingItem.id, formData)
        toast.success('Item updated!')
      } else {
        await menuAPI.addItem(formData)
        toast.success('Item added!')
      }
      fetchMenu()
      closeModal()
    } catch (error) {
      toast.error('Failed to save item')
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingItem(null)
    setFormData({ name: '', description: '', price: '', category: '', image: '' })
  }

  const confirmDelete = async () => {
    try {
      await menuAPI.deleteItem(deleteModal.itemId)
      toast.success('Item deleted')
      fetchMenu()
    } catch (error) {
      toast.error('Failed to delete')
    } finally {
      setDeleteModal({ isOpen: false, itemId: null })
    }
  }

  if (loading) return <PageLoader message="Loading menu..." />

  const categories = [...new Set(items.map(i => i.category))]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Menu Editor</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage your menu items</p>
        </div>
        <Button leftIcon={<Plus className="w-5 h-5" />} onClick={() => setShowModal(true)}>Add Item</Button>
      </div>

      {categories.map((category) => (
        <div key={category}>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 capitalize">{category}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.filter(i => i.category === category).map((item) => (
              <Card key={item.id} hover>
                <div className="p-4">
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-lg mb-3" />}
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">{item.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                  <p className="text-lg font-bold text-primary-600 mb-3">{formatCurrency(item.price)}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => { setEditingItem(item); setFormData(item); setShowModal(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setDeleteModal({ isOpen: true, itemId: item.id })}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <Modal isOpen={showModal} onClose={closeModal} title={editingItem ? 'Edit Item' : 'Add Item'}
        footer={<><Button variant="ghost" onClick={closeModal}>Cancel</Button><Button onClick={handleSubmit}>Save</Button></>}>
        <div className="space-y-4">
          <Input label="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
          <TextArea label="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} />
          <Input label="Price" type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
          <Input label="Category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} required />
          <Input label="Image URL" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
        </div>
      </Modal>

      <ConfirmModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, itemId: null })}
        onConfirm={confirmDelete} title="Delete Item?" message="This item will be removed from your menu." confirmText="Delete" variant="danger" />
    </div>
  )
}
