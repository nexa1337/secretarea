const fs = require('fs');
let code = fs.readFileSync('components/CommentsSection.tsx', 'utf8');

const oldCode = `text: ["Totally agree with this!", "Thanks for the heads up.", "Same here lol.", "Interesting point!"][Math.floor(seededRandom(seed + 13 + j) * 4)],`;
const newCode = `text: [
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
                ][Math.floor(seededRandom(seed + 13 + j) * 54)],`;

if (code.includes(oldCode)) {
  code = code.replace(oldCode, newCode);
  fs.writeFileSync('components/CommentsSection.tsx', code);
  console.log("Successfully patched replies");
} else {
  console.log("Old code not found");
}
