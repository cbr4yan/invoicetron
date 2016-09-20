const hbs = require('hbs');

const config = {
  saltRounds: 10,
  helpershbs_ifcond: () => {
    hbs.registerHelper('ifCond', function (p1, p2, options) {
      if (p1 === p2) {
        return options.fn(this);
      }
      return options.inverse(this);
   })},
  helpershbs_toDate: () => {
    hbs.registerHelper('toDate', function (date) {
      const dd = new Date(date);
      return new hbs.SafeString(`${("0" + dd.getDate()).slice(-2)}/${("0" + (dd.getMonth() + 1)).slice(-2)}/${dd.getFullYear()}`);
   })},
  helpershbs_eachRowPrint: () => {
    hbs.registerHelper('eachRowPrint', function (num) {
      var ret = "";
      for (var i = 0; i < num; i++) {
        ret += '<tr><td></td><td class="description"></td><td class="precio"></td><td></td><td class="importe"></td></tr>'
      }
      return ret;
    })},
helpershbs_eachRow: () => {
    hbs.registerHelper('eachRow', function (num) {
      var ret = "";
      for (var i = 0; i < num; i++) {
        ret += `<tr>
        <td>
          <input type="text" name="items[${i}][quantity]" id="quantity_${i}" class="form-control quantity">
        </td>
        <td>
          <textarea type="text" name="items[${i}][description]" id="description_${i}" class="description form-control"></textarea>
        </td>
        <td>
          <div class="input-group"><span class="input-group-addon">€</span>
            <input type="text" name="items[${i}][price]" id="price_${i}" class="price form-control">
          </div>
        </td>
                <td>
          <div class="input-group"><span class="input-group-addon">%</span>
            <input type="text" name="items[${i}][discount]" id="discount_${i}" class="discount form-control">
          </div>
        </td>
        <td>
          <div class="input-group"><span class="input-group-addon">€</span>
            <input type="text" name="items[${i}][amount]" id="amount_${i}"  class="amount form-control">
          </div>
        </td>
      </tr>`;
      }
      return ret;
    })},
  helpershbs_eachRowClass: () => {
    hbs.registerHelper('eachRowClass', function (items, restnum, options) {
      let result = ``;
      var i = 0;
      items.forEach(function (item, index) {
        let type = "";
        result += `<tr>
        <td>
          <input type="text" name="items[${index}][quantity]" id="quantity_${index}" class="form-control quantity" value="${item.quantity}">
        </td>
        <td>
          <textarea type="text" name="items[${index}][description]" id="description_${index}" class="description form-control">${item.description}</textarea>
        </td>
        <td>
          <div class="input-group"><span class="input-group-addon">€</span>
            <input type="text" name="items[${index}][price]" id="price_${index}" class="price form-control" value="${item.price}">
          </div>
        </td>
                <td>
          <div class="input-group"><span class="input-group-addon">%</span>
            <input type="text" name="items[${index}][discount]" id="discount_${index}" class="discount form-control" value="${item.discount}">
          </div>
        </td>
        <td>
          <div class="input-group"><span class="input-group-addon">€</span>
            <input type="text" name="items[${index}][amount]" id="amount_${index}"  class="amount form-control" value="${item.amount}">
          </div>
        </td>
      </tr>`;
      i++;
      });
     
      return result;
    });
  },


  sessionSecret: 'EzK!>-c4RxEJAr%f',
  session: (MongoStore) => {
    if (process.env.NODE_ENV === 'production') {
      return {
        secret: this.sessionSecret,
        resave: false,
        saveUninitialized: false,
        unset: 'destroy',
        store: new MongoStore({ mongooseConnection: this.db.connection })
      };
    }
    return {
      secret: config.sessionSecret,
      resave: false,
      unset: 'destroy',
      saveUninitialized: true
    };
  }
};

config.passport = require('./passport');
config.server = require('./server');
config.db = require('./database');

module.exports = config;
