const express = require('express');
const userRoutes = require('../routes/users/usersRoute');
const postsRoutes = require('../routes/posts/postsRoute');

const router = express.Router();

router.use('/users' , userRoutes);
router.use('/posts' , postsRoutes);


router.use('/' , (req, res) => {
    res.send('Welcome to the Users and Post api');
});

router.use('*', (req, res) => {
    res.send('404 Not Found');
});

function setRoutes(app){
    app.use(router);
}

module.exports = setRoutes;