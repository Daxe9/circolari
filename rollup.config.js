export default {
    input: "src/main.js",
    output: {
        file: "dist/bundle.js",
        format: "es",
    },
    external: ["fs/promises", "axios", "jsdom", "dotenv", "path"],
};
