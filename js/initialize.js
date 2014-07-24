$(function () {
  initialize()
});

function initialize() {
  Array.prototype.last = function() { return this[this.length - 1] }

  App = {
    mapOptions: {
      center: new google.maps.LatLng(-15.7941454, -47.88254789999996),
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    },

    nodes: [],
    markers: [],

    newMarker: function () {
      return new google.maps.Marker({
        position: new google.maps.LatLng(this.nodes.last()[0], this.nodes.last()[1]),
        map: map
      });
    },

    addNode: function (lat, lng) {
      this.nodes.push([lat, lng]);
    },

    updateMarkers: function() {
      var that = this;

      if(this.markers.length > 1) {
        var marker = this.markers.pop();
        marker.setMap(null);
      }

      this.markers.push(this.newMarker());
    }
  };

  var map = new google.maps.Map(document.getElementById("map_canvas"), App.mapOptions);

  google.maps.event.addListener(map, 'click', function(e) {
    App.addNode(e.latLng.k, e.latLng.B);
    App.updateMarkers();
  });
}

