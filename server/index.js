import dotenv from 'dotenv';
// This MUST be the first line to run to ensure environment variables are available globally
dotenv.config();

import express from 'express';
import Connection from './database/db.js';
import router from './routes/route.js';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);

const PORT = 8000;

// Call the connection function directly. 
// It will now access the process.env variables on its own.
Connection();

app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));

