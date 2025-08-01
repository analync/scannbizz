# ScannBizz POS System Documentation

## 1. Introduction

ScannBizz is a modern Point of Sale (POS) system designed for small to medium-sized businesses. It provides a simple and efficient way to manage inventory, track sales, and gain insights into your business performance. With its intuitive user interface and powerful features, ScannBizz helps streamline your daily operations and improve your bottom line.

## 2. Features

*   **Authentication:** Secure user authentication with email/password and Google login.
*   **PIN Protection:** An extra layer of security with PIN verification for logged-in users.
*   **Stock Management:** Easily add, edit, and remove products from your inventory.
*   **Sales Tracking:** Record sales transactions and view a detailed history of your sales.
*   **Barcode Scanning:** Use your device's camera to scan barcodes and quickly add products to a sale.
*   **Analytics:** Visualize your sales data with an interactive chart to track your business performance over time.
*   **Offline Support:** The application is designed to work offline, ensuring that you can continue to make sales even without an internet connection.

## 3. Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js and npm (or yarn) installed on your machine.
*   A Firebase project with Firestore, Authentication, and Storage enabled.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/scannbizz-pos.git
    cd scannbizz-pos
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Firebase configuration:**
    *   Navigate to `src/firebase/config.ts`.
    *   Replace the placeholder Firebase configuration with your own project's configuration.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 4. Project Structure

The project follows a standard React project structure:

```
.
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── analytics/
│   │   ├── auth/
│   │   ├── layout/
│   │   ├── products/
│   │   ├── sales/
│   │   └── scanner/
│   ├── contexts/
│   ├── firebase/
│   ├── pages/
│   │   └── auth/
│   └── utils/
├── .gitignore
├── index.html
├── package.json
└── ...
```

*   **`src/assets`**: Contains static assets like images and icons.
*   **`src/components`**: Contains reusable UI components.
*   **`src/contexts`**: Contains React contexts for managing global state (e.g., authentication, data, theme).
*   **`src/firebase`**: Contains the Firebase configuration file.
*   **`src/pages`**: Contains the main pages of the application.
*   **`src/utils`**: Contains utility functions.

## 5. Technologies Used

*   **React:** A JavaScript library for building user interfaces.
*   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
*   **Vite:** A fast build tool that provides a quicker and leaner development experience for modern web projects.
*   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom user interfaces.
*   **Firebase:** A platform for building web and mobile applications, used for authentication, database, and storage.
*   **Chart.js:** A simple yet flexible JavaScript charting library for designers & developers.
*   **Framer Motion:** A production-ready motion library for React.

## 6. User Guide

### 6.1. Authentication

*   **Sign Up:** Create a new account using your email and password.
*   **Log In:** Log in to your account using your email and password or with your Google account.
*   **PIN Setup:** After your first login, you will be prompted to set up a 4-digit PIN for extra security.
*   **PIN Verification:** On subsequent logins, you will be asked to enter your PIN to access the application.

### 6.2. Stock Management

*   Navigate to the **Stock** page to view your inventory.
*   Click the **Add Product** button to add a new product to your inventory. You will need to provide the product's name, price, and quantity.
*   Click on a product to edit its details or delete it from your inventory.

### 6.3. Selling

*   Navigate to the **Sell** page to start a new sale.
*   You can either manually select products from the list or use the barcode scanner to add products to the cart.
*   Once you have added all the products to the cart, click the **Checkout** button to complete the sale.

### 6.4. Analytics

*   Navigate to the **Analytics** page to view your sales data.
*   The chart displays your sales over the last 7 days, allowing you to track your business performance.

### 6.5. Account

*   Navigate to the **Account** page to view your account details and log out of the application.
