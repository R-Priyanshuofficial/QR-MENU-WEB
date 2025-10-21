import { QrCode, Download, Trash2 } from 'lucide-react'
import { Card } from '@shared/components/Card'
import { Button } from '@shared/components/Button'
import { Badge } from '@shared/components/Badge'
import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'

export const QRTableList = ({ qrCodes, onDelete }) => {
  const downloadQR = (code) => {
    const svg = document.getElementById(`qr-${code.id}`)
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL('image/png')
      
      const downloadLink = document.createElement('a')
      downloadLink.download = `qr-${code.tableNumber || 'global'}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {qrCodes.map((code, index) => (
        <motion.div
          key={code.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="text-center">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                {code.tableNumber ? (
                  <Badge variant="info">Table {code.tableNumber}</Badge>
                ) : (
                  <Badge variant="primary">Global QR</Badge>
                )}
                <button
                  onClick={() => onDelete(code.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-center mb-4">
                <div className="p-4 bg-white border-2 border-gray-200 rounded-lg">
                  <QRCodeSVG
                    id={`qr-${code.id}`}
                    value={code.url}
                    size={150}
                    level="H"
                    includeMargin
                  />
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="w-full"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={() => downloadQR(code)}
              >
                Download
              </Button>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
