sed -i '3678,3685c\
    const scoredItems = all.map(item => {\
        let score = 0;\
        let d = 0;\
        if (item.dateAdded) {\
            if (!isNaN(Number(item.dateAdded))) d = Number(item.dateAdded);\
            else d = new Date(item.dateAdded).getTime();\
        }\
        if (!isNaN(d) && d > 0) {\
            const daysOld = (Date.now() - d) / (1000 * 60 * 60 * 24);\
            score += Math.max(0, 100 - (daysOld * 0.5));\
        }\
' pages/SecretArea.tsx
