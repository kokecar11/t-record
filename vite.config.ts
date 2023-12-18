import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { partytownVite } from "@builder.io/partytown/utils";
import { join } from "path";

export default defineConfig(() => {
  return {
    optimizeDeps:{
      include:["@supabase/supabase-js", "@supabase/auth-helpers-shared", "cross-fetch", "@auth/core"]
    },
    // resolve: {
    //   alias: {
    //     ".prisma/client/index-browser": "./node_modules/.prisma/client/index-browser.js"
    //   }
    // },
    plugins: [
      qwikCity(),
      qwikVite(),
      tsconfigPaths(),
      partytownVite({ dest: join(__dirname, "dist", "~partytown") }),
    ],
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
      },
    },
  };
});
