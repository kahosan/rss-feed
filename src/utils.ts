export function normalizationTitle(title: string) {
  const pattern = /<!\[CDATA+\[(.*?)\]\]>/

  const match = pattern.exec(title)?.at(1)?.trim()
  return match ?? title
}
