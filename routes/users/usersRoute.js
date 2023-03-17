const express = require('express');
const userController = require('../../controllers/users/usersController');
const validateToken = require("../../middlewares/validateToken");

const router = express.Router();

router.get('/login' , userController.login);
router.post('/register' , userController.register);
router.get('/' ,validateToken , userController.getUser);
// router.put('/' , userController.updateUsers);
// router.delete('/' , userController.deleteUsers);

module.exports = router;