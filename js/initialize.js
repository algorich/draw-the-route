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
      return new google.maps.Polyline({
          path: this.nodes,
          strokeColor: "#FF0000",
          strokeOpacity: 1.0,
          strokeWeight: 2,
          map: map
        });
    },

    drawRoute: function() {
      if(this.nodes.length > 1) {
        var startPoint = this.nodes[0];
        var endPoint   = this.nodes.last();
        var waypoints  = this.nodes.slice(1, this.nodes.length);

        var request = {
          origin: startPoint,
          destination: endPoint,
          waypoints: $.map(waypoints, function(waypoint, i) {
            return { location: waypoint, stopover: false }
          }),
          travelMode: google.maps.TravelMode.WALKING,
          unitSystem: google.maps.UnitSystem.IMPERIAL
        }

        directionsService.route(request, function(result, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
          }
        });
      }
    }
  };

  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var map = new google.maps.Map(document.getElementById("map_canvas"), App.mapOptions);
  directionsDisplay.setMap(map);

  google.maps.event.addListener(map, 'click', function(e) {
    App.addNode(e.latLng);
    App.drawLine();
    App.drawRoute();
    App.updateMarkers();
  });
}
