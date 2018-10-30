import * as sinon from 'sinon';
import Zone from '../../src/zone';
import suite from './_suite';

class MockZone extends Zone {}

suite('Zone', ({ expect, spy }) => {
  let mockZone: MockZone;

  beforeEach(() => (mockZone = new MockZone()));

  describe('init()', () => {
    it('should provide $zone alias', () => {
      const provide = (mockZone.provide = spy());

      mockZone.init();

      expect(provide).to.be.calledWith('zone');
    });
  });
});
