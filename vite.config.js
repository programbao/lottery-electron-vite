import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import optimizer from "vite-plugin-optimizer";
// let getReplacer = () => {
//   let externalModels = ["electron", "os", "fs", "path", "events", "child_process", "crypto", "http", "buffer", "url", "better-sqlite3", "knex"];
//   let result = {};
//   for (let item of externalModels) {
//     result[item] = () => ({
//       find: new RegExp(`^${item}$`),
//       code: `const ${item} = require('${item}');export { ${item} as default }`,
//     });
//   }
//   return result;
// };
// https://vitejs.dev/config/
import path from "path"
export default defineConfig({
  base: './',
  plugins: [vue()],
  resolve: {
    alias: [{
      find: "@",
      replacement: path.resolve(__dirname, '/src/')
      //为 /src配置别名@
    }]
  }
})
