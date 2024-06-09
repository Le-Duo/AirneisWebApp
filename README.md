## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)

## Features

### User Features
- **Product Browsing**: View products by categories, search for products, and view product details.
- **Shopping Cart**: Add products to the cart, update quantities, and proceed to checkout.
- **User Authentication**: Sign up, sign in, and password reset functionalities.
- **Order Management**: Place orders, view order history, and track order status.
- **Profile Management**: Manage user profile, addresses, and payment methods.

### Admin Features
- **Dashboard**: View sales data and other key metrics.
- **Product Management**: Add, edit, and delete products.
- **Category Management**: Add, edit, and delete categories.
- **Order Management**: View and update order statuses.
- **User Management**: Manage user accounts and roles.
- **Carousel Management**: Manage homepage carousel items.
- **Featured Products**: Manage featured products on the homepage.

## Installation

1. **Install Node > LTS Version** (https://nodejs.org/en/download)

2. **Clone the repository**:
    ```sh
    git clone https://github.com/Le-Duo/AirneisWebApp.git
    cd AirneisWebApp
    ```

3. **Install dependencies**:
    ```sh
    npm install
    ```

4. **Set up environment variables**:
    Create a `.env` file in the root directory and add the following:
    ```sh
    VITE_API_BASE_URL=<your-api-url>
    ```

5. **Run the application**:
    ```npm run dev``` or ```npm install -g vite && tsc && vite build && vite preview --host 0.0.0.0 --port 8080```

## Usage

- **Development**: 
    ```sh
    npm run dev
    ```
- **Build for production**:
    ```sh
    npm run build
    ```
- **Preview production build**:
    ```sh
    npm run preview
    ```
