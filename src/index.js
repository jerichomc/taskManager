import React from "react";
import ReactDOM from "react-dom/client"; // Import from 'react-dom/client' for React 18
import App from "./App"; // Import the App component
import './index.css'; // Import global styles

// Use createRoot instead of render
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
