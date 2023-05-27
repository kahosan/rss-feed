export function lazyData<T>(target: Ref<HTMLDivElement | null>, data: T[], end: number, chunkSize: number, observerOptions: IntersectionObserverInit) {
  const displayData = ref(data.slice(0, end))

  const loadMore = () => {
    const currentLength = displayData.value.length
    const newData = ref(data.slice(currentLength, currentLength + chunkSize))

    requestAnimationFrame(() => {
      displayData.value.push(...newData.value)
    })
  }

  // 分段加载数据
  const observer = ref<IntersectionObserver | null>(null)

  const intersectionCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting)
        loadMore()
    })
  }

  onMounted(() => {
    observer.value = new IntersectionObserver(intersectionCallback, observerOptions)
    if (target.value)
      observer.value.observe(target.value)
  })

  onUnmounted(() => {
    if (observer.value && target.value) {
      observer.value.unobserve(target.value)
      observer.value.disconnect()
    }
  })

  return displayData
}
