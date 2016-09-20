const express = require('express');

const router = express.Router();

router.route('/')
      .get((req, res) => {
        req.logout();
        req.session = null;
        res.redirect('/');
      });

module.exports = router;
