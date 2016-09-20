const express = require('express');
const utils = require('../utils');
const Budgets = require('../models/budget');
const Clients = require('../models/client');
const router = express.Router();

router.route('/')
      .get((req, res) => {
        Budgets.find({}, (err, psr) => {
          const resultDelete = req.flash('resultDelete');
          
          res.render('budget', { title: 'Lista de presupuestos', isAdmin: true, budgets: psr, resultDelete: resultDelete[0] });
        });
      });

router.route('/add')
      .get((req, res) => {
        Budgets.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
      if (!post) {
        res.render('budgetadd', { title: 'Añadir presupuesto', isAdmin: true, invoice_num: 200, mode: 'add'  });
      } else {
        invoice_num = post.budget_number + 1;
        res.render('budgetadd', { title: 'Añadir presupuesto', isAdmin: true, invoice_num: invoice_num,  mode: 'add' });
      }
      });
      })
      .post((req, res) => {
        const date_parse = req.body.budget_date.split(/\//);
        req.body.budget_date = new Date(date_parse[2],date_parse[1]-1,date_parse[0]);
        console.log(req.body);
        Budgets.create(req.body, (e, budget) => {
          console.log(e);
          if (!budget) {
            res.status(200).send({ success: false, message: 'No se ha podido guardar los datos.' });
          } else {
            res.status(200).send({ success: true, message: 'Datos guardados correctamente.', id: budget._id  });
          }
        });
      });
router.route('/edit/:id_budget')
      .get((req, res) => {
        Budgets.findById(req.params.id_budget, (err, budget) => {
          if (err) throw err;
          let rows = 0;
          budget.items.forEach((elem, index) => {
            const len = elem.description.length;
            const result = Math.ceil(len / 74);
            rows += result;
          });
          res.render('budgetadd', { title: 'Editar presupuesto', isAdmin: true, budget: budget, rows_num: (19 - rows), mode: 'edit' });
        });
      });
router.route('/print/:id_budget')
      .get((req, res) => {
        Budgets.findById(req.params.id_budget, (err, budget) => {
          let rows = 0;
          budget.items.forEach((elem, index) => {
            const len = elem.description.length;
            const result = Math.ceil(len / 74);
            rows += result;
          });
          res.render('blank', {layout: 'presupuesto.hbs', budget: budget, rows_num: (19 - rows), title: "Presupuesto n" })
        });
      });
router.route('/delete/:id_budget')
      .get((req, res) => {
       Budgets.remove({ _id: req.params.id_budget }, (err) => {
          if (err) {
                req.flash('resultDelete', { success: false, message: 'No se ha podido borrar al presupuesto.', isMe: true });
      res.redirect('/budgets');
          } else {
                 req.flash('resultDelete', { success: true, message: 'Presupuesto borrado.', isMe: true });
      res.redirect('/budgets');
          }
        });
      });
router.route('/pdf/:id_budget')
      .get((req, res) => {
        res.send('En construccion');
      });
module.exports = router;
