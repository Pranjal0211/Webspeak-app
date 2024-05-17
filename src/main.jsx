import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './pages/Home/Home.jsx';
import T2S from './pages/T2S/T2S.jsx';
import WebT2S from './pages/WebT2S/WebT2S.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/T2S",
    element: <T2S/>,
  },
  {
    path: "/WebT2S",
    element: <WebT2S/>,
  }
]);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
