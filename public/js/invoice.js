$(function () {
  $('#invoice_date').datetimepicker({
    format: 'DD/MM/YYYY',
    defaultDate: "moment"
  });

   $('#invoice').submit(function (e) {
    e.preventDefault();

    var data = $(this).serialize();
    $.ajax({
      method: 'POST',
      url: '/invoices/add',
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


});


