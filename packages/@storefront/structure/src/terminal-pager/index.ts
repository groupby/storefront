import { consume, tag, Tag } from '@storefront/core';

@consume('paging')
@tag('gb-terminal-pager', require('./index.html'))
class TerminalPager {}

interface TerminalPager extends Tag {}

export default TerminalPager;
