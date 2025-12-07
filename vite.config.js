import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  base: "/",

  // 👇 This embeds your backend API URL into the build
  define: {
    "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
      "https://contact-backend-v7b0.onrender.com"
    ),
  },
})