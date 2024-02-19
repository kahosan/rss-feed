import type { IFuseOptions } from 'fuse.js'
import type { Feed } from './feeds'

export interface FuseOptions extends IFuseOptions<Feed> {
  keys?: string[]
  post?: boolean
}
