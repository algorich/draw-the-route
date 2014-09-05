jasmine.getFixtures().fixturesPath = 'specs/fixtures';

describe('The initialization', function() {

describe('Settings initialization', function() {
  beforeEach(function() {
    loadFixtures('example.html');
  });

  it('set default settings', function() {
  it('default settings', function() {
    var dtr = $('#map-canvas').drawTheRoute();

    expect(dtr.settings.zoom).toEqual(14);
    expect(dtr.settings.center).toEqual([-15.7941454, -47.88254789999996]);
    expect(dtr.settings.attachToRoad).toEqual(true);
    expect(dtr.settings.lineColor).toEqual('#FF0000');
    expect(dtr.settings.nodes).toEqual([]);
  });

  it('can receive settings', function() {
    var dtr = $('#map-canvas').drawTheRoute({
      zoom: 10,
      center: [-14.44, -47.88],
      attachToRoad: false,
      lineColor: 'blue',
      nodes: [
        [-15.79,-47.89],[-15.70,-47.87]
      ],
    });

    expect(dtr.settings.zoom).toEqual(10);
    expect(dtr.settings.center).toEqual([-14.44, -47.88]);
    expect(dtr.settings.attachToRoad).toEqual(false);
    expect(dtr.settings.lineColor).toEqual('blue');
    expect(dtr.settings.nodes).toEqual([[-15.79,-47.89],[-15.70,-47.87]]);
  });
});

describe('Google Maps Objects Initialization', function () {
  beforeEach(function() {
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