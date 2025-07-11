import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add error handling for mobile compatibility
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Ensure the app loads even if there are minor errors
try {
  const root = createRoot(rootElement);
  root.render(<App />);
} catch (error) {
  console.error('Failed to render app:', error);
  // Fallback: show a simple message
  rootElement.innerHTML = `
    <div style="
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      background: linear-gradient(135deg, #f3e8ff 0%, #fbc2eb 50%, #e0e7ef 100%);
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 20px;
    ">
      <div>
        <h1 style="color: #7c3aed; margin-bottom: 20px;">Laila Mohamed Fikry</h1>
        <p style="color: #6b7280; margin-bottom: 20px;">Portfolio loading...</p>
        <button onclick="window.location.reload()" style="
          background: linear-gradient(135deg, #a78bfa 0%, #f472b6 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        ">Refresh Page</button>
      </div>
    </div>
  `;
}
