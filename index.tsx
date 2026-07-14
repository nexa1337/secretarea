window.addEventListener("error", (e) => { if (e.message && e.message.includes("WebSocket")) e.preventDefault(); });
window.addEventListener("unhandledrejection", (e) => { if (e.reason && (String(e.reason).includes("WebSocket") || (e.reason.message && e.reason.message.includes("WebSocket")))) e.preventDefault(); });

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
