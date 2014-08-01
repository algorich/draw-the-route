$(function () {
  initialize()
});

function initialize() {
  Array.prototype.last = function(offset) {
    offset = (offset || 1);
    return this.slice(-offset)[0];
  }

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
        position: this.nodes.last(),
        map: map
      });
    },

    addNode: function (node) {
      this.nodes.push(node);
    },

    updateMarkers: function() {
      var that = this;

      if(this.markers.length > 1) {
        var marker = this.markers.pop();
        marker.setMap(null);
      }

      this.markers.push(this.newMarker());
    },

    drawLine: function() {
      if(this.nodes.length > 1) {
        return new google.maps.Polyline({
          path: this.nodes,
          strokeColor: "#FF0000",
          strokeOpacity: 1.0,
          strokeWeight: 4,
          map: map
        });
      }
    }
  };

  var map = new google.maps.Map(document.getElementById("map_canvas"), App.mapOptions);

  google.maps.event.addListener(map, 'click', function(e) {
    App.addNode(e.latLng);
    App.drawLine();
    App.updateMarkers();
  });
}

