import * as pkg from '../../src';
import ContentZone from '../../src/content-zone';
import Template from '../../src/template';
import suite from './_suite';

suite('package', ({ expect }) => {
  it('should expose Template', () => {
    expect(pkg.Template).to.eq(Template);
  });

  it('should expose ContentZone', () => {
    expect(pkg.ContentZone).to.eq(ContentZone);
  });
});
