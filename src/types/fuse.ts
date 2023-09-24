import type Fuse from 'fuse.js'
import type { Feed } from './feeds'

export interface FuseOptions extends Fuse.IFuseOptions<Feed> {
  keys?: string[]
  post?: boolean
}
