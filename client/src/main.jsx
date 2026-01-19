import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "react-day-picker/style.css";
import 'leaflet/dist/leaflet.css';
import './index.css'
import App from './App.jsx'
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./apollo/client";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
