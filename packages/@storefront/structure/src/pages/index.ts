import { consume, tag, Tag } from '@storefront/core';

@consume('paging')
@tag('gb-pages', require('./index.html'))
class Pages {}

interface Pages extends Tag {}

export default Pages;
