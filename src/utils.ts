const pattern = /<!\[CDATA+\[(.*?)\]\]>/

export function normalizationTitle(title: string) {
  const match = pattern.exec(title)?.at(1)?.trim()
  return match ?? title
}
