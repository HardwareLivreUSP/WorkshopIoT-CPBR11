/**********************************************************
* WORKSHOP CAMPUS PARTY BRASIL 11
* 31/01/2018
* HARDWARE LIVRE USP
* hardwarelivreus.org
* tiny.cc/telegram-hlu
**********************************************************/

var socket = io.connect();

function addCard(id){
  var card = $('<div class="card mb-4 box-shadow"></div>');
  card.attr('id',"card_" + id)
  var header = $('<div class="card-header"></div>');
  var title = $('<h4 class="my-0 font-weight-normal"></h4>');
  title.text(id)

  header.append(title)
  card.append(header)

  var body = $('<div class="card-body"></div>');
  var span = $('<span class="switch switch-lg"></span>');
  
  var input = $('<input type="checkbox" class="switch">');
  input.attr('id', "input_" + id)

  input.change(function(){
      if(input.is(':checked'))
        socket.emit("change", {id: id, status: true});
      else
        socket.emit("change", {id: id, status: false});
  });

  var label = $('<label></label>');
  label.attr('for', "input_" + id);

  span.append(input)
  span.append(label)
  body.append(span)
  card.append(body)
  $(".card-deck").append(card);
}

function removeCard(id){  
  $("#card_" + id).remove();
}

function activateCard(id){
  $("#input_" + id).prop('checked', true);
}

function deactivateCard(id){
  $("#input_" + id).prop('checked', false);
}

var devices = {};

socket.on('change', function (data) {
  if (data.id != undefined && data.status != undefined) {
    if (devices[data.id] == undefined) addCard(data.id);
    devices[data.id] = status;
    if (data.status) activateCard(data.id);
    else deactivateCard(data.id);
  }
});

socket.on('out', function (data) {
  if (data.id != undefined) {
    removeCard(data.id);
    delete devices[data.id];
  }
});
