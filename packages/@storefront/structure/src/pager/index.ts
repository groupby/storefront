import { consume, tag, Tag } from '@storefront/core';

@consume('paging')
@tag('gb-pager', require('./index.html'))
class Pager {}

interface Pager extends Tag {}

export default Pager;
