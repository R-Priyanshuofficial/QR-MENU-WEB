import { MapPin } from 'lucide-react'
import { Badge } from '@shared/components/Badge'

export const TableBadge = ({ tableNumber }) => {
  if (!tableNumber) return null

  return (
    <Badge variant="info" className="text-sm px-3 py-1">
      <MapPin className="w-4 h-4 mr-1" />
      Table {tableNumber}
    </Badge>
  )
}
