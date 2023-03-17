const express = require('express');
const postController = require('../../controllers/posts/postsController');
const validateToken = require("../../middlewares/validateToken");

const router = express.Router();

router.get('/get',validateToken , postController.getPost);
router.post('/add' ,validateToken , postController.createPost);
router.delete('/delete' ,validateToken , postController.deletePost);
router.put('/update' , validateToken , postController.updatePost);
router.get('/encryption' , postController.encryption);

module.exports = router;