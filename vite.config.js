import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

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
		terserOptions: {
			// compress: {
			// 	// 禁用压缩选项，确保不会移除或改变变量和函数名
			// 	// keep_classnames: true,
			// 	// keep_fnames: true,
			// 	// properties: {
			// 	// 	keep_quoted: true, // 保留属性名，只处理引号中的属性
			// 	// },
			// },
			// mangle: false, // 禁用混淆，保持变量和属性名不被改变
		},
		minify: "terser", // 使用 terser 进行最小化
		rollupOptions: {
			output: {
				entryFileNames: "assets/[name].js", // 保持入口文件名不变
				chunkFileNames: "assets/[name].js", // 保持代码分块文件名不变
				assetFileNames: "assets/[name][extname]", // 保持静态资源文件名不变
			},
		},
		assetsDir: "assets", // 静态资源存放目录
	},
	base: "./",
});
