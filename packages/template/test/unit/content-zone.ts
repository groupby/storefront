import ContentZone from '../../src/content-zone';
import Zone from '../../src/zone';
import suite from './_suite';

suite('ContentZone', ({ expect }) => {
  let contentZone: ContentZone;

  beforeEach(() => contentZone = new ContentZone());

  it('should extend Zone', () => {
    expect(contentZone).to.be.an.instanceOf(Zone);
  });
});
