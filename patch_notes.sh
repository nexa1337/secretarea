#!/bin/bash
sed -i '268,268c\
  const [notes, setNotes] = useState<Note[]>(() => {\
    const saved = localStorage.getItem("nexa_admin_notes");\
    return saved ? JSON.parse(saved) : [];\
  });' pages/PersonalFinance.tsx
