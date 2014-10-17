/*global jasmine*/
/*global it*/
/*global describe*/
/*global beforeEach*/
/*global expect*/
/*global loadFixtures*/

jasmine.getFixtures().fixturesPath = 'specs/fixtures';

describe('Settings initialization', function () {
  beforeEach(function () {
    loadFixtures('example.html');
  });

  it('default settings', function () {
    var dtr = $('#map-canvas').drawTheRoute();

    expect(dtr.settings.zoom).toEqual(14);
    expect(dtr.settings.center).toEqual([-15.7941454, -47.88254789999996]);
    expect(dtr.settings.attachToRoad).toEqual(true);
    expect(dtr.settings.lineColor).toEqual('#FF0000');
    expect(dtr.settings.nodes).toEqual([]);
  });

  it('can receive settings', function () {
    var dtr = $('#map-canvas').drawTheRoute({
      zoom: 10,
      center: [-14.44, -47.88],
      attachToRoad: false,
      lineColor: 'blue',
      nodes: [
        [-15.79, -47.89], [-15.70, -47.87]
      ],
    });

    expect(dtr.settings.zoom).toEqual(10);
    expect(dtr.settings.center).toEqual([-14.44, -47.88]);
    expect(dtr.settings.attachToRoad).toEqual(false);
    expect(dtr.settings.lineColor).toEqual('blue');
    expect(dtr.settings.nodes).toEqual([[-15.79, -47.89], [-15.70, -47.87]]);
  });
});

describe('Google Maps Objects Initialization', function () {
  beforeEach(function () {
    loadFixtures('example.html');

    this.dtr = $('#map-canvas').drawTheRoute();
  });

  it('with default map center object', function () {
    expect(this.dtr.map.center.k).toEqual(-15.7941454);
    expect(this.dtr.map.center.B).toEqual(-47.88254789999996);
  });

  it('with default map zoom object (delegated to settings#zoom)', function () {
    expect(this.dtr.map.zoom).toEqual(14);
  });

  it('has map mapTypeId', function () {
    expect(this.dtr.map.zoom).toEqual(14);
  });

  it('has directionsService object', function () {
    expect(this.dtr.directionsService).toEqual(jasmine.any(Object));
  });

  it('has directionsDisplay object', function () {
    expect(this.dtr.directionsDisplay).toEqual(jasmine.any(Object));
  });

  it('has markers list', function () {
    expect(this.dtr.markers).toEqual([]);
  });
});

describe('Nodes object functions', function () {
  beforeEach(function () {
    loadFixtures('example.html');

    this.dtr = $('#map-canvas').drawTheRoute();

    this.dtr.nodes.elements = [1, 3, 4];
  });

  describe('last', function () {
    it('without params', function () {
      expect(this.dtr.nodes.last()).toEqual(4);
    });

    it('with params', function () {
      expect(this.dtr.nodes.last(2)).toEqual(3);
    });
  });

  it('first', function () {
    expect(this.dtr.nodes.first()).toEqual(1);
  });

  it('all', function () {
    expect(this.dtr.nodes.all()).toEqual([1, 3, 4]);
  });

  // it('waypoints', function () {
  //   expect(this.dtr.nodes.waypoints()).toEqual([3, 4]);
  // });

  it('push', function () {
    this.dtr.nodes.push(10);

    expect(this.dtr.nodes.elements).toEqual([1, 3, 4, 10]);
  });

  it('pop', function () {
    this.dtr.nodes.pop();

    expect(this.dtr.nodes.elements).toEqual([1, 3]);
  });

  describe('buildWaypointsList', function () {
    it('with 1 nodes', function () {
      this.dtr.nodes.elements = [1];

      expect(this.dtr.nodes.buildWaypointsList()).toEqual([]);
    });

    it('with 2 nodes', function () {
      this.dtr.nodes.elements = [1, 2];

      expect(this.dtr.nodes.buildWaypointsList()).toEqual(
        [
          [1, 2]
        ]
      );
    });

    it('with 15 nodes', function () {
      this.dtr.nodes.elements = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                                 11, 12, 13, 14, 15];

      expect(this.dtr.nodes.buildWaypointsList()).toEqual(
        [
          [1,  2,  3,  4,  5,  6,  7,  8],
          [8,  9, 10, 11, 12, 13, 14, 15]
        ]
      );
    });

    it('with 16 nodes', function () {
      this.dtr.nodes.elements = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                                 11, 12, 13, 14, 15, 16];

      expect(this.dtr.nodes.buildWaypointsList()).toEqual(
        [
          [1,  2,  3,  4,  5,  6,  7,  8],
          [8,  9, 10, 11, 12, 13, 14, 15],
          [15, 16]
        ]
      );
    });
  });
});
