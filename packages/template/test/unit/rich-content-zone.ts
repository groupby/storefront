import RichContentZone from '../../src/rich-content-zone';
import Zone from '../../src/zone';
import suite from './_suite';

suite('RichContentZone', ({ expect }) => {
  let richContentZone: RichContentZone;

  beforeEach(() => richContentZone = new RichContentZone());

  it('should extend Zone', () => {
    expect(richContentZone).to.be.an.instanceOf(Zone);
  });
});
