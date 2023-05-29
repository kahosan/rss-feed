import type Fuse from 'fuse.js'
import type { RssEntry } from './rss'

export interface FuseOptions extends Fuse.IFuseOptions<RssEntry> {
  keys?: string[]
}
