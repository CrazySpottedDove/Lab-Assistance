const greekLetters = {
	α: "\\alpha ",
	β: "\\beta ",
	γ: "\\gamma ",
	δ: "\\delta ",
	ε: "\\epsilon ",
	ζ: "\\zeta ",
	η: "\\eta ",
	θ: "\\theta ",
	ι: "\\iota ",
	κ: "\\kappa ",
	λ: "\\lambda ",
	μ: "\\mu ",
	ν: "\\nu ",
	ξ: "\\xi ",
	ο: "\\omicron ",
	π: "\\pi ",
	ρ: "\\rho ",
	σ: "\\sigma ",
	τ: "\\tau ",
	υ: "\\upsilon ",
	φ: "\\phi ",
	χ: "\\chi ",
	ψ: "\\psi ",
	ω: "\\omega ",
	Δ: "\\Delta ",
	Θ: "\\Theta ",
	Λ: "\\Lambda ",
	Ξ: "\\Xi ",
	Π: "\\Pi ",
	Σ: "\\Sigma ",
	Φ: "\\Phi ",
	Ψ: "\\Psi ",
	Ω: "\\Omega ",
};

const chinese = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]+/g;

/**所有的运算符 */
const operators = [
	"+",
	"-",
	"*",
	"/",
	"^",
	"abs",
	"ln",
	"lg",
	"NEG",
	"sqrt",
	"CROSS",
	"asin",
	"acos",
	"atan",
	"sin",
	"cos",
	"tan",
];

/**所有的单目运算符 */
const unaryOperators = [
	"abs",
	"ln",
	"lg",
	"NEG",
	"sqrt",
	"asin",
	"acos",
	"atan",
	"sin",
	"cos",
	"tan",
];

/**所有运算符的优先级 */
const precedence = {
	"+": 1,
	"-": 1,
	"*": 2,
	CROSS: 2,
	"/": 2,
	"^": 3,
	abs: 4,
	ln: 4,
	lg: 4,
	sqrt: 4,
	sin: 4,
	cos: 4,
	tan: 4,
	asin: 4,
	acos: 4,
	atan: 4,
	NEG: 5,
};

/**保护title时的算符映射规则 */
const replacements = {
	"'": "_APOSTROPHE_",
	",": "_COMMA_",
	"+": "_ADD_",
	"-": "_SUBTRACT_",
	"*": "_MULTIPLY_",
	"/": "_DIVIDE_",
	"^": "_POW_",
	ln: "_LN_",
	log: "_LOG_",
	lg: "_LG_",
	sin: "_SIN_",
	cos: "_COS_",
	tan: "_TAN_",
	asin: "_ASIN_",
	acos: "_ACOS_",
	atan: "_ATAN_",
	abs: "_ABS_",
	sqrt: "_SQRT_",
	"[": "_LEFTBRACKET_",
	"]": "_RIGHTBRACKET_",
	"{": "_LEFTBRACE_",
	"}": "_RIGHTBRACE_",
	";": "_SEMICOLON_",
	".": "_PERIOD_",
	"(": "_LEFTPARENTHESIS_",
	")": "_RIGHTPARENTHESIS_",
	"\\": "_BACKSLASH_",
	" ": "_SPACE_",
};

/**恢复title时的反映射规则 */
const reverseReplacements = Object.fromEntries(
	Object.entries(replacements).map(([key, value]) => [value, key])
);

/**保护title时的正则表达式 */
const protectReg = new RegExp(
	Object.keys(replacements)
		.map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
		.join("|"),
	"g"
);

/**恢复title时的正则表达式 */
const restoreReg = new RegExp(Object.keys(reverseReplacements).join("|"), "g");

