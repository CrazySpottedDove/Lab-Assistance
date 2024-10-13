
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

// 表达式树的节点类
class ExpressionNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// 运算符的优先级
const precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "^": 3,
    "abs": 4,
    "ln": 4,
    "lg": 4,
    "sqrt": 4,
    "NEG": 5
}

// 判断是否是运算符
function isOperator(token) {
    return ["+", "-", "*", "/", "^", "abs", "ln", "lg", "NEG", "sqrt"].includes(token)
}

// 判断是否是一元运算符
function isUnaryOperator(token) {
    return ['abs', 'ln', 'lg', 'NEG', 'sqrt'].includes(token)
}

// 判断运算符的优先级
function hasHigherPrecedence(op1, op2) {
    return precedence[op1] > precedence[op2]
}

// 将字符串表达式转化成数组表达式
function tokenize(expression) {
    // 正则表达式解释:
    // abs|ln|lg      匹配函数名 abs, ln, lg
    // [()+\-*/^]     匹配运算符和括号
    // [^()+\-*/^ ]+  匹配非运算符、非括号、非空格的其他字符
    // 全局模式 'g' 保证找到所有匹配项
    const regex = /abs|ln|lg|NEG|sqrt|[()+\-*/^]|[^()+\-*/^ ]+/g;

    // 返回所有匹配的 token 数组
    return expression.match(regex);
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
                hasHigherPrecedence(operatorStack[operatorStack.length - 1], token)
            ) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(token);
        } else if (token === "(") {
            operatorStack.push(token);
        } else if (token === ")") {
            // 处理右括号，直到找到左括号
            while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== "(") {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.pop(); // 弹出左括号
        } else {
            // 处理操作数和变量
            outputQueue.push(token);
        }

        // 检查是否是单目负号
        if (token === "-" && (index === 0 || isOperator(infixTokens[index - 1]) || infixTokens[index - 1] === "(")) {
            operatorStack.pop("-")
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

    postfixTokens.forEach(token => {
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
        }
        else {
            stack.push(new ExpressionNode(token));
        }
    });

    return stack.pop(); // 栈中的最后一个节点是表达式树的根节点
}

function processExpressionTree(node) {
    if (!node.left && !node.right) {
        return `${node.value}`
    }

    const leftValue = node.left ? processExpressionTree(node.left) : '';
    const rightValue = node.right ? processExpressionTree(node.right) : '';

    switch (node.value) {
        case "+":
            return `${leftValue} + ${rightValue}`
        case "-":
            if (node.right.value === '+' || node.right.value === '-') {
                return `${leftValue} - \\left( ${rightValue} \\right)`
            }
            return `${leftValue} - ${rightValue}`
        case "*":
            let centerOperator = ''
            let left = `${leftValue}`
            let right = `${rightValue}`
            if (!isNaN(Number(rightValue[0]))) {
                centerOperator = '\\cdot'
            }
            if (node.left.value === '+' || node.left.value === '-') {
                left = `\\left( ${left} \\right)`
            }
            if (node.right.value === '+' || node.right.value === '-') {
                right = `\\left( ${right} \\right)`
            }
            return `${left} ${centerOperator} ${right}`
        case "/":
            return `\\frac{${leftValue}}{${rightValue}}`
        case "^":
            return `{${leftValue}}^{${rightValue}}`
        case "sqrt":
            return `\\sqrt{${leftValue}}`
        case "abs":
            return `\\left| ${leftValue} \\right|`
        case "ln":
            return `\\ln\\left( ${leftValue} \\right)`
        case "lg":
            return `\\lg\\left( ${leftValue} \\right)`
        case "NEG":
            return isOperator(node.left) ? `-\\left( ${leftValue} \\right)` : `-${leftValue}`
        default:
            throw new Error("未知运算符: " + node.value);
    }
}

