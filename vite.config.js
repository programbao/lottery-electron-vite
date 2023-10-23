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
export default defineConfig({
  base: './',
  plugins: [vue()],
})
