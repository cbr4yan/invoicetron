const express = require('express');
const utils = require('../utils');
const Invoices = require('../models/invoice');
const Clients = require('../models/client');
const router = express.Router();

router.route('/')
      .get((req, res) => {
        Invoices.find({}, (err, psr) => {
          const resultDelete = req.flash('resultDelete');
          res.render('invoice', { title: 'Lista de facturas', isAdmin: true, invoices: psr, resultDelete: resultDelete[0] });
        });
      });

router.route('/add')
      .get((req, res) => {
        Invoices.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
      if (!post) {
        res.render('invoiceadd', { title: 'Añadir factura', isAdmin: true, invoice_num: 100, mode: 'add'  });
      } else {
        invoice_num = post.invoice_number + 1;
        res.render('invoiceadd', { title: 'Añadir factura', isAdmin: true, invoice_num: invoice_num,  mode: 'add' });
      }
      });
      })
      .post((req, res) => {
        const date_parse = req.body.invoice_date.split(/\//);
        req.body.invoice_date = new Date(date_parse[2],date_parse[1]-1,date_parse[0]);
        Invoices.create(req.body, (e, invoice) => {
          if (!invoice) {
            res.status(200).send({ success: false, message: 'No se ha podido guardar los datos.' });
          } else {
            res.status(200).send({ success: true, message: 'Datos guardados correctamente.', id: invoice._id  });
          }
        });
      });
router.route('/edit/:id_invoice')
      .get((req, res) => {
        Invoices.findById(req.params.id_invoice, (err, invoice) => {
          if (err) throw err;
          let rows = 0;
          invoice.items.forEach((elem, index) => {
            const len = elem.description.length;
            const result = Math.ceil(len / 74);
            rows += result;
          });
          res.render('invoiceadd', { title: 'Editar presupuesto', isAdmin: true, invoice: invoice, rows_num: (19 - rows), mode: 'edit' });
        });
      })
      .post((req, res) => {
        const date_parse = req.body.invoice_date.split(/\//);
        req.body.invoice_date = new Date(date_parse[2],date_parse[1]-1,date_parse[0]);
        Invoices.findOneAndUpdate({ _id: req.params.id_invoice }, req.body, (e, invoice) => {
          if (!invoice) {
            res.status(200).send({ success: false, message: 'No se ha podido guardar los datos.' });
          } else {
            res.status(200).send({ success: true, message: 'Datos guardados correctamente.', id: invoice._id  });
          }
        });
      });

router.route('/print/:id_invoice')
      .get((req, res) => {
        Invoices.findById(req.params.id_invoice, (err, invoice) => {
          let rows = 0;
          invoice.items.forEach((elem, index) => {
            const len = elem.description.length;
            const result = Math.ceil(len / 74);
            rows += result;
          });
          res.render('blank', {layout: 'factura.hbs', invoice: invoice, rows_num: (19 - rows), title: "Factura n" })
        });
      });
router.route('/delete/:id_invoice')
      .get((req, res) => {
       Invoices.remove({ _id: req.params.id_invoice }, (err) => {
          if (err) {
                req.flash('resultDelete', { success: false, message: 'No se ha podido borrar al presupuesto.', isMe: true });
      res.redirect('/invoices');
          } else {
                 req.flash('resultDelete', { success: true, message: 'Presupuesto borrado.', isMe: true });
      res.redirect('/invoices');
          }
        });
      });
router.route('/pdf/:id_invoice')
      .get((req, res) => {
        res.send('En construccion');
      });
module.exports = router;
