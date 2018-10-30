import TerminalPager from '../../src/terminal-pager';
import suite from './_suite';

suite('Terminal Pager', ({ expect, spy, stub, itShouldBeConfigurable, itShouldConsumeAlias }) => {
  itShouldConsumeAlias(TerminalPager, 'paging');
});
