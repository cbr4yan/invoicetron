$(function () {
  $('#budget_date').datetimepicker({
    format: 'DD/MM/YYYY',
    defaultDate: "moment"
  });
  
  $("#edit_num_inv").click(function (event) {
    event.preventDefault();
    if ($("#invoice_number").prop('disabled') === true) {
      $("#invoice_number").prop('disabled', false);
    } else {
      $("#invoice_number").prop('disabled', true);
    }
  });


  $("#to_client").autocomplete({
    source: function (req, res) {
      getAutoCompleteList(req, '/api/clients');
      var x = [];
      for (var i = 0; i < queryResult.length; i++) {
        x[i] = { label: queryResult[i].name, value: queryResult[i].name, idx: i };
      }
      res(x);
    },
    minLength: 3,
    select: function (event, ui) {
      var i = ui.item.idx;
      $("#telf").val(queryResult[i].telf);
      $("#dni").val(queryResult[i].dni);
      $("#city").val(queryResult[i].city);
      $("#address").val(queryResult[i].address);
      $("#zipcode").val(queryResult[i].zipcode);
      $("#_client").val(queryResult[i]._id);   
    }
  });
  
  var counter = 1;

  $('#add_row').click(function () {
   // counter = $('#items tr').length - 2;
    var newRow = $('<tr>');
    var cols = '';
    cols += `<td><input type="text" name="items[${counter}][quantity]" id="quantity_${counter}" class="form-control quantity"></td>`;
    cols += `<td><textarea type="text" name="items[${counter}][description]" id="description_${counter}" class="description form-control"></textarea></td>`
    cols += `<td><div class="input-group"><span class="input-group-addon">€</span><input type="text" name="items[${counter}][price]" id="price_${counter}" class="price form-control"></div></td>`
    cols += `<td><div class="input-group"><span class="input-group-addon">%</span><input type="text" name="items[${counter}][discount]" id="class_${counter}" class="discount form-control"></div></td>`;
    cols += `<td><div class="input-group"><span class="input-group-addon">€</span><input type="text" name="items[${counter}][amount]" id="amount_${counter}"  class="amount form-control"></div></td>`;
    cols += '<td><a class="btn ibtnDel"><i class="fa fa-times" aria-hidden="true"></i></a></td>';
    newRow.append(cols);

    $("table#items").append(newRow);
    counter++;
  });

  $('#items').on('click', '.ibtnDel', function (e) {
    $(this).closest('tr').remove();
    var subtotalCurrent = $('.subtotal').val();
    $('.subtotal').val(subtotalCurrent - $(this).closest('tr').find('.amount').val());
    counter--;
  });


  $('#budget').submit(function (e) {
    e.preventDefault();

    var data = $(this).serialize();
    $.ajax({
      method: 'POST',
      url: '/budgets/add',
      dataType: 'json',
      data: data
    }).done(function (data) {
      if (!data.success) {
        modalBudget('ERROR', data.message, data.success, 0).open();
      } else {
        modalBudget('EXITO', data.message, data.success, data.id).open();
      }
    }).fail();
  });
  
  calculateAll();
  limitrow();
});

function limitrow() {
  $('#items').on('change', '.description', function () {
    var $row = $(this).closest('tr');
    var description = $row.find('.description').val() ? $row.find('.description').val() : '';
    var length = description.length;
    if (length > 0) {
      //const result = Math.ceil(len / 74);
      var result = Math.ceil(length / 74);
    }
    var rowsrest = 18 - (19 - result);
    for (var i = 0; i < rowsrest; i++) {
      $('#items tbody tr').last().remove();
    }
    ///$('#items tbody tr').last()
  });
}

function modalBudget(title, message, succes, id) {
  var type = succes ? BootstrapDialog.TYPE_SUCCESS : BootstrapDialog.TYPE_DANGER;
  var print = succes ? {icon: 'fa fa-print', label: 'Imprimir', cssClass: 'btn-info', action: function () { var win = window.open('print/' + id , '_blank'); win.focus(); } } : {};
  return new BootstrapDialog({
    title: title,
    message: message,
    type: type,
    buttons: [
      print,
      {
        label: 'Aceptar',
        action: function(dialogItself){
          dialogItself.close();
        }
      }]
  });
}

function calculateTotal(subtotal, iva_amount) {
  var total = subtotal + iva_amount;
  var totalold = $('#total').val();
    $('#total').val(accounting.formatNumber(total));

}

function calculateIVA(subtotal) {
  var iva_perc = $('#iva_perc').val();
  var iva_amount = (iva_perc/100) * subtotal;
  $('.iva_amount').val(accounting.formatNumber(iva_amount));
  calculateTotal(subtotal, iva_amount);
}

function calculateSubTotal() {
  var sum = 0.0;
  $('.amount').each(function () {
    var value = accounting.unformat(this.value, ",");
    if (!isNaN(value) && value.length != 0) {
      sum += value;
    }
  });
  $('.subtotal').val(accounting.formatNumber(sum));
  calculateIVA(sum);
}


function calculateAll() {
  $('#items').on('change', '.quantity, .price, #iva_perc, .discount, .amount, .subtotal, .iva_amount', function () {
    var amount = 0;
    var operationDiscount = 0;
    var $row = $(this).closest('tr');
    var quantity = $row.find('.quantity').val() ? $row.find('.quantity').val() : 1;
    var price = $row.find(".price").val() ? $row.find(".price").val() : '';
    var discount = $row.find(".discount").val();
    var importe = $row.find(".amount").val() ? $row.find(".amount").val() : '';
    var subtotal = $('.subtotal').val();
    var iva_amount = $('.iva_amount').val();
    if (discount.length > 0) {
      operationDiscount = discount/100;
    }
    if (isNaN(quantity)) {
      quantity = 1;
    }
    if (price.length != 0) {
      $row.find('.price').val(accounting.formatNumber(accounting.unformat(price, ",")));
    } 
    if (importe.length != 0) {
      $row.find('.amount').val(accounting.formatNumber(accounting.unformat(importe, ",")));
    } 
    if (subtotal.length != 0) {
      $('.subtotal').val(accounting.formatNumber(accounting.unformat(subtotal, ",")));
    }
    if (iva_amount.length != 0) {
      $('.iva_amount').val(accounting.formatNumber(accounting.unformat(iva_amount, ",")));
    }
    var priceUnformat = accounting.unformat(price, ",");
    var amount = quantity * (priceUnformat - (priceUnformat * operationDiscount));
    if (amount != 0) {
      $row.find('.amount').val(accounting.formatNumber(amount));
    }
    calculateSubTotal();

  /*    
    if (price.length != 0) {
      $row.find('.price').val(accounting.formatNumber(accounting.unformat(price, ",")));
    }
    var priceUnformat = accounting.unformat(price, ",");
    var amount = quantity * priceUnformat;
    if (isNaN(amount)) {
      $row.find('.amount').val('0');
    } else {
      $row.find('.amount').val(accounting.formatNumber(amount));
    }
    calculateSubTotal();*/
  });
}

function getAutoCompleteList(req, url) {
  $.ajax({
    async: false,
    url: url,
    data: {
      term: req.term
    },
    dataType: 'json',
    success: function (data) {
      queryResult = data;
    }
  });
}
