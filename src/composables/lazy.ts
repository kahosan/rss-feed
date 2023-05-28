export function lazyData<T>(target: Ref<HTMLDivElement | null>, data: T[], end: number, chunkSize: number, observerOptions: IntersectionObserverInit) {
  // https://github.com/vuejs/core/issues/2136#issuecomment-908269949
  const displayData = ref(data.slice(0, end)) as Ref<T[]>

  const loadMore = () => {
    const currentLength = displayData.value.length
    const newData = data.slice(currentLength, currentLength + chunkSize)

    requestAnimationFrame(() => displayData.value.push(...newData))
  }

  const intersectionCallback = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting)
        loadMore()
    })
  }

  let cleanup: () => void

  const stopWatch = watch(
    target,
    (target) => {
      const observer = new IntersectionObserver(intersectionCallback, observerOptions)
      target && observer.observe(target)

      cleanup = () => {
        observer.disconnect()
      }
    },
    { immediate: true, flush: 'post' },
  )

  onUnmounted(() => {
    cleanup()
    stopWatch()
  })

  return displayData
}
