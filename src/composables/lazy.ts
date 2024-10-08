export function lazyData<T>(target: Ref<HTMLDivElement | null>, data: Ref<T[]>, end: number, chunkSize: number, observerOptions?: IntersectionObserverInit) {
  // https://github.com/vuejs/core/issues/2136#issuecomment-908269949
  const displayData = ref([]) as Ref<T[]>

  watch(
    data,
    newData => displayData.value = newData.slice(0, end),
    { immediate: true },
  )

  const loadMore = () => {
    const currentLength = displayData.value.length
    const newData = data.value.slice(currentLength, currentLength + chunkSize)

    requestAnimationFrame(() => displayData.value.push(...newData))
  }

  const intersectionCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting)
        loadMore()
    })
  }

  watch(
    target,
    (target) => {
      const observer = new IntersectionObserver(intersectionCallback, observerOptions)
      if (target)
        observer.observe(target)
    },
    { immediate: true, flush: 'post' },
  )

  return displayData
}
