const express = require('express');
const { getFriends, sendMessage, getMessage, sendImageMessage } = require('../controllers/message.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/get-friends', getFriends);
router.post('/send-message', sendMessage);
router.post('/send-image', sendImageMessage);
router.get('/get-message/:id', getMessage);

module.exports = router;
