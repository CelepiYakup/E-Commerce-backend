const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser'); 
const dotenv = require('dotenv');
const db = require('./config/db')
const mongoose = require('mongoose');
const product = require('./routes/productsRoute')

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json({limit:"30mb", extended: true}))
app.use(cookieParser());

app.use('/',product)

db();

const PORT = process.env.PORT;



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
