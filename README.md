# GreenBasket - Sustainable E-commerce Platform

GreenBasket is an eco-friendly e-commerce platform that helps users shop sustainably while tracking their environmental impact. Our mission is to make sustainable shopping accessible, transparent, and rewarding through carbon footprint tracking and eco-conscious products.


## 🌱 Core Features

| Feature | Description | Implementation |
|---------|-------------|----------------|
| **Product Listing** | Display only recycled or upcycled products with carbon footprints | Browse sustainable products categorized by type with detailed carbon impact information |
| **Cart System** | Add, remove and manage eco-friendly products | Real-time cart updates with carbon footprint calculations |
| **Payment Gateway** | Secure checkout using Razorpay | Integrated payment system with order confirmation |
| **Order Carbon Summary** | Calculate environmental impact of orders | Detailed breakdown of carbon savings compared to conventional alternatives |
| **Global Footprint Tracker** | Track user's carbon footprint based on purchases | Visualizations and stats in user profile |
| **User Login System** | Authentication and session management | Secure account creation and management |
| **Mobile Responsive Design** | Optimized for all screen sizes | Fully responsive experience on desktop and mobile |

## 🚀 Bonus Features

| Feature | Description | Implementation |
|---------|-------------|----------------|
| **Green Leaderboard** | Rank users based on eco-friendly activity | Competitive sustainability tracking to encourage green shopping |
| **Admin Dashboard** | Manage products, categories, and sustainability data | Comprehensive admin controls with analytics |
| **Live Carbon Data API** | Real-time carbon emission data using external APIs | Integration with Carbon Intensity and National Grid ESO APIs |

## 📱 Page Navigation

### Customer-Facing Pages

1. **Home Page** (`/`)
   - Main landing page with featured products, categories, and sustainability highlights
   - Quick access to all main sections of the site

2. **Products Page** (`/products`)
   - Browse all sustainable products with filtering options
   - View product carbon footprints and environmental impact

3. **Product Detail Page** (`/products/[id]`)
   - Detailed product information, images, price, and sustainability metrics
   - Compare environmental impact with conventional alternatives

4. **Cart Page** (`/cart`)
   - Review items, quantities, and price
   - View real-time carbon footprint impact of your cart
   - Apply eco-rewards or sustainability discounts

5. **Checkout Page** (`/checkout`)
   - Secure payment processing through Razorpay
   - Order summary with environmental impact visualization

6. **Profile Page** (`/profile`)
   - User dashboard with order history
   - Carbon footprint tracking and visualizations
   - Personal sustainability metrics and achievements

7. **Leaderboard Page** (`/leaderboard`)
   - Community rankings by carbon footprint and eco-purchases
   - Visualizations showing top performers and trends over time

8. **About Page** (`/about`)
   - Information about GreenBasket's mission and values
   - Company history and sustainability commitments

9. **Carbon API Demo** (`/carbon-api`)
   - Live demonstration of the carbon intensity API integration
   - Real-time data on grid carbon intensity and renewable energy mix

### Admin Pages

1. **Admin Dashboard** (`/admin`)
   - Overview of store performance, sales, and sustainability metrics
   - Quick access to all admin functionality

2. **Product Management** (`/admin/products`)
   - Add, edit, and remove products
   - Update sustainability information and carbon data

3. **Order Management** (`/admin/orders`)
   - View and process customer orders
   - Track carbon savings across all purchases

4. **User Management** (`/admin/users`)
   - View and manage user accounts
   - Track sustainability leaders

## 💳 Payment Testing

To test the payment gateway in development or staging environments, use the following Razorpay test credentials:

### Test Cards
- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., 12/25)
- **CVV**: Any 3-digit number (e.g., 123)
- **Name**: Any name


## 👤 Admin Access

To access the admin dashboard, use the following credentials:

- **Email**: `admin@greenbasket.com`
- **Password**: `Admin@123`

## 📊 Carbon API Integration

GreenBasket integrates with real-time carbon data sources to provide accurate sustainability metrics:

1. **Product-specific Carbon Footprint** (`/api/carbon/[id]`)
   - Calculates the carbon footprint of specific products
   - Compares with conventional alternatives to show savings

2. **Live Carbon Intensity** (`/api/carbon/live`)
   - Provides real-time grid carbon intensity data
   - Shows renewable energy mix and regional variations
   - Updates carbon calculations based on real-time data

The API will work properly in hosted environments as it includes proper error handling and fallbacks to mock data when external APIs are unavailable.

## 🧪 Environment Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/greenbasket.git
cd greenbasket
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file with the following variables:
```
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
DATABASE_URL=your_database_connection_string
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

## 🚀 Deployment

The application can be deployed using Vercel or any other Next.js-compatible hosting service.

```bash
npm run build
npm run start
```

## 🛠️ Technologies Used

- **Frontend**: Next.js, React, TailwindCSS, shadcn/ui
- **State Management**: React Context API
- **Visualization**: Recharts
- **Authentication**: NextAuth.js
- **Payment Processing**: Stripe
- **API Integration**: Carbon Intensity API, National Grid ESO API
- **Styling**: TailwindCSS with CSS variables for theming

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
