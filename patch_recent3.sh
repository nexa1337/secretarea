sed -i '3689i\
        if (["game", "hypervisor"].includes(item.category?.toLowerCase())) score += 15;
' pages/SecretArea.tsx
