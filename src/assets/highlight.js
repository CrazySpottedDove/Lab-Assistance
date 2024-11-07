
const keyWords = {
	light: {
		blue: ["\\begin", "\\end"],
		lightseagreen: ["$"],
		orange: ["{", "}"],
		darkgoldenrod: ["[", "]"],
		purple: ["&", "\\\\"],
		darkcyan: [
			"\\text",
			"\\mathrm",
			"\\displaystyle",
			"\\left",
			"\\right",
			"\\framed",
			"\\notframed",
			"\\qquad",
			"\\xstyle",
			"\\ystyle",
			"\\datapoint",
			"\\functionline",
		],
		deeppink: ["(", ")"],
	},
	dark: {
		lightskyblue: ["\\begin", "\\end"],
		lightseagreen: ["$"],
		orange: ["{", "}"],
		darkgoldenrod: ["[", "]"],
		pink: ["&", "\\\\"],
		darkcyan: [
			"\\text",
			"\\mathrm",
			"\\displaystyle",
			"\\left",
			"\\right",
			"\\framed",
			"\\notframed",
			"\\qquad",
			"\\xstyle",
			"\\ystyle",
			"\\datapoint",
			"\\functionline",
		],
		deeppink: ["(", ")"],
	},
};
// 方法，用于生成高亮后的文本
const highlightKeywords = (text, theme) => {
	let content = text;

	// 遍历 keyWords 对象
	Object.entries(keyWords[theme]).forEach(([key, values]) => {
		values.forEach((value) => {
			// 对特殊字符进行转义
			const escapedValue = value.replace(
				/[-\/\\^$*+?.()|[\]{}]/g,
				"\\$&"
			);
			const regex = new RegExp(escapedValue, "gi");
			content = content.replace(
				regex,
				`<span style="color:${key};">${value}</span>`
			);
		});
	});
	return content;
};

export { highlightKeywords};
