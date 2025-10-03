

// server.js - Your Node.js Backend Application

// Load environment variables from .env file
require('dotenv').config();

// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000; // Use port from .env or default to 3000
const MONGO_URI = process.env.MONGO_URI; // Get MongoDB URI from .env

// --- Middleware ---
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }));
app.use(express.json());

// --- Database Connection ---
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10
})
    .then(() => {
        console.log('MongoDB connected successfully!');
        console.log('Connected to database:', mongoose.connection.db.databaseName);
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        console.error('Error name:', err.name);
        console.error('Error code:', err.code);
        console.error('Error message:', err.message);
        process.exit(1); // Exit if MongoDB connection fails
    });

// --- Mongoose Schema and Model for Car Listings ---
const carSchema = new mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    pricePerDay: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    filename: { type: String, required: true },
    type: { type: String, required: true },
    seats: { type: Number, required: true },
    transmission: { type: String, required: true },
    features: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

const Car = mongoose.model('Car', carSchema);

// --- Mongoose Schema and Model for Store Locations ---
const storeSchema = new mongoose.Schema({
    address: { type: String, required: true },
    city: { type: String, required: true },
    constituency: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    imageUrl: { type: String, required: true },
    filename: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Store = mongoose.model('Store', storeSchema);

// --- Mongoose Schema and Model for Bookings ---
const bookingSchema = new mongoose.Schema({
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
    carImage: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    contactInfo: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    pickupDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    rentalDays: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// --- Mongoose Schema and Model for Admins ---
const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    registeredAt: { type: Date, default: Date.now }
});
const Admin = mongoose.model('Admin', adminSchema);


// --- API Routes ---

// 1. Car Routes
// Update a car
app.put('/api/cars/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCar = await Car.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedCar) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json({ message: 'Car updated successfully', car: updatedCar });
    } catch (error) {
        console.error('Error updating car:', error);
        res.status(500).json({ message: 'Failed to update car', error: error.message });
    }
});
app.post('/api/cars', async (req, res) => {
    try {
        console.log('Received POST /api/cars with data:', JSON.stringify(req.body, null, 2));
        const newCar = new Car(req.body);
        const savedCar = await newCar.save();
        console.log('Successfully saved car to MongoDB:', JSON.stringify(savedCar, null, 2));
        res.status(201).json({ message: 'Car added successfully!', car: savedCar });
    } catch (error) {
        console.error('Error adding car:', error);
        res.status(500).json({ message: 'Failed to add car', error: error.message });
    }
});

app.get('/api/cars', async (req, res) => {
    try {
        const cars = await Car.find();
        console.log(`Fetched ${cars.length} cars from MongoDB`);
        res.status(200).json(cars);
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ message: 'Failed to fetch cars', error: error.message });
    }
});

app.get('/api/cars/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json(car);
    } catch (error) {
        console.error('Error fetching car by ID:', error);
        res.status(500).json({ message: 'Failed to fetch car', error: error.message });
    }
});

app.delete('/api/cars/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCar = await Car.findByIdAndDelete(id);
        if (!deletedCar) {
            return res.status(404).json({ message: 'Car not found' });
        }
        console.log('Deleted car from MongoDB:', JSON.stringify(deletedCar, null, 2));
        res.status(200).json({ message: 'Car deleted successfully', car: deletedCar });
    } catch (error) {
        console.error('Error deleting car:', error);
        res.status(500).json({ message: 'Failed to delete car', error: error.message });
    }
});

// 2. Store Location Routes
// Update a store
app.put('/api/stores/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedStore = await Store.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedStore) {
            return res.status(404).json({ message: 'Store not found' });
        }
        res.status(200).json({ message: 'Store updated successfully', store: updatedStore });
    } catch (error) {
        console.error('Error updating store:', error);
        res.status(500).json({ message: 'Failed to update store', error: error.message });
    }
});
app.post('/api/stores', async (req, res) => {
    try {
        console.log('Received POST /api/stores with data:', JSON.stringify(req.body, null, 2));
        const newStore = new Store(req.body);
        const savedStore = await newStore.save();
        console.log('Successfully saved store to MongoDB:', JSON.stringify(savedStore, null, 2));
        res.status(201).json({ message: 'Store added successfully!', store: savedStore });
    } catch (error) {
        console.error('Error adding store:', error);
        res.status(500).json({ message: 'Failed to add store', error: error.message });
    }
});

