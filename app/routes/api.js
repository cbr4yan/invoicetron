const express = require('express');
const utils = require('../utils');
const Clients = require('../models/client');
const router = express.Router();

router.route('/clients')
      .get((req, res) => {
        Clients.find({ name: new RegExp(req.query.term, "i") }, (err, client) => {
          res.status(200).send(client);
        });
        //res.status(200).send([{ name: 'brayan'}]);
      });

module.exports = router;
