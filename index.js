const express = require('express')
const bodyParser = require('body-parser');

const router = require('./routes/Routers');


const app = express()
const port = 5000


// Middleware for parsing JSON requests
app.use(express.json());
app.use(bodyParser.json());

app.use('/v4health', router)

// Start the server 
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})