app.get('/api/stores', async (req, res) => {
    try {
        const stores = await Store.find();
        console.log(`Fetched ${stores.length} stores from MongoDB`);
        res.status(200).json(stores);
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).json({ message: 'Failed to fetch stores', error: error.message });
    }
});

app.delete('/api/stores/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStore = await Store.findByIdAndDelete(id);
        if (!deletedStore) {
            return res.status(404).json({ message: 'Store not found' });
        }
        console.log('Deleted store from MongoDB:', JSON.stringify(deletedStore, null, 2));
        res.status(200).json({ message: 'Store deleted successfully', store: deletedStore });
    } catch (error) {
        console.error('Error deleting store:', error);
        res.status(500).json({ message: 'Failed to delete store', error: error.message });
    }
});

// 3. Booking Routes
app.post('/api/bookings', async (req, res) => {
    try {
        console.log('Received POST /api/bookings with data:', JSON.stringify(req.body, null, 2));
        // Validate carId exists in the Car collection
        const car = await Car.findById(req.body.carId);
        if (!car) {
            console.error('Invalid carId:', req.body.carId);
            return res.status(400).json({ message: 'Invalid carId: Car not found' });
        }
        const booking = new Booking(req.body);
        const savedBooking = await booking.save();
        console.log('Successfully saved booking to MongoDB:', JSON.stringify(savedBooking, null, 2));
        res.status(201).json({ message: 'Booking created successfully!', booking: savedBooking });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Failed to create booking', error: error.message });
    }
});

app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 }).populate('carId');
        const bookingsWithImage = bookings.map(b => {
            let carImage = b.carImage;
            if (b.carId && b.carId.imageUrl) {
                carImage = b.carId.imageUrl;
            }
            return {
                ...b.toObject(),
                carImage,
            };
        });
        console.log(`Fetched ${bookingsWithImage.length} bookings from MongoDB`);
        res.status(200).json(bookingsWithImage);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }
});

// 4. Admin Routes
// Register a new admin
app.post('/api/admins', async (req, res) => {
    try {
        const { name, email, password, registeredAt } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required.' });
        }
        // Check for duplicate email
        const existing = await Admin.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: 'Email already registered.' });
        }
        const admin = new Admin({ name, email, password, registeredAt });
        const savedAdmin = await admin.save();
        res.status(201).json({ message: 'Admin registered successfully!', admin: savedAdmin });
    } catch (error) {
        console.error('Error registering admin:', error);
        res.status(500).json({ message: 'Failed to register admin', error: error.message });
    }
});

// Get all admins
app.get('/api/admins', async (req, res) => {
    try {
        const admins = await Admin.find().sort({ registeredAt: -1 });
        res.status(200).json(admins);
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ message: 'Failed to fetch admins', error: error.message });
    }
});

// Admin Login Route (authentication)
app.post('/api/admins/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        if (admin.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        // Optionally, you can return admin info (excluding password)
        const { password: _, ...adminData } = admin.toObject();
        res.status(200).json({ message: 'Login successful', admin: adminData });
    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ message: 'Failed to login', error: error.message });
    }
});


// Catch-all route for undefined endpoints
app.use((req, res) => {
    console.error(`Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`Frontend should send requests to http://localhost:${PORT}/api/cars for cars`);
    console.log(`Frontend should send requests to http://localhost:${PORT}/api/stores for stores`);
    console.log(`Frontend should send requests to http://localhost:${PORT}/api/bookings for bookings`);
    console.log(`Frontend should send requests to http://localhost:${PORT}/api/admins for admins`);
    console.log(`MongoDB URI: ${MONGO_URI}`);
});