$(function () {
    function modalCustom(msg, title) {
    var dialog = new BootstrapDialog({
    title: title,
    message: msg,
    size: BootstrapDialog.SIZE_NORMAL,
    type: BootstrapDialog.TYPE_INFO,
    buttons: [{
      label: 'Aceptar',
      action: function(dialogItself){
        dialogItself.close();
      }
    }]
  });
    return dialog;
  }
  function modal(msg, succes, reload) {
    var type = succes ? BootstrapDialog.TYPE_SUCCESS : BootstrapDialog.TYPE_DANGER;
    var title = succes ? 'BIEN HECHO' : 'ERROR';
    var dialog = new BootstrapDialog({
    title: title,
    message: msg,
    size: BootstrapDialog.SIZE_SMALL,
    type: type,
    buttons: [{
      label: 'Aceptar',
      action: function(dialogItself){
        if (reload) {
          location.reload(true);
        } else {
           dialogItself.close();

        }
      }
    }]
  });
    return dialog;
  }
  $('#client-form').submit(function (event) {
    event.preventDefault();
    var formData = {
      'name': $('#name').val(),
      'dni': $('#dni').val(),
      'email': $('#email').val(),
      'telf': $('#telf').val(),
      'address': $('#address').val(),
      'zipcode': $('#zipcode').val(),
      'city': $('#city').val()
    }
    var mode = $('#mode').val()
    var id = $('#idClient').val()
    var url = null;
    if (mode === 'edit') {
      url = '/clients/edit/' + id;
    } else {
      url = '/clients/add';
    }
    formData.id = id;
    formData.mode = mode;
    console.log(id);
    $.ajax({
      type: 'POST',
      url: url,
      data: formData,
      dataType: 'json',
      encode: true
    })
    .done(function (data) {
      if (!data.success) {
        modal(data.message, data.success, false).open();
      } else {
        if (mode === 'edit') {
          modal(data.message, data.success, true).open();
        } else {
          modal(data.message, data.success, false).open();
          $('#client-form')[0].reset();
        }
      }
    })
    .fail(function (data) {
      //console.log(data);
    });
  });
//------
  $('button').click(function () {
     if ($(this).attr("obtainClient")) {

     $.ajax({
        type: 'POST',
        url: '/clients/info/' + this.id ,
        data: {},
        dataType: 'json',
        encode: true
      })
      .done(function (data) {
        if (!data.success) {
          modal(data.message, data.success, false).open();
        } else {
          var message = `<p><i class="fa fa-user" aria-hidden="true"></i> ${data.client.name} --- ${data.client.dni}</p>
<p><i class="fa fa-phone" aria-hidden="true"></i> ${data.client.telf}</p>
<p><i class="fa fa-envelope" aria-hidden="true"></i> ${data.client.email}</p>
<p><i class="fa fa-map" aria-hidden="true"></i> ${data.client.address}, ${data.client.zipcode}, ${data.client.city}</p>`;
          modalCustom(message, 'Info cliente').open();
        }
      })
      .fail();
     }
    if ($(this).attr("deleteClient")) {
      $.ajax({
        type: 'GET',
        url: '/clients/delete/' + this.id ,
        data: {},
        dataType: 'json',
        encode: true
      })
      .done(function (data) {
        if (!data.succes) {
          modal(data.message, data.success, false).open();
        } else {
          modal(data.message, data.success, true).open();
        }
      })
      .fail();
    }
  });



});
