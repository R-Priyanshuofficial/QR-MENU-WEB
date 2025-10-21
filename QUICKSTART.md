# 🚀 Quick Start Guide

## Demo Credentials (Works Without Backend!)

### Admin Login
- **Email**: `demo@example.com`
- **Password**: `password123`

### Features:
- ✅ **Password visibility toggle** - Click the eye icon to show/hide password
- ✅ **Mock authentication** - Works without any backend server
- ✅ **Auto-register** - Create any account in demo mode

## Start the App

```bash
npm run dev
```

The app will open at **http://localhost:3000**

## Features Added ✨

### 🌙 Dark Mode
- Toggle button in admin dashboard header (top right)
- Automatically saves your preference
- Works across all admin pages

### 📱 Mobile Responsive
- **Mobile-first design** - optimized for phones
- All components adapt perfectly to any screen size
- Touch-friendly buttons and controls
- Responsive typography and spacing
- Hamburger menu on mobile for admin sidebar

## Routes

### Customer (Public)
- `/m/:menuSlug/q/:token` - Welcome page
- `/m/:menuSlug/q/:token/menu` - Browse menu
- `/m/:menuSlug/q/:token/cart` - Checkout
- `/m/:menuSlug/q/:token/order/:orderId` - Order status

### Admin (Protected)
- `/owner/login` - Login/Register
- `/owner/dashboard` - Dashboard
- `/owner/orders` - Orders management
- `/owner/menu` - Menu editor
- `/owner/qr` - QR code generator

## Mobile Testing

### Test on Phone
1. Start the dev server
2. Find your computer's IP address
3. Open `http://YOUR_IP:3000` on your phone

### Test Responsive Design
In Chrome DevTools:
1. Press F12
2. Click device toggle icon (Ctrl+Shift+M)
3. Select mobile device from dropdown

## Dark Mode

The dark mode toggle is located in the **admin dashboard header** (top right corner, moon/sun icon).

### Features:
- Instant theme switching
- Persists across page refreshes
- Smooth transitions
- Works on all admin pages
- Optimized colors for both modes

## Notes

- The CSS lint warnings about `@tailwind` and `@apply` are **normal** - they're Tailwind directives that work perfectly when the app runs
- Mock data is available in `src/shared/utils/mockData.js` for testing without a backend
- All components are fully typed and documented

## Need Help?

Check these files:
- **SETUP.md** - Detailed setup instructions
- **PROJECT_OVERVIEW.md** - Complete feature list
- **README.md** - Project overview

---

**Enjoy your QR Menu App!** 🎉
