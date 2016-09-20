const express = require('express');
const Clients = require('../models/client');
const utils = require('../utils');
const router = express.Router();

router.route('/')
      .get((req, res) => {
        Clients.find({}, (err, clients) => {
          res.render('client', { title: 'Lista de clientes', isAdmin: true, clients: clients });
        });
      });

router.route('/info/:idClient')
      .post((req, res) => {
        Clients.findById(req.params.idClient, (err, client) => {
          if (err) {
            res.status(200).send({ success: false, message: 'No se ha podido obtener informacion.' });
          } else {
            res.status(200).send({ success: true, message: '', client: client });
          }
        });
      });

router.route('/delete/:idClient')
      .get((req, res) => {
        Clients.remove({ _id: req.params.idClient }, (err) => {
          if (err) {
            res.status(200).send({ success: false, message: 'No se ha podido borrar al cliente.' });
          } else {
            res.status(200).send({ success: true, message: 'Cliente borrado.' });
          }
        });
      });

router.route('/edit/:idClient')
      .get((req, res) => {
        Clients.findById(req.params.idClient, (err, client) => {
          if (err) throw err;
          res.render('clientadd', { title: 'Editar cliente', isAdmin: true, client: client, mode: 'edit' });
        });
      })
      .post((req, res) => {
        utils.validateFormClient('edit', req.body, (err, data) => {
          if (err) {
            res.status(200).send({ success: false, message: err.message });
          } else {
            data.dni = data.dni.toUpperCase();
            Clients.findOneAndUpdate({ _id: data.id }, data, (e, client) => {
               if (!client) {
                res.status(200).send({ success: false, message: 'No se ha podido actualizar los datos.' });
              } else {
                res.status(200).send({ success: true, message: 'Datos actualizados correctamente.' });
              }
            });
          }
        });      
      });

router.route('/add')
      .get((req, res) => {
        res.render('clientadd', { title: 'Agregar cliente', isAdmin: true, mode: 'add' });
      })
      .post((req, res) => {
        utils.validateFormClient('add', req.body, (err, data) => {
          if (err) {
            res.status(200).send({ success: false, message: err.message });
          } else {
            data.dni = data.dni.toUpperCase();
            Clients.create(data, (e, client) => {
              if (!client) {
                res.status(200).send({ success: false, message: 'No se ha podido guardar los datos.' });
              } else {
                res.status(200).send({ success: true, message: 'Datos guardados correctamente.' });
              }
            });
          }
        });
      });

module.exports = router;
