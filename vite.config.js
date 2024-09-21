import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [
                ElementPlusResolver(),
            ],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
    build: {
        minify: 'esbuild', // 使用 esbuild 压缩，Vite 默认的压缩工具
        esbuild: {
        mangleProps: false, // 禁用 esbuild 的变量名压缩
        },
    },
    base:'./'
})
