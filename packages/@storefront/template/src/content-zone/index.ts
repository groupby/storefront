import { tag } from '@storefront/core';
import Zone from '../zone';

@tag('gb-content-zone', '{ props.zone.content }')
export default class ContentZone extends Zone {}
