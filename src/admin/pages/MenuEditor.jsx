import { useState, useEffect, useRef } from 'react'
import { Plus, Edit, Trash2, Upload, FileImage, FileText, Check, X, Camera } from 'lucide-react'
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
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, itemId: null })
  const [deleteAllModal, setDeleteAllModal] = useState(false)
  const [deletingAll, setDeletingAll] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', image: '' })
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [extractedItems, setExtractedItems] = useState([])
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [savingItems, setSavingItems] = useState(false)
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  useEffect(() => {
    fetchMenu()
  }, [])

  const fetchMenu = async () => {
    try {
      const response = await menuAPI.getOwnerMenu()
      console.log('Menu response:', response.data)
      const items = response.data.items || []
      // Log currency values for debugging
      items.forEach((item, i) => {
        console.log(`Item ${i + 1}: ${item.name} - Currency: ${item.currency || 'NOT SET'}`);
      });
      setItems(items)
    } catch (error) {
      console.error('Menu fetch error:', error)
      toast.error(error.response?.data?.message || 'Failed to load menu')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!uploadedFile) {
      toast.error('Please select a file')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('menuFile', uploadedFile)
      
      const response = await menuAPI.uploadMenu(formData)
      const items = response.data?.items || []
      
      if (items.length > 0) {
        setExtractedItems(items)
        setShowUploadModal(false)
        setShowReviewModal(true)
        toast.success(`Extracted ${items.length} items. Please review and save.`)
      } else {
        toast.error('No items found. Try a clearer image or add items manually.')
      }
      
      setUploadedFile(null)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'Failed to process menu file')
    } finally {
      setUploading(false)
    }
  }

  const handleSaveExtractedItems = async () => {
    if (extractedItems.length === 0) {
      toast.error('No items to save')
      return
    }

    setSavingItems(true)
    try {
      // Save items one by one
      let savedCount = 0
      for (const item of extractedItems) {
        await menuAPI.addItem(item)
        savedCount++
      }
      
      toast.success(`Saved ${savedCount} menu items!`)
      setShowReviewModal(false)
      setExtractedItems([])
      fetchMenu()
    } catch (error) {
      console.error('Save error:', error)
      toast.error(error.response?.data?.message || 'Failed to save items')
    } finally {
      setSavingItems(false)
    }
  }

  const handleUpdateExtractedItem = (index, field, value) => {
    const updated = [...extractedItems]
    updated[index] = { ...updated[index], [field]: value }
    setExtractedItems(updated)
  }

  const handleRemoveExtractedItem = (index) => {
    setExtractedItems(extractedItems.filter((_, i) => i !== index))
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
      toast.error(error.response?.data?.message || 'Failed to save item')
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

  const confirmDeleteAll = async () => {
    setDeletingAll(true)
    try {
      const response = await menuAPI.deleteAllItems()
      const deletedCount = response.data?.deletedCount || items.length
      
      if (deletedCount === 0) {
        toast.error('No items to delete')
      } else {
        toast.success(`Successfully deleted ${deletedCount} menu items`)
        setItems([])
      }
    } catch (error) {
      console.error('Delete all error:', error)
      toast.error(error.response?.data?.message || 'Failed to delete all items. Please try again.')
    } finally {
      setDeletingAll(false)
      setDeleteAllModal(false)
    }
  }

  if (loading) return <PageLoader message="Loading menu..." />

  const categories = [...new Set(items.map(i => i.category))]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Menu Editor</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Manage your menu items</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {items.length > 0 && (
            <Button 
              variant="danger" 
              onClick={() => setDeleteAllModal(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete All
            </Button>
          )}
          <Button 
            variant="outline" 
            leftIcon={<Upload className="w-5 h-5" />} 
            onClick={() => setShowUploadModal(true)}
          >
            Upload Menu
          </Button>
          <Button 
            leftIcon={<Plus className="w-5 h-5" />} 
            onClick={() => setShowModal(true)}
          >
            Add Item
          </Button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No menu items yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by uploading a menu or adding items manually</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => setShowUploadModal(true)}>
              <Upload className="w-4 h-4 mr-2" /> Upload Menu
            </Button>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4 mr-2" /> Add First Item
            </Button>
          </div>
        </div>
      ) : (
        categories.map((category) => (
          <div key={category}>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 capitalize">{category}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.filter(i => i.category === category).map((item) => (
                <Card key={item.id} hover>
                  <div className="p-4">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-lg mb-3" />}
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">{item.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                    <p className="text-lg font-bold text-primary-600 dark:text-primary-400 mb-3">{formatCurrency(item.price, item.currency)}</p>
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
        ))
      )}

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

      {/* Delete All Confirmation Modal */}
      <ConfirmModal 
        isOpen={deleteAllModal} 
        onClose={() => setDeleteAllModal(false)}
        onConfirm={confirmDeleteAll}
        title="⚠️ Delete ALL Menu Items?"
        message={
          <div className="space-y-3">
            <p className="font-semibold text-red-600 dark:text-red-400">
              This will permanently delete all {items.length} menu items!
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This action cannot be undone. All your menu items, including their prices, descriptions, and categories will be permanently removed.
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Are you absolutely sure you want to continue?
            </p>
          </div>
        }
        confirmText={deletingAll ? "Deleting..." : "Yes, Delete All"}
        variant="danger"
        loading={deletingAll}
      />

      {/* Upload Menu Modal */}
      <Modal 
        isOpen={showUploadModal} 
        onClose={() => { setShowUploadModal(false); setUploadedFile(null); }} 
        title="Upload Menu (AI Vision)"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setShowUploadModal(false); setUploadedFile(null); }}>Cancel</Button>
            <Button onClick={handleUpload} loading={uploading} disabled={!uploadedFile}>
              {uploading ? 'Processing...' : 'Upload & Extract'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              🤖 <strong>AI-Powered Menu Extraction:</strong><br />
              Upload a photo or PDF of your menu. Our AI Vision will analyze the image directly and extract item names, prices, descriptions, and categories with 95%+ accuracy!
            </p>
          </div>

          {/* Hidden file inputs */}
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,.tiff,.tif,.heic,.heif,.pdf,image/*,application/pdf" 
            onChange={handleFileSelect}
            className="hidden"
          />
          <input 
            ref={cameraInputRef}
            type="file" 
            accept="image/*" 
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />

          {uploadedFile ? (
            <div className="border-2 border-dashed border-primary-300 dark:border-primary-600 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center gap-3">
                {uploadedFile.type.includes('pdf') ? (
                  <FileText className="w-16 h-16 text-primary-600 dark:text-primary-400" />
                ) : (
                  <FileImage className="w-16 h-16 text-primary-600 dark:text-primary-400" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setUploadedFile(null)}
                >
                  <X className="w-4 h-4 mr-2" /> Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Gallery Upload */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all"
              >
                <Upload className="w-10 h-10 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                <p className="text-gray-900 dark:text-gray-100 font-semibold mb-1">Upload from Gallery</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Choose image or PDF
                </p>
              </div>

              {/* Camera Capture */}
              <div 
                onClick={() => cameraInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all"
              >
                <Camera className="w-10 h-10 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                <p className="text-gray-900 dark:text-gray-100 font-semibold mb-1">Take Photo</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Use camera directly
                </p>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            Supports: JPEG, PNG, WEBP, GIF, BMP, TIFF, HEIC, PDF (Max 10MB)
          </p>

          <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              💡 <strong>Tip:</strong> For best results, use clear, well-lit photos. AI Vision works great even with fancy fonts and complex layouts. Review extracted items before saving.
            </p>
          </div>
        </div>
      </Modal>

      {/* Review Extracted Items Modal */}
      <Modal 
        isOpen={showReviewModal}
        onClose={() => { setShowReviewModal(false); setExtractedItems([]); }}
        title={`Review Extracted Items (${extractedItems.length})`}
        size="xl"
        footer={
          <>
            <Button variant="ghost" onClick={() => { setShowReviewModal(false); setExtractedItems([]); }}>Cancel</Button>
            <Button onClick={handleSaveExtractedItems} loading={savingItems}>
              Save All Items
            </Button>
          </>
        }
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              ✏️ Review and edit the extracted items below. You can modify names, prices, descriptions, and categories before saving.
            </p>
          </div>

          {extractedItems.map((item, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Item {index + 1}</h4>
                <button
                  onClick={() => handleRemoveExtractedItem(index)}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                  title="Remove this item"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  label="Name"
                  value={item.name}
                  onChange={(e) => handleUpdateExtractedItem(index, 'name', e.target.value)}
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Price"
                    type="number"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => handleUpdateExtractedItem(index, 'price', parseFloat(e.target.value) || 0)}
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Currency
                    </label>
                    <select
                      value={item.currency || 'INR'}
                      onChange={(e) => handleUpdateExtractedItem(index, 'currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="INR">₹ INR</option>
                      <option value="USD">$ USD</option>
                      <option value="EUR">€ EUR</option>
                      <option value="GBP">£ GBP</option>
                      <option value="AED">د.إ AED</option>
                      <option value="SAR">﷼ SAR</option>
                      <option value="JPY">¥ JPY</option>
                      <option value="CNY">¥ CNY</option>
                      <option value="AUD">$ AUD</option>
                      <option value="CAD">$ CAD</option>
                    </select>
                  </div>
                </div>
                <Input
                  label="Category"
                  value={item.category}
                  onChange={(e) => handleUpdateExtractedItem(index, 'category', e.target.value)}
                  required
                />
                <Input
                  label="Image URL (optional)"
                  value={item.image || ''}
                  onChange={(e) => handleUpdateExtractedItem(index, 'image', e.target.value)}
                />
              </div>
              
              <div className="mt-3">
                <TextArea
                  label="Description (optional)"
                  value={item.description || ''}
                  onChange={(e) => handleUpdateExtractedItem(index, 'description', e.target.value)}
                  rows={2}
                />
              </div>
            </Card>
          ))}

          {extractedItems.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No items to review
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
