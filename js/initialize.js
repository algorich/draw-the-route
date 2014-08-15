$(function () {
  initialize();
});

function initialize() {
  DrawTheRoute: {
    nodes: {
      elements: [],

      last: function (offset) {
        offset = (offset || 1);
        return this.elements.slice(-offset)[0];
      },

      first: function () {
        return this.elements[0];
      },

      all: function () {
        return this.elements;
      },

      waypoints: function () {
        return this.elements.slice(1, this.size());
      },

      size: function () {
        return this.elements.length;
      },

      push: function (elem) {
        this.elements.push(elem);
      },

      pop: function () {
        return this.elements.pop();
      }
    },

    mapOptions: {
      center: function (position) {
        return new google.maps.LatLng(position.lt, position.lng),
      },

      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    },

    markers: [],

    attachToRoad: true,

    map: undefined,

    nodeId: undefined,

    plottingSettings: {},

    defineDirectionsApi: function () {
      this.directionsService = new google.maps.DirectionsService();
      this.directionsDisplay = new google.maps.DirectionsRenderer();
      this.directionsDisplay.setMap(this.map);
    },

    defineMap: function () {
      this.map = new google.maps.Map(
        document.getElementById(this.nodeId), this.mapOptions
      );
    },

    addNode: function (node) {
      this.nodes.push(node);
    },

    initialize: function (plottingSettings) {
      this.plottingSettings = plottingSettings;
      this.mapOptions.center(plottingSettings.position);

      this.defineMap();
      this.defineDirectionsApi();
      this.nodeId = plottingSettings.nodeId;

      google.maps.event.addListener(this.map, 'click', function(e) {
        DrawTheRoute.addNode(e.latLng);
        DrawTheRoute.draw();
      });
    },

    newMarker: function () {
      return new google.maps.Marker({
        position: this.nodes.last(),
        map: this.map
      });
    },

    updateMarkers: function() {
      var that = this;

      if(this.markers.length > 1) {
        var marker = this.markers.pop();
        marker.setMap(null);
      };

      this.markers.push(this.newMarker());
    },

    drawLine: function() {
      if (this.route !== undefined) {
        this.route.setMap(null);
        delete(this.route);
      }

      this.route = new google.maps.Polyline({
        path: this.nodes.all(),
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
        map: this.map
      });

      this.updateMarkers();
    },

    drawRoute: function() {
      if (this.nodes.size() > 0) {
        var startPoint = this.nodes.first(),
            endPoint   = this.nodes.last(),
            waypoints  = this.nodes.waypoints();

        var request = {
          origin: startPoint,
          destination: endPoint,
          waypoints: $.map(waypoints, function(waypoint, i) {
            return { location: waypoint, stopover: false }
          }),
          travelMode: google.maps.TravelMode.WALKING,
          unitSystem: google.maps.UnitSystem.IMPERIAL
        }

        this.directionsService.route(request, function(result, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            DrawTheRoute.directionsDisplay.setDirections(result);
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
      var minNodesNumber = this.nodes.size() > 2;

      if (minNodesNumber && !this.closed()) {
        this.addNode(this.nodes.first());
        this.draw();
      }
    },

    undo: function () {
      if (this.nodes.size() > 0) {
        this.nodes.pop();
        this.draw();
      }
    }
  };

  DrawTheRoute.initialize({
    nodeId:   'map_canvas',
    location: { lt: -15.7941454, lng: -47.88254789999996 }
  });

  $('#close-route').on('click', function () {
    DrawTheRoute.closeRoute();
  });

  $('#attach-to-road').prop('checked', DrawTheRoute.attachToRoad);

  $('#attach-to-road').on('change', function () {
    DrawTheRoute.attachToRoad = this.checked;
  });

  $('#undo').on('click', function () {
    DrawTheRoute.undo();
  });
}
