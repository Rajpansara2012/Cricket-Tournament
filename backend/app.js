const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/authRoutes');
const tourroute = require('./routes/adminRoutes');
const addTeam = require('./routes/userRoutes');


const app = express();
app.use(session({
    secret: 'dhruvin@2003',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json());
connectDB();
app.get('/', (req, res) => res.send('Helloworld!'));
app.use('/auth', authRoutes);
app.use('/admin', tourroute);
app.use('/user', addTeam);



const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));