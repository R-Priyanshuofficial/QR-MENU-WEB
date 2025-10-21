// Mock data for testing without backend

export const mockRestaurant = {
  name: 'Delicious Bites',
  description: 'Authentic cuisine with a modern twist',
  openingHours: 'Open: 10:00 AM - 10:00 PM',
}

export const mockMenuItems = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh mozzarella, tomatoes, and basil',
    price: 299,
    category: 'main course',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    tags: ['vegetarian', 'popular'],
    badge: { text: 'Popular', variant: 'success' },
  },
  {
    id: '2',
    name: 'Chicken Wings',
    description: 'Crispy wings with your choice of sauce',
    price: 249,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400',
    tags: ['spicy'],
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan and croutons',
    price: 199,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    tags: ['vegetarian', 'healthy'],
  },
  {
    id: '4',
    name: 'Butter Chicken',
    description: 'Tender chicken in creamy tomato sauce',
    price: 349,
    category: 'main course',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
    tags: ['popular'],
    badge: { text: 'Chef Special', variant: 'primary' },
  },
  {
    id: '5',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center',
    price: 149,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
    tags: ['sweet'],
  },
  {
    id: '6',
    name: 'Fresh Lemonade',
    description: 'Freshly squeezed lemon juice with mint',
    price: 79,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9f?w=400',
    tags: ['refreshing'],
  },
]

export const mockOrders = [
  {
    id: 'ORD001',
    customerName: 'John Doe',
    customerPhone: '+91 98765 43210',
    tableNumber: 5,
    items: [
      { name: 'Margherita Pizza', quantity: 2, price: 299 },
      { name: 'Fresh Lemonade', quantity: 2, price: 79 },
    ],
    totalAmount: 756,
    status: 'pending',
    createdAt: new Date(Date.now() - 5 * 60000),
  },
  {
    id: 'ORD002',
    customerName: 'Jane Smith',
    customerPhone: '+91 98765 43211',
    tableNumber: 3,
    items: [
      { name: 'Butter Chicken', quantity: 1, price: 349 },
      { name: 'Caesar Salad', quantity: 1, price: 199 },
    ],
    totalAmount: 548,
    status: 'ready',
    createdAt: new Date(Date.now() - 15 * 60000),
  },
]

export const mockQRCodes = [
  {
    id: 'qr1',
    tableNumber: null,
    url: 'http://localhost:3000/m/delicious-bites/q/global-token',
  },
  {
    id: 'qr2',
    tableNumber: 1,
    url: 'http://localhost:3000/m/delicious-bites/q/table1-token',
  },
  {
    id: 'qr3',
    tableNumber: 2,
    url: 'http://localhost:3000/m/delicious-bites/q/table2-token',
  },
]

export const mockStats = {
  todayOrders: 42,
  todayRevenue: 12450,
  activeQRCodes: 8,
  totalCustomers: 156,
}
