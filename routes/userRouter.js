const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.get('/', controller.show);
router.post('/', controller.add);
router.put('/', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
