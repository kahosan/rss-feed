export interface RssData {
  unknownURL: string[]
  unknownDate: UnknownDate[]
  contents: Feed[]
  collects: FeedCollect[]
}

export type UnknownDate = Omit<Feed, 'postPublished'>

export interface Feed {
  id: string
  feedTitle: string
  feedLink: string
  postTitle: string
  postLink: string
  postDescription: string
  postPublished: Date | string
  groupBy?: string
  hidden?: boolean
}

export interface FeedCollect {
  title: string
  link: string
  groupBy?: string
}

export interface FeedGroup {
  name: string
  items: FeedGroupItem[]
}

export interface FeedGroupItem {
  title: string
  hidden: boolean
}
