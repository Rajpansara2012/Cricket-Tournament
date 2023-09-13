const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    exposedHeaders: ["set-cookie"]
}));
app.use(bodyParser.json());
connectDB();


const authRoutes = require('./routes/authRoutes');
const tourroute = require('./routes/adminRoutes');
const addTeam = require('./routes/userRoutes');

app.get('/', (req, res) => res.send('Helloworld!'));
app.use('/auth', authRoutes);
app.use('/admin', tourroute);
app.use('/user', addTeam);

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));