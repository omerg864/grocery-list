import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from "vite-plugin-pwa";

const manifestForPlugIn = {
  manifest:{
    name:"Super Cart",
    short_name:"Super Cart",
    description:"Super Cart - Super Fast Shopping",
    icons: [
      {
        "src": "icon192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "icon512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any maskable"
      }
    ],
  theme_color:'#213547',
  background_color:'#213547',
  scope:'/',
  start_url:"/"
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugIn)],
})
