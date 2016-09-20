const express = require('express');
const utils = require('../utils');
const Bills = require('../models/bill');
const Clients = require('../models/client');
const router = express.Router();

router.route('/')
      .get((req, res) => {
        Bills.find({}, (err, psr) => {
          const resultDelete = req.flash('resultDelete');
          res.render('bill', { title: 'Lista de recibos', isAdmin: true, invoices: psr, resultDelete: resultDelete[0] });
        });
      });
router.route('/add')
      .get((req, res) => {
        Bills.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
      if (!post) {
        res.render('billadd', { title: 'Añadir recibo', isAdmin: true, invoice_num: 200, mode: 'add'  });
      } else {
        invoice_num = post.invoice_number + 1;
        res.render('billadd', { title: 'Añadir recibo', isAdmin: true, invoice_num: invoice_num,  mode: 'add' });
      }
      });
      })
      .post((req, res) => {
        const date_parse = req.body.invoice_date.split(/\//);
        req.body.invoice_date = new Date(date_parse[2],date_parse[1]-1,date_parse[0]);
        console.log(req.body);
        Bills.create(req.body, (e, invoice) => {
          console.log(e);
          if (!invoice) {
            res.status(200).send({ success: false, message: 'No se ha podido guardar los datos.' });
          } else {
            res.status(200).send({ success: true, message: 'Datos guardados correctamente.', id: invoice._id  });
          }
        });
      });
module.exports = router;
