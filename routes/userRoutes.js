const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const upload = require('../middleware/fileupload'); 


router.post('/signup', upload.single('profilePicture'), userController.signUp);


router.post('/login', userController.login);

module.exports = router;
