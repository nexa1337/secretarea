const fs = require('fs');
let code = fs.readFileSync('components/CommentsSection.tsx', 'utf8');

const targetStr = `        const replyBank = [
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
        ];`;

const replacementStr = `        let replyBank = [
            "Totally agree with this!", "Thanks for the heads up.", "Same here lol.", "Interesting point!", 
            "Appreciate the info bro 🙏", "Exactly what I was looking for, thanks!", "Didn't know that, thanks for sharing.", 
            "Can confirm this works on my end too.", "Awesome, going to try this out now.", "Good to know! 🔥", 
            "I had the same issue, glad it's fixed now.", "Was wondering about this, thanks!", "Legit advice right here.", 
            "tbarkellah 3lik a khouya", "شكراً جزيلاً، جاري التجربة", "Works perfectly for me as well.", 
            "I was getting errors before but this makes sense.", "Thanks man, you saved me a lot of time.", "Bro this is actually so helpful.", 
            "Ah I see, that makes a lot of sense now.", "You're an absolute legend for this.", "Glad I scrolled down to read the comments first.", 
            "Perfect timing, I needed exactly this.", "Any idea if this works on the new update?", "Merci pour l'astuce !", 
            "¡Gracias por la información!", "This community is the best 😂", "Big if true.", "Nah I don't think that's right...", 
            "Thanks for clarifying that.", "Oh wow, I completely missed that detail.", "I've been stuck on this for hours, bless you.", 
            "Wait, really? I gotta check this.", "My antivirus is acting up but I'll trust this.", "Thanks bro, really appreciate it.", 
            "LFG! Exactly what I needed.", "Good looks. 👊", "Ayo thanks for the heads up.", "Finally a real answer.", "Super helpful, thanks!", "Good catch!",
            "This is why I love this site.", "You dropped this 👑", "Is this safe?", "I can verify this.", "Facts.", "Fr bro.", "100%", "This actually worked wtf", "Bruh thank you", "I was so confused until I read this",
            "This was super insightful, appreciate the detail.", "Took me a while to get it but this made it click.", "Can you elaborate on that a bit more?", "Man this saved my whole day.", "Such a goated reply.", "You always have the best tips here.", "I tried doing it another way and failed, this works perfectly.", "Honestly never thought about it like that before."
        ];
        
        if (itemCategory === 'game') {
            replyBank = [...replyBank, "Does this version include the latest DLC?", "My FPS dropped a bit but it's playable.", "Is this the repack version or full?", "Can I use my old saves with this?", "Multiplayer works perfectly fine guys!"];
        } else if (itemCategory === 'hypervisor') {
            replyBank = [...replyBank, "Does this bypass anti-cheat?", "Make sure to disable Secure Boot first.", "My VM is running so much smoother now.", "Did you pass through the GPU successfully?", "Is this detected by Vanguard?"];
        } else if (itemCategory === 'steamtools' || itemCategory === 'tools') {
            replyBank = [...replyBank, "This tool is a lifesaver.", "Make sure to run it as administrator.", "Does it work on Windows 11?", "False positive on VirusTotal, it's safe.", "How do I configure the settings?"];
        } else if (itemCategory === 'savegame' || itemId.startsWith('E')) {
            replyBank = [...replyBank, "100% completion? Awesome.", "Where do I put the save file?", "My game doesn't recognize the save.", "Thanks, skipping that boring tutorial now.", "Does this unlock all characters?"];
        }`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, replacementStr);
    fs.writeFileSync('components/CommentsSection.tsx', code);
    console.log("Patched successfully!");
} else {
    console.log("Could not find target string.");
}
