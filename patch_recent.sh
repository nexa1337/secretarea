sed -i '3659,3676c\
  const recentProducts = useMemo(() => {\
    let all: ResourceItem[] = [];\
    ["game", "hypervisor", "steamtools", "architect", "extra"].forEach(cat => {\
        all = all.concat(allResources[cat] || []);\
    });\
    const scoredItems = all.map(item => {\
        let score = 0;\
        const d = new Date(item.dateAdded || 0).getTime();\
        if (!isNaN(d) && d > 0) {\
            const daysOld = (Date.now() - d) / (1000 * 60 * 60 * 24);\
            score += Math.max(0, 100 - (daysOld * 0.5));\
        }\
        if (["game", "hypervisor"].includes(item.category?.toLowerCase())) score += 15;\
        if (item.coverImage && !item.coverImage.includes("placehold.co")) score += 10;\
        if (item.ratingPositive && !isNaN(parseInt(item.ratingPositive))) {\
            const p = parseInt(item.ratingPositive);\
            if (p > 90) score += 20;\
            else if (p > 80) score += 10;\
            else if (p > 70) score += 5;\
        }\
        return { item, score, d };\
    });\
    return scoredItems.sort((a, b) => {\
        if (b.score !== a.score) return b.score - a.score;\
        if (!isNaN(a.d) && !isNaN(b.d)) return b.d - a.d;\
        return 0;\
    }).map(s => s.item).slice(0, 20);\
  }, [allResources]);\
' pages/SecretArea.tsx
