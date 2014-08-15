$(function () {
  initialize();
});

function initialize() {
  Array.prototype.last = function(offset) {
    offset = (offset || 1);
    return this.slice(-offset)[0];
  }

  Array.prototype.first = function() {
    return this[0];
  }

  App = {
    mapOptions: {
      center: new google.maps.LatLng(-15.7941454, -47.88254789999996),
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    },

    nodes: [],

    markers: [],

    attachToRoad: true,

    _map: undefined,

    node_id: 'map_canvas',

    map: function() {
      if (this._map === undefined) {
        this._map = new google.maps.Map(
          document.getElementById(this.node_id), this.mapOptions
        );
      }
      return this._map;
    },

    newMarker: function () {
      return new google.maps.Marker({
        position: this.nodes.last(),
        map: this.map
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
      if (this.route !== undefined) {
        this.route.setMap(null);
        delete(this.route);
      }

      this.route = new google.maps.Polyline({
        path: this.nodes,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: this.map
      });

      this.updateMarkers();
    },

    drawRoute: function() {
      if (this.nodes.length > 0) {
        var startPoint = this.nodes.first(),
            endPoint   = this.nodes.last(),
            waypoints  = this.nodes.slice(1, this.nodes.length);

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
    },

    draw: function () {
      this.attachToRoad ? this.drawRoute() : this.drawLine();
    },

    closed: function () {
      return this.nodes.first() == this.nodes.last();
    },

    closeRoute: function () {
      var minNodesNumber = this.nodes.length > 2;

      if (minNodesNumber && !this.closed()) {
        this.addNode(this.nodes.first());
        this.draw();
      }
    },

    undo: function () {
      if (this.nodes.length > 0) {
        this.nodes.pop();
        this.draw();
      }
    }
  };

  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(App.map());

  google.maps.event.addListener(App.map(), 'click', function(e) {
    App.addNode(e.latLng);
    App.draw();
  });


  // map = drawTheRoute('id-do-map', {});

  $('#close-route').on('click', function () {
    App.closeRoute();
  });

  $('#attach-to-road').prop('checked', App.attachToRoad);

  $('#attach-to-road').on('change', function () {
    App.attachToRoad = this.checked;
  });

  $('#undo').on('click', function () {
    App.undo();
  });
}
