# QR Menu App - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Project Structure

```
src/
├── admin/              # Admin dashboard
│   ├── pages/         # Dashboard, Orders, Menu Editor, QR Generator
│   ├── components/    # OrderCard, QRTableList, AdminSidebar
│   └── layout/        # AdminLayout
├── customer/          # Customer-facing pages
│   ├── pages/         # Welcome, MenuPage, Cart, OrderStatus
│   ├── components/    # ItemCard, CartDrawer, TableBadge
│   └── layout/        # CustomerLayout
└── shared/            # Shared utilities
    ├── components/    # Button, Modal, Input, Card, etc.
    ├── contexts/      # AuthContext, CartContext
    ├── hooks/         # useWebSocket, useLocalStorage
    ├── api/           # API endpoints and axios config
    └── utils/         # Formatters, validators, helpers
```

## Features Implemented

### Customer Flow
- ✅ Welcome screen with restaurant info
- ✅ Browse menu by categories
- ✅ Search menu items
- ✅ Add items to cart with quantity controls
- ✅ Checkout with customer details
- ✅ Real-time order status tracking
- ✅ Notifications when order is ready

### Admin Flow
- ✅ Login/Register system
- ✅ Dashboard with stats
- ✅ Real-time orders management
- ✅ Menu editor (Add/Edit/Delete items)
- ✅ QR code generator (Global & Table-specific)
- ✅ Order status updates with customer notifications
- ✅ Analytics and order history

### Technical Features
- ✅ React Router v6 for routing
- ✅ TailwindCSS for styling
- ✅ Framer Motion animations
- ✅ WebSocket support for real-time updates
- ✅ Context API for state management
- ✅ Responsive design (mobile-first)
- ✅ Toast notifications
- ✅ Form validation
- ✅ Error handling

## Routes

### Customer Routes (Public)
- `/m/:menuSlug/q/:token` - Welcome page
- `/m/:menuSlug/q/:token/menu` - Menu browsing
- `/m/:menuSlug/q/:token/cart` - Checkout
- `/m/:menuSlug/q/:token/order/:orderId` - Order status

### Admin Routes (Protected)
- `/owner/login` - Login/Register
- `/owner/dashboard` - Dashboard
- `/owner/orders` - Orders management
- `/owner/menu` - Menu editor
- `/owner/qr` - QR code generator
- `/owner/analytics` - Analytics

## Development Notes

### Testing Without Backend
The app is configured to work with mock data for testing UI/UX without a backend:
- Check `src/shared/utils/mockData.js` for sample data
- API calls are set up in `src/shared/api/endpoints.js`

### Real-time Features
WebSocket connection is configured in:
- Customer order status page (receives order ready notifications)
- Admin orders page (receives new order notifications)

Set `VITE_WS_URL` in `.env` to your WebSocket server URL.

### Customization

#### Colors
Edit `tailwind.config.js` to change primary/secondary colors:
```js
colors: {
  primary: { ... },
  secondary: { ... }
}
```

#### Animations
All animations use Framer Motion. Adjust in individual components.

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## Troubleshooting

### Port Already in Use
If port 3000 is busy, edit `vite.config.js`:
```js
server: {
  port: 3001, // Change port
}
```

### Module Not Found
Make sure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Path Aliases Not Working
The project uses path aliases (@shared, @admin, @customer).
They're configured in `vite.config.js`.

## Next Steps

1. **Connect to Backend**: Update API URLs in `.env`
2. **Add Authentication**: Complete auth flow with JWT tokens
3. **Add Payment Gateway**: Integrate for online payments
4. **Add Image Upload**: For menu item images
5. **Add Analytics**: Track user behavior
6. **PWA Support**: Add service worker for offline access

## Support

For issues or questions, check the README.md or create an issue in the repository.
