import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

// // chat
// import {resolve} from 'path'
// // chat
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		AutoImport({
			resolvers: [ElementPlusResolver()],
		}),
		Components({
			resolvers: [ElementPlusResolver()],
		}),
	],
	build: {
		// minify: 'esbuild', // 使用 esbuild 压缩，Vite 默认的压缩工具
		// esbuild: {
		// // mangleProps: false, // 禁用 esbuild 的变量名压缩
		// keepNames: true
		// },
		// // chat
		// outDir:'dist',
		// rollupOptions:{
		//     input:{
		//         main: resolve(__dirname, 'index.html')
		//     }
		// }
		// // chat
		terserOptions: {
			compress: {
				// 禁用压缩选项，确保不会移除或改变变量和函数名
				keep_classnames: true,
				keep_fnames: true,
				properties: {
					keep_quoted: true, // 保留属性名，只处理引号中的属性
				},
			},
			mangle: false, // 禁用混淆，保持变量和属性名不被改变
		},
		minify: "terser", // 使用 terser 进行最小化
	},
	base: "./",
});
