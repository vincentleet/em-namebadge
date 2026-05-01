import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** GitHub project Pages URL is /<repo>/; Actions sets REPO_NAME to the repo slug. */
function productionBase() {
  const slug = process.env.REPO_NAME?.trim();
  if (slug) return `/${slug}/`;
  return "/Escape-Masters-Name-Badge-Customiser/";
}

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? productionBase() : "/",
  plugins: [react()],
}));
