/*global google */

(function ( $ ) {
  'use strict';

  $.fn.drawTheRoute = function (options) {

    var first = function (array) {
      return array[0];
    };

    var last = function (array) {
      return array[array.length - 1];
    };

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
      traveledDistances: [],
      map: map,

      traveledDistance: function () {
        var totalDistance = 0;

        $.each(this.traveledDistances, function (i, distance) {
          return totalDistance += distance;
        });

        return totalDistance;
      },

      resetResources: function () {
        this.directionsDisplays.destroyAll();
        this.waypoints.destroyAll();
        this.markers.clean();
        this.nodes.destroyAll();
      },

      initializeSearchBox: function () {
        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        var searchBox = new google.maps.places.SearchBox(input);

        // Listen for the event fired when the user selects an item from the
        // pick list. Retrieve the matching places for that item.
        google.maps.event.addListener(searchBox, 'places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          var bounds = new google.maps.LatLngBounds();

          for (var i = 0, place; place = places[i]; i++) {
            bounds.extend(place.geometry.location);
          }

          DrawTheRoute.resetResources();
          map.fitBounds(bounds);
          map.setZoom(17);
        });
      },

      directionsService: new google.maps.DirectionsService(),

      directionsDisplays: {
        elements: [],

        pop: function () {
          var display = this.elements.pop();

          if (display) {
            display.setMap(null);
            return display;
          }
        },

        showAll: function () {
          $.each(this.elements, function (i, display) {
            display.setMap(DrawTheRoute.map)
          });
        },

        create: function() {
          var display = new google.maps.DirectionsRenderer({
            preserveViewport: true,
            suppressMarkers: true
          });

          display.setMap(DrawTheRoute.map);
          this.elements.push(display);
        },

        destroyAll: function () {
          $.each(this.elements, function (i, display) {
            display.setMap(null)
          });

          this.elements = [];
        }
      },

      waypoints: {
        SIZE_LIMIT: 8,

        elements: [],

        count: 0,

        push: function (waypoint) {
          var lastWaypoints = last(this.elements);

          if (lastWaypoints === undefined) {
            this.elements.push([waypoint]);
            DrawTheRoute.directionsDisplays.create();
          } else if (lastWaypoints.length < 8) {
            this.elements[this.elements.length - 1].push(waypoint);
          } else { // lastWaypoints.length === 8
            this.elements.push([last(lastWaypoints), waypoint]);
            DrawTheRoute.directionsDisplays.create();
          }
        },

        pop: function () {
          var lastWaypoints = last(this.elements),
              waypoint;

          if (lastWaypoints === undefined) {
            return null;
          } else if (lastWaypoints.length <= 2) {
            this.elements.pop();
            waypoint = DrawTheRoute.directionsDisplays.pop();
          } else {
            waypoint = this.elements[this.elements.length - 1].pop();
          }

          return waypoint;
        },

        destroyAll: function () {
          this.elements = [];
          this.count    = [];
        }
      },

      markers: {
        icons: {
          startFinish: new google.maps.MarkerImage('lib/images/start_finish_flag.png'),
          start:       new google.maps.MarkerImage('lib/images/green_flag.png'),
          end:         new google.maps.MarkerImage('lib/images/red_flag.png')
        },

        elements: [],

        create: function ( position, icon ) {
          this.elements.push(
            new google.maps.Marker({
              position: position || DrawTheRoute.nodes.last(),
              map: DrawTheRoute.map,
              icon: icon
            })
          );
        },

        clean: function () {
          $.each(this.elements, function(i, item) {
            item.setMap(null);
          });

          this.elements = [];
        },

        show: function () {
          this.clean();

          if (DrawTheRoute.nodes.first() == DrawTheRoute.nodes.last()) {
            this.create(DrawTheRoute.nodes.first(), this.icons.startFinish);
          } else {
            this.create(DrawTheRoute.nodes.first(), this.icons.start);
            this.create(DrawTheRoute.nodes.last(), this.icons.end);
          }
        }
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

        size: function () {
          return this.elements.length;
        },

        push: function (elem) {
          this.elements.push(elem);
          DrawTheRoute.waypoints.push(elem);
        },

        pop: function () {
          DrawTheRoute.waypoints.pop();
          return this.elements.pop();
        },

        export: function () {
          return $.map(this.all(), function (node) {
            return [[node.k, node.B]];
          });
        },

        destroyAll: function () {
          this.elements = [];
        }
      },

      toggleRoute: function (checked) {
        if (checked === false) {
          $.map(DrawTheRoute.directionsDisplays.elements, function (item, i) {
            return item.setMap(null);
          });
        } else {
          this.route.setMap(null);
          DrawTheRoute.directionsDisplays.showAll();
        }

        this.draw();
      },

      attachToRoad: function (param) {
        if (param === undefined) {
          return settings.attachToRoad;
        } else {
          settings.attachToRoad = param;
          this.toggleRoute(param);
        }
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

        this.markers.show();
      },

      createRoadRoute: function (waypoints, i) {
        var request = {
          origin: waypoints[0],
          destination: waypoints[waypoints.length - 1],
          waypoints: $.map(waypoints, function(waypoint) {
            return { location: waypoint, stopover: false };
          }),
          travelMode: google.maps.TravelMode.WALKING,
          unitSystem: google.maps.UnitSystem.METRIC
        };

        DrawTheRoute.directionsService.route(request, function(result, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            DrawTheRoute.directionsDisplays.elements[i].setDirections(result);
            DrawTheRoute.traveledDistances[i] = result.routes[0].legs[0].distance.value;
          }
        });
      },

      drawRoute: function() {
        if (this.nodes.size() >= 2) {
          var waypoints = DrawTheRoute.waypoints.elements;
          $.each(waypoints, function (i, waypoints) {
            DrawTheRoute.createRoadRoute(waypoints, i);
          });
        }

        DrawTheRoute.markers.show();
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

    (function initializeNodes () {
      var elements = $.map(settings.nodes, function (node) {
        DrawTheRoute.nodes.push(new google.maps.LatLng(node[0], node[1]));
      });

      DrawTheRoute.draw();
    }());

    DrawTheRoute.initializeSearchBox();

    google.maps.event.addListener(DrawTheRoute.map, 'click', function(e) {
      DrawTheRoute.nodes.push(e.latLng);
      DrawTheRoute.draw();
    });

    return DrawTheRoute;
  }; // $.fn.drawTheRoute
}( jQuery ));
