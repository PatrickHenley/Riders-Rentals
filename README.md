# Riders Rentals Web App

## Overview
Riders Rentals is a full-stack car rental web application for both customers and administrators. The web app is created using the MERN web stack It provides:
- Public car browsing and booking
- Admin dashboard for managing cars, store locations, bookings, and administrators
- Modern, responsive UI built with TailwindCSS and vanilla JS (with optional Vite/React support)

## Features
- **Admin Registration & Authentication:** Secure registration and login for administrators. Credentials are verified against the database.
- **Car Management:** Add, edit, delete, and view car listings. All car details (make, model, year, price, image, etc.) are editable from the admin dashboard.
- **Store Location Management:** Add, edit, delete, and view store locations with address, contact info, and images.
- **Booking Workflow:** Customers can book cars, specifying pickup/return dates and locations. Bookings are stored and viewable by admins.
- **Dashboard & Navigation:** Sidebar navigation, quick actions, and summary cards for total cars, bookings, customers, and locations.
- **Responsive Design:** Works on desktop and mobile. Includes banners, modals, and modern UI elements.

## Project Structure

```
Riders Rentals/
├── client/
│   ├── index.html, home.html, cars.html, ...
│   ├── src/ (if using Vite/React)
│   ├── public/
│   └── ...
├── server/
│   ├── server.js
│   ├── package.json
│   └── ...
├── images/
├── README.md
└── ...
```

## Prerequisites
- Node.js (v16+ recommended)
- npm (comes with Node.js)
- MongoDB Atlas account (or local MongoDB)

## Setup Instructions

### 1. Clone the Repository
```sh
git clone <your-repo-url>
cd Riders Rentals
```

### 2. Install Server Dependencies
```sh
cd server
npm install express mongoose dotenv joi express-async-handler cors cloudinary bcryptjs
```

### 3. Install Vite and Tailwind (Frontend)
```sh
cd ../client
npm create vite@latest .
# Follow prompts to select React (or Vanilla if preferred)
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
- Add Tailwind directives to your `src/index.css` or `src/App.css`:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```
- Configure Tailwind in `tailwind.config.js` to scan your source files.

#### Using CDN (for static HTML)
If you are using static HTML files, you can include Tailwind and Font Awesome via CDN:
```html
<!-- Tailwind CSS CDN -->
<script src="https://cdn.tailwindcss.com"></script>
<!-- Font Awesome CDN -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
```
Add these lines in the `<head>` section of your HTML files.

### 4. Configure Environment Variables
Create a `.env` file in the `server` folder:
```env
MONGO_URI=<your-mongodb-connection-string>
PORT=3000
```

### 5. Start the Backend Server
```sh
npm start
```
The server runs on `http://localhost:3000` by default.

### 6. Start the Frontend (Vite/React)
```sh
cd ../client
npm run dev
```
The client runs on `http://localhost:5173` by default.

### 7. Open in Browser
- For static HTML: Open files in the `client` folder directly in your browser.
- For Vite/React: Visit `http://localhost:5173`.

## Key Usage Notes

### Admin Registration & Login
- Register a new admin via the registration form (`register-admin.html`).
- Login as admin via the login form (`index.html`). Credentials are checked against the database using `/api/admins/login`.
- On successful login, you are redirected to the admin dashboard (`admin.html`).

### Car & Store Management
- Admins can add, edit, and delete cars and store locations from their respective dashboard pages.
- Editing is done via modals; all car/store fields are editable and changes are saved to MongoDB.

### Bookings
- Customers can book cars from the public site. Bookings are stored in the database and viewable by admins.
- Booking workflow includes car selection, pickup/return dates, and location.

### API Endpoints
- `/api/cars` (GET: list, POST: add, PUT: update, DELETE: remove)
- `/api/stores` (GET, POST, PUT, DELETE)
- `/api/bookings` (GET, POST)
- `/api/admins` (GET: list, POST: register)
- `/api/admins/login` (POST: login)

### Environment & Database
- Ensure your backend server is running before using frontend features that require data.
- All data is stored in MongoDB Atlas (or your configured MongoDB instance).

## Customization & Extending
- **Styling:** All UI uses TailwindCSS. You can easily adjust colors, spacing, and layout in the HTML files.
- **Images:** Place car and store images in the `images/` folder and reference them in your car/store objects.
- **Security:** For production, implement password hashing and session management for admins.
- **Deployment:** You can deploy the backend to services like Heroku, Render, or Vercel, and the frontend to Netlify or Vercel.

## Troubleshooting
- If you see connection errors, check your `.env` file and MongoDB URI.
- Make sure both backend and frontend servers are running.
- For CORS issues, ensure the backend allows requests from your frontend origin.
- For database errors, check your MongoDB Atlas dashboard for connection status and logs.
- For frontend issues, check the browser console for errors.

## License
MIT

---