// 标题格式
function titleFormat(input){
    if (!input) {
		return "";
	}
	let tmplen = input.length;

	// 处理希腊字母替换
	input = input.replace(
		/α|β|γ|δ|ε|ζ|η|θ|ι|κ|λ|μ|ν|ξ|ο|π|ρ|σ|τ|υ|φ|χ|ψ|ω|Δ|Θ|Λ|Ξ|Π|Σ|Φ|Ψ|Ω/g,
		(match) => greekLetters[match]
	);

	if (tmplen >= 4 && input.indexOf("\\") === -1 && input.indexOf('{') === -1) {
		return `\\text{${input}}`;
	}

	input = input.replace(chinese, (match) => `\\text{${match}} `);

	// 使用正则表达式匹配字母后面直接跟随的数字或逗号隔开的数字
	return input.replace(/([a-zA-Z\\]+)\s*(\d+(,\d+)*)/g, "$1_{$2}");
}

// 单位格式
function unitFormat(str){
    if (str === "") {
		return str;
	}
	// 替换常见符号
	str = str
		.replace(/μ/g, "\\upmu ")
		.replace(/°/g, "{}^{\\circ}")
		.replace(/℃/g, "{}^{\\circ}C")
		.replace(/\*/g, "\\cdot ");
	// 将字母后面跟随的正负数（包括负号）转化为上标
	str = str.replace(/([a-zA-Z])([-]?\d+)/g, "$1^{$2}");
	// 处理分数的情况
	if (str.includes("/")) {
		str = "(" + str + ")";
	}
	return "/\\mathrm{" + str + "}";
}

// 注释区格式
function commentFormat(str, dataList){
    if (str === "") {
		return str;
	}

	// 保护变量名
	function protectTitle(input) {
		// 按照给定的符号和函数名称进行部分替换
		let result = titleFormat(input)
			.replace(/\+/g, "@ADD")
			.replace(/-/g, "@SUBTRACTION")
			.replace(/\*/g, "@TIMES")
			.replace(/\//g, "@DIVIDE")
			.replace(/\^/g, "@POW")
			.replace(/\(/g, "@LEFTPAREN")
			.replace(/\)/g, "@RIGHTPAREN")
			.replace(/abs/g, "@ABS")
			.replace(/ln/g, "@LN")
			.replace(/lg/g, "@LG")
			.replace(/sqrt/g, "@SQRT");
		return result;
	}

	// 还原变量名
	function restoreTitle(input) {
		// 按照相反的顺序替换，确保先替换函数和运算符名再替换单字符符号
		let result = input
			.replace(/@ABS/g, "abs")
			.replace(/@LN/g, "ln")
			.replace(/@LG/g, "lg")
			.replace(/@SQRT/g, "sqrt")
			.replace(/@ADD/g, "+")
			.replace(/@SUBTRACTION/g, "-")
			.replace(/@TIMES/g, "*")
			.replace(/@DIVIDE/g, "/")
			.replace(/@POW/g, "^")
			.replace(/@LEFTPAREN/g, "(")
			.replace(/@RIGHTPAREN/g, ")");

		return result;
	}

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
function docFormat(str){
    if (str === "") {
		return "";
	} else {
		return `(\\text{${str}})`;
	}
}

// 数据格式
function dataFormat(str){
    function formatScientificToLatex(str) {
		// 正则表达式匹配科学计数法
		const scientificRegex = /^([-+]?\d+(\.\d+)?)([eE][-+]?\d+)%?$/;
		const match = str.match(scientificRegex);
        console.log(str)
        console.log(match)
		if (match) {
			// 分解匹配结果
			const base = match[1]; // 基数部分
			let exponent = match[3].substring(1); // 指数部分，移除'e'或'E'

			// 移除指数部分的正号
			exponent = exponent.replace(/^\+/, "");

			// 转换为LaTeX格式
			return `${base} \\times 10^{${exponent}}${str.indexOf('%') === -1 ? '' : '\\%'}`;
		} else {
			return str.replace(/%/g, '\\%'); // 不是科学计数法的情况
		}
	}
	if (typeof str === "string") {
		return formatScientificToLatex(str)
			.replace(chinese, (match) => `\\text{${match}} `);
	} else {
		return "";
	}
}

export{
    titleFormat,
    unitFormat,
    commentFormat,
    docFormat,
    dataFormat
}