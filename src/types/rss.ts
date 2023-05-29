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
}
