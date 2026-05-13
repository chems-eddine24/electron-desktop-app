import { defineConfig } from "rolldown";
import { esmExternalRequirePlugin } from "rolldown/plugins";

export default defineConfig({
    input: "electron/main.js",
    output: {
        dir: "dist-electron",
        format: "cjs",
    },
    plugins: [
        esmExternalRequirePlugin({
            external: [
                "electron",
                "dotenv",
                "pg",
                "path",
                "fs",
                "os",
                "url",
                "crypto",
                "net",
                "tls",
                "dns",
                "events",
                "util",
                "stream",
                "string_decoder",
                /^node:/,
            ],
        }),
    ],
});