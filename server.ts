import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy initialize Firebase Admin
  let adminInitialized = false;
  function ensureFirebaseAdmin() {
    if (!adminInitialized) {
      try {
        if (getApps().length === 0) {
          initializeApp({
            projectId: "secretarea-1337"
          });
        }
        adminInitialized = true;
      } catch (err) {
        console.warn("[Server] Firebase Admin initialization note:", err);
      }
    }
  }

  // Lazy initialize Gemini client
  let genAI: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!genAI) {
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is missing");
      }
      genAI = new GoogleGenAI({ apiKey });
    }
    return genAI;
  }

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Client IP and network info endpoint for browser tracking
  app.get("/api/client-info", (req, res) => {
    const forwarded = req.headers["x-forwarded-for"];
    const ip = typeof forwarded === "string" ? forwarded.split(",")[0].trim() : req.socket.remoteAddress || "127.0.0.1";
    res.json({
      ip,
      userAgent: req.headers["user-agent"] || "unknown",
      timestamp: new Date().toISOString()
    });
  });

  // Admin remove user from Firebase Auth endpoint
  app.post("/api/admin/remove-user", async (req, res) => {
    try {
      const { uid, email } = req.body;
      if (!uid) {
        return res.status(400).json({ error: "User UID is required" });
      }

      let authDeleted = false;
      let note = "";

      try {
        ensureFirebaseAdmin();
        if (getApps().length > 0) {
          await getAuth().deleteUser(uid);
          authDeleted = true;
          console.log(`[Admin API] Successfully removed user ${uid} (${email}) from Firebase Auth.`);
        } else {
          note = "Firebase Admin SDK not configured with credentials in this container.";
        }
      } catch (authErr: any) {
        console.warn(`[Admin API] Note during auth deletion for ${uid}:`, authErr?.message || authErr);
        note = authErr?.message || "Auth deletion notice";
      }

      res.json({
        success: true,
        authDeleted,
        uid,
        email,
        message: authDeleted ? "User deleted from Firebase Auth" : "User marked revoked and removed",
        note
      });
    } catch (err: any) {
      console.error("[Admin API] Error in remove-user:", err);
      res.status(500).json({ error: err?.message || "Failed to remove user" });
    }
  });

  // Request submission endpoint
  app.post("/api/submit-request", (req, res) => {
    try {
      const { title, section, imageUrl, message } = req.body;
      console.log("[Request API] Received submission:", { title, section, imageUrl, message });
      res.json({ success: true, message: "Request received successfully" });
    } catch (err: any) {
      console.error("[Request API] Error:", err);
      res.status(500).json({ error: "Failed to process request" });
    }
  });

  // speed test upload endpoint
  app.post("/upload", (req, res) => {
    req.on("data", () => {});
    req.on("end", () => res.send("ok"));
  });

  // Server-side Gemini chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }

      const ai = getGeminiClient();
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: message,
        config: {
          systemInstruction: "You are NEXA, the AI assistant for N E X A 1337's personal portfolio and secret area platform. Answer questions professionally, concisely, and helpfully.",
        },
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error("Gemini API server error:", err);
      res.status(500).json({ error: err?.message || "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
