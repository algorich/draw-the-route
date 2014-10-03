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
        preserveViewport: true,
        suppressMarkers: true
      }),

      markers: {
        icons: {
          startFinish: new google.maps.MarkerImage('lib/images/start_finish_flag.png'),
          start:       new google.maps.MarkerImage('lib/images/green_flag.png'),
          end:         new google.maps.MarkerImage('lib/images/red_flag.png')
        },

        elements: [],
        type: undefined,

        create: function ( position ) {
          this.elements.push(
            new google.maps.Marker({
              position: position || DrawTheRoute.nodes.last(),
              map: DrawTheRoute.map,
              icon: baseIcon
            })
          );
        },

        // types of markers:
        //
        // start/finish: when it has one marker, or when start and finish points are the same
        // start: when it has more then one marker and it is the first marker
        // finish: when it has more than one marker and it is the last one
        // checkpoint and water are setted by a given param
        //
        setType: function (type) {
          if ((DrawTheRoute.nodes.first() == DrawTheRoute.nodes.last()) || (DrawTheRoute.nodes.length === 1)){
            return 'start-finish';
          } else if ()
        },

        update: function ( position ) {
          if (DrawTheRoute.nodes.elements.length === 1) {
            this.create(type: 'startFinish');

          } else if (DrawTheRoute.nodes.elements.length === 2) {
            this.create(type: 'start');
            this.create(type: 'finish');

          } else {
            var marker = this.markers.pop();
            marker.setMap(null);

            // maintain start point
            this.create(type: 'finish');
          }
        },
      },

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
        if (param === undefined)
          return settings.attachToRoad;
        else
          settings.attachToRoad = param;
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

        this.markers.update();
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

              var path = result.routes[ 0 ].legs[ 0 ];

              DrawTheRoute.markers.update( path.start_location );
              DrawTheRoute.markers.update( path.end_location );
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
