const express = require('express');
const router = express.Router();

router.get('/',(request, response) => {
    const obj = {
        user: 'Darshan Patel',
        type: 'Admin',
        hit: 'Notes',
    };

    response.json(obj);
})


module.exports = router;