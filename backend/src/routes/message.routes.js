const express = require('express');
const { getFriends, sendMessage, getMessage, sendImageMessage, updateMessageStatus } = require('../controllers/message.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/get-friends', getFriends);
router.post('/send-message', sendMessage);
router.post('/send-image', sendImageMessage);
router.get('/get-message/:id', getMessage);
router.post('/update-status', updateMessageStatus);
router.post('/update-message-delivered', updateMessageStatus);
module.exports = router;
