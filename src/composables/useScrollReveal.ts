import { onMounted, onUnmounted } from 'vue'

export function useScrollReveal(selector = '.reveal') {
    let observer: IntersectionObserver

    onMounted(() => {
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed')
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.15 }
        )

        document.querySelectorAll<HTMLElement>(selector).forEach((el) => observer.observe(el))
    })

    onUnmounted(() => observer?.disconnect())
}
