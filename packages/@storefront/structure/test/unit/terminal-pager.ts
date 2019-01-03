import TerminalPager from '../../src/terminal-pager';
import suite from './_suite';

suite('Terminal Pager', ({ itShouldConsumeAlias }) => {
  itShouldConsumeAlias(TerminalPager, 'paging');
});
