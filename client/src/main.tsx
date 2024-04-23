import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './translations/en.json';
import he from './translations/he.json';

i18n
.use(initReactI18next) // passes i18n down to react-i18next
.use(LanguageDetector)
.init({
  resources: {
    en: {
      translation: en
    },
    he: {
      translation: he
    }
  },
  fallbackLng: "en",
});

const rootElement = document.getElementById('root')!;
i18n.on('languageChanged', (lng) => {
  rootElement.dir = i18n.dir(lng);
});
rootElement.dir = i18n.dir(i18n.language);
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
