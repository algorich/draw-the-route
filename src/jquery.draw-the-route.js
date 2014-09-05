/*global google */

(function ( $ ) {
  'use strict';

  $.fn.drawTheRoute = function (options) {

    var settings = $.extend({
        zoom: 14,
        center: [-15.7941454, -47.88254789999996], // [latitude, longitude]
        attachToRoad: true,
        lineColor: '#FF0000',
        nodes: [],
    }, options );

    var map = new google.maps.Map(
      document.getElementById(this.prop('id')),
      {
        center: new google.maps.LatLng( settings.center[0], settings.center[1] ),
        zoom: settings.zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
    );

    var DrawTheRoute = {

      settings: settings,

      map: map,

      directionsService: new google.maps.DirectionsService(),

      directionsDisplay: new google.maps.DirectionsRenderer({
        preserveViewport: true
      }),

      markers: [],

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
        },

        export: function () {
          return $.map(this.all(), function (node) {
            return [[node.k, node.B]];
          });
        }
      },

      attachToRoad: function (param) {
        if (param === undefined) {
          return settings.attachToRoad;
        } else {
          settings.attachToRoad = param;
        }
      },

      newMarker: function () {
        return new google.maps.Marker({
          position: this.nodes.last(),
          map: this.map
        });
      },

      updateMarkers: function() {
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
          path: this.nodes.all(),
          strokeColor: this.settings.lineColor,
          strokeOpacity: 1.0,
          strokeWeight: 2,
          map: this.map
        });

        this.updateMarkers();
      },

      drawRoute: function() {
        var self = this;

        if (this.nodes.size() > 0) {
          var startPoint = this.nodes.first(),
              endPoint   = this.nodes.last(),
              waypoints  = this.nodes.waypoints();

          var request = {
            origin: startPoint,
            destination: endPoint,
            waypoints: $.map(waypoints, function(waypoint) {
              return { location: waypoint, stopover: false };
            }),
            travelMode: google.maps.TravelMode.WALKING,
            unitSystem: google.maps.UnitSystem.IMPERIAL
          };

          this.directionsService.route(request, function(result, status) {
            if (status === google.maps.DirectionsStatus.OK) {
              self.directionsDisplay.setDirections(result);
            }
          });
        }
      },

      draw: function () {
        this.settings.attachToRoad ? this.drawRoute() : this.drawLine();
      },

      closed: function () {
        return this.nodes.first() === this.nodes.last();
      },

      closeRoute: function () {
        var minNodesNumber = this.nodes.size() > 2;

        if (minNodesNumber && !this.closed()) {
          this.nodes.push(this.nodes.first());
          this.draw();
        }
      },

      undo: function () {
        if (this.nodes.size() > 0) {
          this.nodes.pop();
          this.draw();
        }
      },

      exportData: function () {
        this.settings.nodes = this.nodes.export();

        return this.settings;
      }
    }; // DrawTheRoute

    DrawTheRoute.directionsDisplay.setMap(DrawTheRoute.map);

    (function initializeNodes () {
      var elements = $.map(settings.nodes, function (node) {
        return new google.maps.LatLng(node[0], node[1]);
      });

      DrawTheRoute.nodes.elements = elements;
      DrawTheRoute.draw();
    }());

    google.maps.event.addListener(DrawTheRoute.map, 'click', function(e) {
      DrawTheRoute.nodes.push(e.latLng);
      DrawTheRoute.draw();
    });

    return DrawTheRoute;
  }; // $.fn.drawTheRoute
}( jQuery ));
