# ShriMart E-commerce Platform

A full-stack e-commerce application built with React and Node.js. This platform includes user authentication, product management, shopping cart, order processing, and an admin dashboard.

## Features

### User Features
- **User Authentication**: Register, login, and profile management
- **Product Browsing**: Browse products with filters, search, and categories
- **Shopping Cart**: Add, update, and remove items from cart
- **Order Management**: Place orders, view order history, and track order status
- **Product Reviews**: View and submit product reviews
- **User Profile**: Manage personal information and address

### Admin Features
- **Product Management**: Create, update, and delete products
- **Order Management**: View and update order statuses
- **Dashboard**: Monitor all orders and products

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Multer** for file uploads
- **bcryptjs** for password hashing

### Frontend
- **React** 18
- **React Router** for navigation
- **Axios** for API calls
- **React Toastify** for notifications
- **CSS3** for styling

## Project Structure

```
testingproai/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── cart.js
│   │   ├── orders.js
│   │   └── users.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/
│   │   └── products/
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shrimart
JWT_SECRET=your_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

5. Create the uploads directory:
```bash
mkdir uploads
mkdir uploads/products
```

6. Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Creating an Admin User

To create an admin user, you can use MongoDB shell or a MongoDB client:

1. Connect to your MongoDB database
2. Find the users collection and update a user's role:
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

Or register a new user and then update their role in the database.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)
- `POST /api/products/:id/reviews` - Add review
- `GET /api/products/categories/list` - Get all categories

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item quantity
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get single order
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `PUT /api/orders/:id/cancel` - Cancel order

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password

## Usage

1. **Register/Login**: Create an account or login to access the platform
2. **Browse Products**: Navigate through products, use filters, and search
3. **Add to Cart**: Add products to your shopping cart
4. **Checkout**: Provide shipping address and place order
5. **Track Orders**: View order history and status in the Orders page
6. **Admin Panel**: Access admin dashboard at `/admin` (admin users only)

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

### Frontend (.env)
- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000/api)

## Database Schema

### User
- name, email, password, phone, address, role, createdAt

### Product
- name, description, price, originalPrice, category, images, stock, seller, rating, reviews, isActive, createdAt

### Cart
- user, items (product, quantity), updatedAt

### Order
- user, items (product, quantity, price), totalAmount, shippingAddress, paymentMethod, paymentStatus, orderStatus, orderDate, deliveredDate

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected routes (admin and user)
- Input validation and sanitization
- CORS configuration

## Future Enhancements

- Payment gateway integration (Razorpay, Stripe)
- Email notifications
- Product image optimization
- Advanced search and filters
- Wishlist functionality
- Coupon/Discount system
- Analytics dashboard
- Mobile responsive improvements

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check the connection string in `.env`
- Verify MongoDB port (default: 27017)

### Port Already in Use
- Change the PORT in `.env` file
- Or stop the process using the port

### Image Upload Issues
- Ensure `uploads/products` directory exists
- Check file permissions
- Verify multer configuration

## License

This project is open source and available for educational purposes.

## Support

For issues or questions, please create an issue in the repository.

