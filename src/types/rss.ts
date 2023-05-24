export interface RssData {
  'unknownURI': string[]
  'unknownDate': Omit<RssEntry, 'published'>[]
  contents: {
    [year: string]: RssMonth
  }
}

export interface RssMonth {
  [monthDay: string]: {
    entries: RssEntry[]
  }
}

export interface RssEntry {
  id: string
  siteTitle: string
  postTitle: string
  siteLink: string
  postLink: string
  published: Date | undefined
  description: string
}