/**将字符串表达式转化成数组表达式用的正则表达式 */
const tokenizeReg = new RegExp(
	operators.map((op) => op.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") +
		"|[()+\\-*/^]|[^()+\\-*/^\\s]+",
	"g"
);
// 表达式树的节点类
class ExpressionNode {
	constructor(value) {
		this.value = value;
		this.left = null;
		this.right = null;
	}
}

/** 判断是否是运算符*/
function isOperator(token) {
	return operators.includes(token);
}

/** 判断是否是一元运算符*/
function isUnaryOperator(token) {
	return unaryOperators.includes(token);
}

/**判断运算符的优先级(大于等于) */
function hasGEPrecedence(op1, op2) {
	return precedence[op1] >= precedence[op2];
}

/** 将字符串表达式转化成数组表达式 */
function tokenize(expression) {
	// 返回所有匹配的 token 数组
	return expression.match(tokenizeReg);
}

// 将中缀表达式转化成后缀表达式
function infixToPostfix(infixTokens) {
	const outputQueue = [];
	const operatorStack = [];

	infixTokens.forEach((token, index) => {
		if (isOperator(token)) {
			// 处理运算符，考虑运算符优先级
			while (
				operatorStack.length > 0 &&
				isOperator(operatorStack[operatorStack.length - 1]) &&
				hasGEPrecedence(operatorStack[operatorStack.length - 1], token)
			) {
				outputQueue.push(operatorStack.pop());
			}
			operatorStack.push(token);
		} else if (token === "(") {
			operatorStack.push(token);
		} else if (token === ")") {
			// 处理右括号，直到找到左括号
			while (
				operatorStack.length > 0 &&
				operatorStack[operatorStack.length - 1] !== "("
			) {
				outputQueue.push(operatorStack.pop());
			}
			operatorStack.pop(); // 弹出左括号
		} else {
			// 处理操作数和变量
			outputQueue.push(token);
		}

		// 检查是否是单目负号
		if (
			token === "-" &&
			(index === 0 ||
				isOperator(infixTokens[index - 1]) ||
				infixTokens[index - 1] === "(")
		) {
			operatorStack.pop("-");
			operatorStack.push("NEG"); // 将单目负号视为单独的操作符
		}
	});

	// 将剩余的操作符加入输出队列
	while (operatorStack.length > 0) {
		outputQueue.push(operatorStack.pop());
	}

	return outputQueue;
}

// 基于后缀表达式构建表达式树
function constructExpressionTree(postfixTokens) {
	const stack = [];

	postfixTokens.forEach((token) => {
		if (isOperator(token)) {
			// 运算符节点，弹出操作数节点作为子节点
			const node = new ExpressionNode(token);

			if (isUnaryOperator(token)) {
				node.left = stack.pop(); // 一元运算符只有一个操作数
			} else {
				node.right = stack.pop(); // 二元运算符的右子节点
				node.left = stack.pop(); // 二元运算符的左子节点
			}
			stack.push(node);
		} else {
			stack.push(new ExpressionNode(token));
		}
	});

	return stack.pop(); // 栈中的最后一个节点是表达式树的根节点
}

function processExpressionTree(node) {
	if (!node) {
		return "";
	}
	if (!node.left && !node.right) {
		return `${node.value}`;
	}

	if (isUnaryOperator(node.value)) {
		if (!node.left) {
			return `${node.value}`;
		}
	} else {
		if (!node.left || !node.right) {
			return `${node.value}`;
		}
	}

	const leftValue = node.left ? processExpressionTree(node.left) : "";
	const rightValue = node.right ? processExpressionTree(node.right) : "";

	switch (node.value) {
		case "+":
			return `${leftValue} + ${rightValue}`;
		case "-":
			if (node.right.value === "+" || node.right.value === "-") {
				return `${leftValue} - \\left( ${rightValue} \\right)`;
			}
			return `${leftValue} - ${rightValue}`;
		case "*":
			let centerOperator = "";
			let left = `${leftValue}`;
			let right = `${rightValue}`;
			if (
				!isNaN(Number(rightValue[0])) ||
				(rightValue[1] &&
					rightValue[0] === "{" &&
					!isNaN(Number(rightValue[1])))
			) {
				centerOperator = "\\cdot";
			}
			if (node.left.value === "+" || node.left.value === "-") {
				left = `\\left( ${left} \\right)`;
			}
			if (node.right.value === "+" || node.right.value === "-") {
				right = `\\left( ${right} \\right)`;
			}
			return `${left} ${centerOperator} ${right}`;
		case "CROSS":
			return `${leftValue} \\times ${rightValue}`;
		case "/":
			return `\\frac{${leftValue}}{${rightValue}}`;
		case "^":
			return `{${leftValue}}^{${rightValue}}`;
		case "sqrt":
			return `\\sqrt{${leftValue}}`;
		case "abs":
			return `\\left| ${leftValue} \\right|`;
		case "ln":
			return `\\ln\\left( ${leftValue} \\right)`;
		case "lg":
			return `\\lg\\left( ${leftValue} \\right)`;
		case "NEG":
			return isOperator(node.left)
				? `-\\left( ${leftValue} \\right)`
				: `-${leftValue}`;
        case "asin":
            return `\\arcsin\\left( ${leftValue} \\right)`;
        case "acos":
            return `\\arccos\\left( ${leftValue} \\right)`;
        case "atan":
            return `\\arctan\\left( ${leftValue} \\right)`;
        case "sin":
            return `\\sin\\left( ${leftValue} \\right)`;
        case "cos":
            return `\\cos\\left( ${leftValue} \\right)`;
        case "tan":
            return `\\tan\\left( ${leftValue} \\right)`;
		default:
			throw new Error("未知运算符: " + node.value);
	}
}

// 标题格式
function titleFormat(input) {
	if (!input) {
		return "";
	}
	let tmplen = input.length;

	// 处理希腊字母替换
	input = input.replace(
		/α|β|γ|δ|ε|ζ|η|θ|ι|κ|λ|μ|ν|ξ|ο|π|ρ|σ|τ|υ|φ|χ|ψ|ω|Δ|Θ|Λ|Ξ|Π|Σ|Φ|Ψ|Ω/g,
		(match) => greekLetters[match]
	);

	if (
		tmplen >= 4 &&
		input.indexOf("\\") === -1 &&
		input.indexOf("{") === -1 &&
		input.indexOf("_") === -1 &&
		input.indexOf("^") === -1
	) {
		return `\\text{${input}}`;
	}

	input = input.replace(chinese, (match) => `\\text{${match}}`);

	// 使用正则表达式匹配字母后面直接跟随的数字或逗号隔开的数字
	return input.replace(/([a-zA-Z\\]+)\s*(\d+(,\d+)*)/g, "$1_{$2}");
}

// 单位格式
function unitFormat(str) {
	if (str === "") {
		return str;
	}
	// 替换常见符号
	str = str
		.replace(/μ/g, "\\upmu ")
		.replace(/°/g, "{}^{\\circ}")
		.replace(/℃/g, "{}^{\\circ}C")
		.replace(/\*/g, "\\cdot ")
        .replace(/\\mu/g,"\\upmu ")
        .replace(/\\Omega/g,"\\bm{\\Omega}");
	// 将字母后面跟随的正负数（包括负号）转化为上标
	str = str.replace(/([a-zA-Z])([-]?\d+)/g, "$1^{$2}");
	// 处理分数的情况
	if (str.includes("/")) {
		str = "(" + str + ")";
	}
	return "/\\mathrm{" + str + "}";
}

/**用于预览的unitFormat，除去了katex不支持的命令 */
function unitTextFormat(str){
    if (str === "") {
		return str;
	}
	// 替换常见符号
	str = str
		.replace(/μ/g, "\\mu ")
		.replace(/°/g, "{}^{\\circ}")
		.replace(/℃/g, "{}^{\\circ}C")
		.replace(/\*/g, "\\cdot ")
		.replace(/\\Omega/g, "\\bm{\\Omega}");
	// 将字母后面跟随的正负数（包括负号）转化为上标
	str = str.replace(/([a-zA-Z])([-]?\d+)/g, "$1^{$2}");
	// 处理分数的情况
	if (str.includes("/")) {
		str = "(" + str + ")";
	}
	return "/\\mathrm{" + str + "}";
}

// 注释区格式
function commentFormat(str, dataList) {
	if (str === "") {
		return str;
	}
	/**保护变量名 */
	function protectTitle(input) {
		return titleFormat(input).replace(
			protectReg,
			(match) => replacements[match]
		);
	}

	/**还原变量名 */
	function restoreTitle(input) {
		return input.replace(restoreReg, (match) => reverseReplacements[match]);
	}

	/**检测并处理科学计数法 */
	function handleScientificNotation(input) {
		return input.replace(/(\d+(\.\d*)?)e(-?\d+)/gi, (match, p1, p2, p3) => {
			return `(${p1} CROSS 10^(${p3}))`; // 转换为 (${p1}*10^(${p3})) 形式
		});
	}

	str = handleScientificNotation(str);
	// 实现保护变量名
	dataList.forEach((item) => {
		const title = item.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const regex = new RegExp(`${title}`, "g");
		str = str.replace(regex, `${protectTitle(item.title)}`);
	});
	let infixExpression = tokenize(str);
	let postfixExpression = infixToPostfix(infixExpression);
	let expressionTree = constructExpressionTree(postfixExpression);

	str = processExpressionTree(expressionTree);
	return restoreTitle(str);
}

// 符号含义格式
function docFormat(str) {
	if (str === "") {
		return "";
	} else {
		return `(\\text{${str}})`;
	}
}

// 数据格式
function dataFormat(str) {
	function formatScientificToLatex(str) {
		// 正则表达式匹配科学计数法
		const scientificRegex = /^([-+]?\d+(\.\d+)?)([eE][-+]?\d+)%?$/;
		const match = str.match(scientificRegex);
		if (match) {
			// 分解匹配结果
			const base = match[1]; // 基数部分
			let exponent = match[3].substring(1); // 指数部分，移除'e'或'E'

			// 移除指数部分的正号
			exponent = exponent.replace(/^\+/, "");

			// 转换为LaTeX格式
			return `${base} \\times 10^{${exponent}}${
				str.indexOf("%") === -1 ? "" : "\\%"
			}`;
		} else {
			return str.replace(/%/g, "\\%"); // 不是科学计数法的情况
		}
	}
	if (typeof str === "string") {
		return formatScientificToLatex(str).replace(
			chinese,
			(match) => `\\text{${match}} `
		);
	} else {
		return "";
	}
}

export { titleFormat, unitFormat, commentFormat, docFormat, dataFormat , replacements, unitTextFormat};
