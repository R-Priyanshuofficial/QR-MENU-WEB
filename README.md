# QR Menu Web App

A modern, real-time digital menu system for restaurants with QR code ordering.

## Features

### Customer Flow
- Scan QR code to view restaurant menu
- Browse categorized menu items
- Add items to cart and place orders
- Track order status in real-time
- Receive notifications when order is ready

### Owner (Admin) Flow
- Restaurant profile management
- Menu upload via image/PDF with OCR
- Menu editor with categories
- Generate QR codes (global or table-specific)
- Real-time orders dashboard
- Order management with notifications
- Analytics and order history

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Routing
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Zustand** - State management
- **React Hot Toast** - Notifications
- **QRCode.react** - QR code generation

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── admin/          # Admin dashboard
├── customer/       # Customer-facing pages
├── shared/         # Shared components, hooks, utils
└── App.jsx         # Main app component
```

## Routes

- **Customer**: `/m/:menuSlug/q/:token`
- **Admin**: `/owner/*`

## Environment Variables

Create a `.env` file in the root:

```env
VITE_API_URL=your_api_url
VITE_WS_URL=your_websocket_url
```

## License

MIT
