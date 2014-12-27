$(function () {
  'use strict';

  var dtr = $('#map_canvas').drawTheRoute();

  $('#close-route').on('click', function () {
    dtr.closeRoute();
  });

  $('#attach-to-road').prop('checked', dtr.attachToRoad());

  $('#attach-to-road').on('change', function () {
    dtr.attachToRoad(this.checked);
  });

  $('#undo').on('click', function () {
    dtr.undo();
  });

  $("#reset").on("click", function(e) {
    var response = confirm('Are you sure?');

    if(response) dtr.resetResources();
  });

  $('#export-data').on('click', function () {
    $('#agl-exported-data').text(JSON.stringify(dtr.exportData()));
  });
});