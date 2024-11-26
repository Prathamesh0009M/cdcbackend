const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

// success abhi baki hai 

const app = express();
const database = require('./config/database');
const cloud = require('./config/cloudinary');

dotenv.config();
const PORT = process.env.PORT || 5000;


// Middleware setup
app.use(express.json());
app.use(cookieParser());

const server = http.createServer(app);


app.use(cors({
    origin: 'http://localhost:3000',  // Allow this origin
    // origin: 'https://nexier.vercel.app/',  // Allow this origin
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp'
}));


database.connect();
cloud.cloudinaryconnect();


const userRoutes = require('./routes/User');
const AJES = require('./routes/A_J_E_S');

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/ajes', AJES);




server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});











