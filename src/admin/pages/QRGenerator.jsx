import { useState, useEffect } from 'react'
import { Plus, QrCode as QrIcon } from 'lucide-react'
import { Button } from '@shared/components/Button'
import { Input } from '@shared/components/Input'
import { Modal, ConfirmModal } from '@shared/components/Modal'
import { QRTableList } from '../components/QRTableList'
import { PageLoader } from '@shared/components/Spinner'
import { qrAPI } from '@shared/api/endpoints'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export const QRGenerator = () => {
  const [loading, setLoading] = useState(true)
  const [qrCodes, setQrCodes] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('global')
  const [tableNumber, setTableNumber] = useState('')
  const [generating, setGenerating] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, qrId: null })

  useEffect(() => {
    fetchQRCodes()
  }, [])

  const fetchQRCodes = async () => {
    try {
      const response = await qrAPI.getAll()
      setQrCodes(response.data.qrCodes || [])
    } catch (error) {
      console.error('QR API error:', error)
      toast.error('Failed to load QR codes')
      setQrCodes([])
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateGlobal = async () => {
    setGenerating(true)
    try {
      const response = await qrAPI.generate({
        name: 'Global Menu QR',
        type: 'global'
      })
      toast.success('Global QR code generated!')
      fetchQRCodes()
      setShowModal(false)
    } catch (error) {
      console.error('Generate QR error:', error)
      toast.error(error.response?.data?.message || 'Failed to generate QR code')
    } finally {
      setGenerating(false)
    }
  }

  const handleGenerateTable = async () => {
    if (!tableNumber) {
      toast.error('Please enter a table number')
      return
    }

    setGenerating(true)
    try {
      const response = await qrAPI.generate({
        name: `Table ${tableNumber} QR`,
        type: 'table',
        tableNumber: tableNumber
      })
      toast.success(`QR code for Table ${tableNumber} generated!`)
      setTableNumber('')
      fetchQRCodes()
      setShowModal(false)
    } catch (error) {
      console.error('Generate QR error:', error)
      toast.error(error.response?.data?.message || 'Failed to generate QR code')
    } finally {
      setGenerating(false)
    }
  }

  const handleDelete = (qrId) => {
    setDeleteModal({ isOpen: true, qrId })
  }

  const confirmDelete = async () => {
    try {
      await qrAPI.delete(deleteModal.qrId)
      toast.success('QR code deleted')
      fetchQRCodes()
    } catch (error) {
      console.error('Delete QR error:', error)
      toast.error(error.response?.data?.message || 'Failed to delete QR code')
    } finally {
      setDeleteModal({ isOpen: false, qrId: null })
    }
  }

  const openModal = (type) => {
    setModalType(type)
    setShowModal(true)
  }

  if (loading) return <PageLoader message="Loading QR codes..." />

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">QR Code Generator</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Create and manage QR codes for your restaurant</p>
        </div>
      </motion.div>

      {/* Generate Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-4"
      >
        <Button
          leftIcon={<Plus className="w-5 h-5" />}
          onClick={() => openModal('global')}
        >
          Generate Global QR
        </Button>
        <Button
          variant="outline"
          leftIcon={<Plus className="w-5 h-5" />}
          onClick={() => openModal('table')}
        >
          Generate Table QR
        </Button>
      </motion.div>

      {/* QR Codes List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {qrCodes.length > 0 ? (
          <QRTableList qrCodes={qrCodes} onDelete={handleDelete} />
        ) : (
          <div className="text-center py-12">
            <QrIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg mb-2">No QR codes yet</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm mb-6">
              Generate your first QR code to get started
            </p>
            <Button onClick={() => openModal('global')}>
              Generate QR Code
            </Button>
          </div>
        )}
      </motion.div>

      {/* Generation Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalType === 'global' ? 'Generate Global QR Code' : 'Generate Table QR Code'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={modalType === 'global' ? handleGenerateGlobal : handleGenerateTable}
              loading={generating}
            >
              Generate
            </Button>
          </>
        }
      >
        {modalType === 'global' ? (
          <div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              A global QR code can be scanned by customers at any table. The menu will be displayed
              without a specific table number.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 <strong>Tip:</strong> Use global QR codes for takeaway menus or general display.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Generate a QR code for a specific table. When scanned, the table number will be
              displayed and included in orders.
            </p>
            <Input
              label="Table Number"
              type="number"
              placeholder="Enter table number"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              required
            />
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, qrId: null })}
        onConfirm={confirmDelete}
        title="Delete QR Code?"
        message="This QR code will no longer work. Customers won't be able to access your menu using this code."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}
