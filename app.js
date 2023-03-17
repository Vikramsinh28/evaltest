const express = require('express');
require('dotenv').config();
const setRoutes = require('./routeSetters/routeSetter');
const port = process.env.PORT || 8080;

const app = express();

app.use(express.json());

setRoutes(app);

app.listen(port , () => {
    console.log(`Server is running on port ${port}`);
    console.log(`http://localhost:${port}`);
});
