// src/routes.jsx
import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from "react-router-dom";

// If your components are default exports, import without braces:
import Home from "./pages/Home.jsx";
import Private from "./pages/Private.jsx";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<Home />} />
      <Route path="private" element={<Private />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  )
);
