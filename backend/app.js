const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:8082"],
        methods: ["GET", "POST"],
        credentials: true
    }
});
// global.io = io;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    exposedHeaders: ["set-cookie"]
}));

app.use(bodyParser.json());
connectDB();
// app.use((req, res, next) => {
//     req.io = io;
//     next();
// });
io.on('connection', (socket) => {
    console.log('User connected');



    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
module.exports = io;

const authRoutes = require('./routes/authRoutes');
const tourroute = require('./routes/adminRoutes');
const addTeam = require('./routes/userRoutes');

app.get('/', (req, res) => res.send('Helloworld!'));
app.use('/auth', authRoutes);
app.use('/admin', tourroute);
app.use('/user', addTeam);

const port = process.env.PORT || 8082;

server.listen(port, () => console.log(`Server running on port ${port}`));
