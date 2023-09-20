export interface RssData {
  'unknownURI': string[]
  'unknownDate': UnknownDate
  contents: RssContents[]
}

export type UnknownDate = Omit<RssEntry, 'published' | 'monthDay'>[]

export interface RssContents {
  year: number
  month: number
  entries: RssEntry[]
}

export interface RssEntry {
  id: string
  siteTitle: string
  postTitle: string
  siteLink: string
  postLink: string
  published: Date | string
  description: string
  monthDay: string
  groupBy?: string
}

export interface RssGroup {
  name: string
  items: RssGroupItem[]
}

export interface RssGroupItem {
  title: string
  link: string
  description: string
}
