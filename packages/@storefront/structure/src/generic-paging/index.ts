import { provide, tag, Tag } from '@storefront/core';

@provide('paging')
@tag('gb-generic-paging', require('./index.html'))
class GenericPaging {

}

interface GenericPaging extends Tag {}

export default GenericPaging;
