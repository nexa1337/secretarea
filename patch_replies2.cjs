const fs = require('fs');
let code = fs.readFileSync('components/CommentsSection.tsx', 'utf8');

const targetStr = `        const fakeReplies: CommentReply[] = [];
        for (let j = 0; j < numReplies; j++) {
            const rd = new Date(d);
            rd.setHours(rd.getHours() + Math.floor(seededRandom(seed + 11 + j) * 24) + 1);
            fakeReplies.push({
                id: \`fake-reply-\${itemId}-\${i}-\${j}\`,
                author: \`User_\${Math.floor(seededRandom(seed + 12 + j) * 9999)}\`,
                text: [
                    "Totally agree with this!", "Thanks for the heads up.", "Same here lol.", "Interesting point!", 
                    "Appreciate the info bro 🙏", "Exactly what I was looking for, thanks!", "Didn't know that, thanks for sharing.", 
                    "Can confirm this works on my end too.", "Awesome, going to try this out now.", "Good to know! 🔥", 
                    "I had the same issue, glad it's fixed now.", "Was wondering about this, thanks!", "Legit advice right here.", 
                    "tbarkellah 3lik a khouya", "شكراً جزيلاً، جاري التجربة", "Works perfectly for me as well.", 
                    "I was getting errors before but this makes sense.", "Thanks man, you saved me a lot of time.", "Bro this is actually so helpful.", 
                    "Does anyone know if this affects performance?", "Wait, how do I do that exactly?", "Just tested it, can confirm it's legit.", 
                    "Ah I see, that makes a lot of sense now.", "You're an absolute legend for this.", "Glad I scrolled down to read the comments first.", 
                    "Perfect timing, I needed exactly this.", "Any idea if this works on the new update?", "Merci pour l'astuce !", 
                    "¡Gracias por la información!", "This community is the best 😂", "Big if true.", "Nah I don't think that's right...", 
                    "Thanks for clarifying that.", "Oh wow, I completely missed that detail.", "I've been stuck on this for hours, bless you.", 
                    "Wait, really? I gotta check this.", "My antivirus is acting up but I'll trust this.", "Thanks bro, really appreciate it.", 
                    "LFG! Exactly what I needed.", "Good looks. 👊", "Ayo thanks for the heads up.", "Finally a real answer.", "Super helpful, thanks!", "Good catch!",
                    "This is why I love this site.", "You dropped this 👑", "Is this safe?", "I can verify this.", "Facts.", "Fr bro.", "100%", "This actually worked wtf", "Bruh thank you", "I was so confused until I read this"
                ][Math.floor(seededRandom(seed + 13 + j) * 54)],
                timestamp: rd.toISOString(),
                reactions: {
                    like: Math.floor(seededRandom(seed + 14 + j) * 10),
                    dislike: 0,
                    love: 0
                }
            });
        }`;

const replacementStr = `        const fakeReplies: CommentReply[] = [];
        
        const replyBank = [
            "Totally agree with this!", "Thanks for the heads up.", "Same here lol.", "Interesting point!", 
            "Appreciate the info bro 🙏", "Exactly what I was looking for, thanks!", "Didn't know that, thanks for sharing.", 
            "Can confirm this works on my end too.", "Awesome, going to try this out now.", "Good to know! 🔥", 
            "I had the same issue, glad it's fixed now.", "Was wondering about this, thanks!", "Legit advice right here.", 
            "tbarkellah 3lik a khouya", "شكراً جزيلاً، جاري التجربة", "Works perfectly for me as well.", 
            "I was getting errors before but this makes sense.", "Thanks man, you saved me a lot of time.", "Bro this is actually so helpful.", 
            "Does anyone know if this affects performance?", "Wait, how do I do that exactly?", "Just tested it, can confirm it's legit.", 
            "Ah I see, that makes a lot of sense now.", "You're an absolute legend for this.", "Glad I scrolled down to read the comments first.", 
            "Perfect timing, I needed exactly this.", "Any idea if this works on the new update?", "Merci pour l'astuce !", 
            "¡Gracias por la información!", "This community is the best 😂", "Big if true.", "Nah I don't think that's right...", 
            "Thanks for clarifying that.", "Oh wow, I completely missed that detail.", "I've been stuck on this for hours, bless you.", 
            "Wait, really? I gotta check this.", "My antivirus is acting up but I'll trust this.", "Thanks bro, really appreciate it.", 
            "LFG! Exactly what I needed.", "Good looks. 👊", "Ayo thanks for the heads up.", "Finally a real answer.", "Super helpful, thanks!", "Good catch!",
            "This is why I love this site.", "You dropped this 👑", "Is this safe?", "I can verify this.", "Facts.", "Fr bro.", "100%", "This actually worked wtf", "Bruh thank you", "I was so confused until I read this",
            "This was super insightful, appreciate the detail.", "Took me a while to get it but this made it click.", "Can you elaborate on that a bit more?", "Man this saved my whole day.", "Such a goated reply.", "You always have the best tips here.", "I tried doing it another way and failed, this works perfectly.", "Honestly never thought about it like that before."
        ];
        
        for (let j = 0; j < numReplies; j++) {
            const rd = new Date(d);
            rd.setHours(rd.getHours() + Math.floor(seededRandom(seed + 11 + j) * 24) + 1);
            
            // Smart author name generation for replies
            const rSeed = seed + 12 + j;
            let rAuthorStr = '';
            let rLoopSafe = 0;
            do {
                const tempSeed = rSeed + rLoopSafe * 13;
                const rNameAdjIdx = Math.floor(seededRandom(tempSeed) * NAME_ADJECTIVES.length);
                const rNameNounIdx = Math.floor(seededRandom(tempSeed + 1) * NAME_NOUNS.length);
                const rNameSuffix = Math.floor(seededRandom(tempSeed + 2) * 9999);
                rAuthorStr = \`\${NAME_ADJECTIVES[rNameAdjIdx]}_\${NAME_NOUNS[rNameNounIdx]}\${rNameSuffix}\`;
                rLoopSafe++;
            } while ((usedAuthors.has(rAuthorStr) || rAuthorStr === authorStr) && rLoopSafe < 10);
            usedAuthors.add(rAuthorStr);

            const rText = replyBank[Math.floor(seededRandom(seed + 13 + j) * replyBank.length)];

            fakeReplies.push({
                id: \`fake-reply-\${itemId}-\${i}-\${j}\`,
                author: rAuthorStr,
                text: rText,
                timestamp: rd.toISOString(),
                reactions: {
                    like: Math.floor(seededRandom(seed + 14 + j) * 10),
                    dislike: 0,
                    love: 0
                }
            });
        }`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, replacementStr);
    fs.writeFileSync('components/CommentsSection.tsx', code);
    console.log("Patched successfully!");
} else {
    console.log("Could not find target string.");
}
