jasmine.getFixtures().fixturesPath = 'specs/fixtures';

describe('The initialization', function() {

  beforeEach(function() {
    loadFixtures('example.html');
  });

  it('set default settings', function() {
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
