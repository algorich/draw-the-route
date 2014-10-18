/*global jasmine*/
/*global it*/
/*global describe*/
/*global beforeEach*/
/*global expect*/
/*global loadFixtures*/

jasmine.getFixtures().fixturesPath = 'specs/fixtures';

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
