import { calc } from "a-calc";
import { ElMessage } from "element-plus";
import { create, all, typed, cos, atan, acos } from "mathjs";

const config = {
	// 可以选择在这里添加其他配置，如处理大数等
};
// 对math.js的配置

const valueMath = create(all, config);
const uncerMath = create(all, config);
// 导入自定义运算

/**检查错误情况的方法类 */
class Check {
	static bothEmptyArray(len1, len2) {
		if (len1 === 0 && len2 === 0) {
			ElMessage.error("有的数组长度为空！");
			throw new Error("有的数组长度为空，计算终止。");
		}
	}
	// 检查两个数组存空的错误情况

	static emptyArray(len) {
		if (len === 0) {
			ElMessage.error("有的数组长度为空！");
			throw new Error("有的数组长度为空，计算终止。");
		}
	}
	// 检查单个数组存空的错误情况

	static lengthInEqual(len1, len2) {
		if (len1 !== len2) {
			ElMessage.error("数组的长度不一致！");
			throw new Error("数组的长度不一致！");
		}
	}
	// 检查两个长度非1的数组长度不一致的错误情况

	static divisorZero(divisor) {
		if (divisor === 0) {
			ElMessage.error("除数不能为零！");
			throw new Error("除数不能为零！");
		}
	}
	// 检查分母为0的错误情况

	static naturalInpositive(natural) {
		if (natural === 0) {
			ElMessage.error("对数的真数不能为0！");
			throw new Error("对数的真数不能为0！");
		} else if (natural < 0) {
			ElMessage.error("对数的真数不能为负数！");
			throw new Error("对数的真数不能为负数！");
		}
	}
	// 检查真数非正的错误情况

	static radicandNegative(radicand) {
		if (radicand < 0) {
			ElMessage.error("被开方数不能为负数！");
			throw new Error("被开方数不能为负数！");
		}
	}
	// 检查被开方数为负数的错误情况

	static invalidPow(base, exp) {
		if (base < 0 && !Number.isInteger(exp)) {
			ElMessage.error("不能对负数取非整数次方！");
			throw new Error("不能对负数取非整数次方！");
		}
	}

	/**检查asin或acos的参数范围是否在-1到1之间 */
	static invalidAsinOrAcos(angle) {
		if (angle < -1 || angle > 1) {
			ElMessage.error("参数范围必须在-1到1之间！");
			throw new Error("参数范围必须在-1到1之间！");
		}
	}
}

/**valueMath的单个数据计算方法类 */
class ValueCalc {
	static createObj(tmpBit, tmpLevel, tmpRawData) {
		return {
			bit: tmpBit,
			level: tmpLevel,
			rawData: tmpRawData,
		};
	}
	// 创建valueMath运算对象

	static multiply(a, b) {
		if (typeof a === "object" && typeof b === "object") {
			let bit1 = a.bit;
			let bit2 = b.bit;
			let rawData1 = a.rawData;
			let rawData2 = b.rawData;
			let tmpBit = Math.min(bit1, bit2);
			let tmpRawData = calc(`(${rawData1}) * (${rawData2})`);
			let tmpLevel = bitToLevel(tmpRawData, tmpBit);
			return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
		} else if (typeof a === "number" && typeof b === "number") {
			return a * b;
		} else {
			function valueMultiplyObjAndNum(obj, num) {
				let numExp = Math.floor(Math.log10(Math.abs(num)));
				let tmpLevel = obj.level + numExp;
				let tmpRawData = calc(`(${obj.rawData}) * (${String(num)})`);
				let tmpBit = levelToBit(tmpRawData, tmpLevel);
				return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
			}
			if (typeof a === "object") {
				return valueMultiplyObjAndNum(a, b);
			} else {
				return valueMultiplyObjAndNum(b, a);
			}
		}
	}
	// valueMath中的单位乘法

	static divide(a, b) {
		if (typeof a === "object" && typeof b === "object") {
			let bit1 = a.bit;
			let bit2 = b.bit;
			let rawData1 = a.rawData;
			let rawData2 = b.rawData;
			let tmpBit = Math.min(bit1, bit2);
			let tmpRawData = String(Number(rawData1) / Number(rawData2));
			let tmpLevel = bitToLevel(tmpRawData, tmpBit);
			return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
		} else if (typeof a === "number" && typeof b === "number") {
			return a / b;
		} else {
			if (typeof a === "object") {
				let obj = a;
				let num = b;
				let numExp = Math.floor(Math.log10(Math.abs(num)));
				let tmpLevel = obj.level - numExp;
				let tmpRawData = String(Number(obj.rawData) / num);
				let tmpBit = levelToBit(tmpRawData, tmpLevel);
				return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
			} else {
				let obj = b;
				let num = a;
				let tmpBit = obj.bit;
				let tmpRawData = String(num / Number(obj.rawData));
				let tmpLevel = bitToLevel(tmpRawData, tmpBit);
				return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
			}
		}
	}
	// valueMath中的单位除法

	static add(a, b) {
		if (typeof a === "object" && typeof b === "object") {
			let level1 = a.level;
			let level2 = b.level;
			let rawData1 = a.rawData;
			let rawData2 = b.rawData;
			let tmpLevel = Math.max(level1, level2);
			let tmpRawData = calc(`(${rawData1}) + (${rawData2})`);
			let tmpBit = levelToBit(tmpRawData, tmpLevel);
			return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
		} else if (typeof a === "number" && typeof b === "number") {
			return a + b;
		} else {
			function valueAddObjAndNum(obj, num) {
				let tmpLevel = obj.level;
				let tmpRawData = calc(`(${obj.rawData}) + ${String(num)}`);
				let tmpBit = levelToBit(tmpRawData, tmpLevel);
				return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
			}
			if (typeof a === "object") {
				return valueAddObjAndNum(a, b);
			} else {
				return valueAddObjAndNum(b, a);
			}
		}
	}
	// valueMath中的单位加法

	static subtract(a, b) {
		if (typeof a === "object" && typeof b === "object") {
			let level1 = a.level;
			let level2 = b.level;
			let rawData1 = a.rawData;
			let rawData2 = b.rawData;
			let tmpLevel = Math.max(level1, level2);
			let tmpRawData = calc(`(${rawData1}) - (${rawData2})`);
			let tmpBit = levelToBit(tmpRawData, tmpLevel);
			return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
		} else if (typeof a === "number" && typeof b === "number") {
			return a - b;
		} else {
			if (typeof a === "object") {
				let obj = a;
				let num = b;
				let tmpLevel = obj.level;
				let tmpRawData = calc(`(${obj.rawData}) - ${String(num)}`);
				let tmpBit = levelToBit(tmpRawData, tmpLevel);
				return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
			} else {
				let obj = b;
				let num = a;
				let tmpLevel = obj.level;
				let tmpRawData = calc(`(${String(num)}) - ${obj.rawData}`);
				let tmpBit = levelToBit(tmpRawData, tmpLevel);
				return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
			}
		}
	}
	// valueMath中的单位减法

	static ln(x) {
		if (typeof x === "object") {
			let tmpLevel = -x.bit;
			let tmpRawData = String(Math.log(Number(x.rawData)));
			let tmpBit = levelToBit(tmpRawData, tmpLevel);
			return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
		} else {
			return Math.log(x);
		}
	}
	// valueMath中的单位ln函数

	static sqrt(x) {
		if (typeof x === "object") {
			let tmpBit = x.bit;
			let tmpRawData = String(Math.sqrt(Number(x.rawData)));
			let tmpLevel = bitToLevel(tmpRawData, tmpBit);
			return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
		} else {
			return Math.sqrt(x);
		}
	}
	// valueMath中的单位sqrt函数

	static abs(x) {
		if (typeof x === "object") {
			let tmpBit = x.bit;
			let tmpLevel = x.level;
			let tmpRawData = String(Math.abs(Number(x.rawData)));
			return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
		} else {
			return Math.abs(x);
		}
	}
	// valueMath中的单位Abs函数

	static pow(a, b) {
		if (typeof a === "object" && typeof b === "object") {
			let rawData1 = a.rawData;
			let rawData2 = b.rawData;
			let tmpBit = a.bit;
			let tmpRawData = String(
				Math.pow(Number(rawData1), Number(rawData2))
			);
			let tmpLevel = bitToLevel(tmpRawData, tmpBit);
			return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
		} else if (typeof a === "object") {
			let tmpBit = a.bit;
			let tmpRawData = String(Math.pow(Number(a.rawData), b));
			let tmpLevel = bitToLevel(tmpRawData, tmpBit);
			return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
		} else if (typeof b === "object") {
			let tmpBit = b.bit;
			let tmpRawData = String(Math.pow(a, Number(b.rawData)));
			let tmpLevel = bitToLevel(tmpRawData, tmpBit);
			return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
		} else {
			return Math.pow(a, b);
		}
	}

	static lg(x) {
		if (typeof x === "object") {
			let tmpLevel = -x.bit;
			let tmpRawData = String(Math.log10(Number(x.rawData)));
			let tmpBit = levelToBit(tmpRawData, tmpLevel);
			return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
		} else {
			return Math.log10(x);
		}
	}

	static sin(x) {
		if (typeof x === "number") {
			return Math.sin(x);
		}
		let tmpBit = x.bit;
		let tmpRawData = String(Math.sin(Number(x.rawData)));
		let tmpLevel = bitToLevel(tmpRawData, tmpBit);
		return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
	}

	static cos(x) {
		if (typeof x === "number") {
			return Math.cos(x);
		}
		let tmpBit = x.bit;
		let tmpRawData = String(Math.cos(Number(x.rawData)));
		let tmpLevel = bitToLevel(tmpRawData, tmpBit);
		return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
	}

	static tan(x) {
		if (typeof x === "number") {
			return Math.tan(x);
		}
		let tmpBit = x.bit;
		let tmpRawData = String(Math.tan(Number(x.rawData)));
		let tmpLevel = bitToLevel(tmpRawData, tmpBit);
		return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
	}

	static asin(x) {
		if (typeof x === "number") {
			return Math.asin(x);
		}
		let tmpBit = x.bit;
		let tmpRawData = String(Math.asin(Number(x.rawData)));
		let tmpLevel = bitToLevel(tmpRawData, tmpBit);
		return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
	}

	static acos(x) {
		if (typeof x === "number") {
			return Math.acos(x);
		}
		let tmpBit = x.bit;
		let tmpRawData = String(Math.acos(Number(x.rawData)));
		let tmpLevel = bitToLevel(tmpRawData, tmpBit);
		return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
	}

	static atan(x) {
		if (typeof x === "number") {
			return Math.atan(x);
		}
		let tmpBit = x.bit;
		let tmpRawData = String(Math.atan(Number(x.rawData)));
		let tmpLevel = bitToLevel(tmpRawData, tmpBit);
		return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
	}

	static unaryMinus(x) {
		if (typeof x === "object") {
			let tmpLevel = x.level;
			let tmpBit = x.bit;
			let tmpRawData = String(-Number(x.rawData));
			return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData);
		} else {
			return -x;
		}
	}
}

function bitToLevel(str, bit) {
	let stdStr = standardByBit(str, bit);
	return getLevel(stdStr);
}
// 给数据，位数，得到精度

function levelToBit(str, level) {
	let stdStr = standardByLevel(str, level);
	return getBit(stdStr);
}
// 给数据，精度，得到位数

function dimensionalAdd(a, b) {
	let x = typeof a === "string" ? Number(a) : a;
	let y = typeof b === "string" ? Number(b) : b;
	return String(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
}
// 维度和

valueMath.import(
	{
		multiply: typed("multiply", {
			"Array, Array": function (arr1, arr2) {
				let length1 = arr1.length;
				let length2 = arr2.length;
				let result = [];
				Check.bothEmptyArray(length1, length2);
				if (length1 === 1) {
					arr2.forEach((item) => {
						result.push(ValueCalc.multiply(arr1[0], item));
					});
				} else if (length2 === 1) {
					arr1.forEach((item) => {
						result.push(ValueCalc.multiply(item, arr2[0]));
					});
				} else {
					Check.lengthInEqual(length1, length2);
					for (let i = 0; i < length1; i++) {
						result.push(ValueCalc.multiply(arr1[i], arr2[i]));
					}
				}
				return result;
			},
			"Array, number": function (arr, num) {
				let length = arr.length;
				Check.emptyArray(length);
				let result = [];
				arr.forEach((item) => {
					result.push(ValueCalc.multiply(item, num));
				});
				return result;
			},
			"number, Array": function (num, arr) {
				let length = arr.length;
				Check.emptyArray(length);
				let result = [];
				arr.forEach((item) => {
					result.push(ValueCalc.multiply(num, item));
				});
				return result;
			},
			"number, number": function (num1, num2) {
				return ValueCalc.multiply(num1, num2);
			},
		}),
		divide: typed("divide", {
			"Array, Array": function (arr1, arr2) {
				let length1 = arr1.length;
				let length2 = arr2.length;
				let result = [];
				Check.bothEmptyArray(length1, length2);
				if (length1 === 1) {
					arr2.forEach((item) => {
						Check.divisorZero(Number(item.rawData));
						result.push(ValueCalc.divide(arr1[0], item));
					});
				} else if (length2 === 1) {
					Check.divisorZero(Number(arr2[0].rawData));
					arr1.forEach((item) => {
						result.push(ValueCalc.divide(item, arr2[0]));
					});
				} else {
					Check.lengthInEqual(length1, length2);
					for (let i = 0; i < length1; i++) {
						Check.divisorZero(arr2[i]);
						result.push(ValueCalc.divide(arr1[i], arr2[i]));
					}
				}
				return result;
			},
			"Array, number": function (arr, num) {
				let length = arr.length;
				Check.emptyArray(length);
				Check.divisorZero(num);
				let result = [];
				arr.forEach((item) => {
					result.push(ValueCalc.divide(item, num));
				});
				return result;
			},
			"number, Array": function (num, arr) {
				let length = arr.length;
				Check.emptyArray(length);
				let result = [];
				arr.forEach((item) => {
					Check.divisorZero(Number(item.rawData));
					result.push(ValueCalc.divide(num, item));
				});
				return result;
			},
			"number, number": function (num1, num2) {
				Check.divisorZero(num2);
				return ValueCalc.divide(num1, num2);
			},
		}),
		add: typed("add", {
			"Array,Array": function (arr1, arr2) {
				let length1 = arr1.length;
				let length2 = arr2.length;
				Check.bothEmptyArray(length1, length2);
				let result = [];
				if (length1 === 1) {
					arr2.forEach((item) => {
						result.push(ValueCalc.add(arr1[0], item));
					});
				} else if (length2 === 1) {
					arr1.forEach((item) => {
						result.push(ValueCalc.add(item, arr2[0]));
					});
				} else {
					Check.lengthInEqual(length1, length2);
					for (let i = 0; i < length1; i++) {
						result.push(ValueCalc.add(arr1[i], arr2[i]));
					}
				}
				return result;
			},
			"Array,number": function (arr, num) {
				let length = arr.length;
				Check.emptyArray(length);
				let result = [];
				arr.forEach((item) => {
					result.push(ValueCalc.add(item, num));
				});
				return result;
			},
			"number,Array": function (num, arr) {
				let length = arr.length;
				Check.emptyArray(length);
				let result = [];
				arr.forEach((item) => {
					result.push(ValueCalc.add(num, item));
				});
				return result;
			},
			"number, number": function (num1, num2) {
				return ValueCalc.add(num1, num2);
			},
		}),
		subtract: typed("subtract", {
			"Array,Array": function (arr1, arr2) {
				let length1 = arr1.length;
				let length2 = arr2.length;
				Check.bothEmptyArray(length1, length2);
				let result = [];
				if (length1 === 1) {
					arr2.forEach((item) => {
						result.push(ValueCalc.subtract(arr1[0], item));
					});
				} else if (length2 === 1) {
					arr1.forEach((item) => {
						result.push(ValueCalc.subtract(item, arr2[0]));
					});
				} else {
					Check.lengthInEqual(length1, length2);
					for (let i = 0; i < length1; i++) {
						result.push(ValueCalc.subtract(arr1[i], arr2[i]));
					}
				}
				return result;
			},
			"Array,number": function (arr, num) {
				let length = arr.length;
				Check.emptyArray(length);
				let result = [];
				arr.forEach((item) => {
					result.push(ValueCalc.subtract(item, num));
				});
				return result;
			},
			"number,Array": function (num, arr) {
				let length = arr.length;
				Check.emptyArray(length);
				let result = [];
				arr.forEach((item) => {
					result.push(ValueCalc.subtract(num, item));
				});
				return result;
			},
			"number, number": function (num1, num2) {
				return ValueCalc.subtract(num1, num2);
			},
		}),
		ln: typed("ln", {
			Array: function (arr) {
				let length = arr.length;
				Check.emptyArray(length);
				let result = [];
				arr.forEach((item) => {
					Check.naturalInpositive(Number(item.rawData));
					result.push(ValueCalc.ln(item));
				});
				return result;
			},
			number: function (num) {
				Check.naturalInpositive(num);
				return ValueCalc.ln(num);
			},
		}),
		sqrt: typed("sqrt", {
			Array: function (arr) {
				let length = arr.length;
				Check.emptyArray(length);
				let result = [];
				arr.forEach((item) => {
					Check.radicandNegative(Number(item.rawData));
					result.push(ValueCalc.sqrt(item));
				});
				return result;
			},
			number: function (num) {
				Check.radicandNegative(num);
				return Math.sqrt(num);
			},
		}),
		abs: typed("abs", {
			Array: function (arr) {
				let length = arr.length;
				Check.emptyArray(length);
				let result = [];
				arr.forEach((item) => {
					result.push(ValueCalc.abs(item));
				});
				return result;
			},
			number: function (num) {
				return ValueCalc.abs(num);
			},
		}),
		pow: typed("pow", {
			"Array,Array": function (arr1, arr2) {
				let length1 = arr1.length;
				let length2 = arr2.length;
				Check.bothEmptyArray(length1, length2);
				let result = [];
				if (length1 === 1) {
					arr2.forEach((item) => {
						Check.invalidPow(
							Number(arr1[0].rawData),
							Number(item.rawData)
						);
						result.push(ValueCalc.pow(arr1[0], item));
					});
				} else if (length2 === 1) {
					arr1.forEach((item) => {
						Check.invalidPow(
							Number(item.rawData),
							Number(arr2[0].rawData)
						);
						result.push(ValueCalc.pow(item, arr2[0]));
					});
				} else {
					Check.lengthInEqual(length1, length2);
					for (let i = 0; i < length1; i++) {
						Check.invalidPow(
							Number(arr1[i].rawData, Number(arr2[i].rawData))
						);
						result.push(ValueCalc.pow(arr1[i], arr2[i]));
					}
				}
				return result;
			},
			"Array,number": function (arr, num) {
				let length = arr.length;
				Check.emptyArray(length);
				let result = [];
				arr.forEach((item) => {
					Check.invalidPow(Number(item.rawData), num);
					result.push(ValueCalc.pow(item, num));
				});
				return result;
			},
			"number,Array": function (num, arr) {
				let length = arr.length;
				Check.emptyArray(length);
				let result = [];
				arr.forEach((item) => {
					Check.invalidPow(num, Number(item.rawData));
					result.push(ValueCalc.pow(num, item));
				});
				return result;
			},
			"number,number": function (num1, num2) {
				Check.invalidPow(num1, num2);
				return ValueCalc.pow(num1, num2);
			},
		}),
		lg: typed("lg", {
			Array: function (arr) {
				let length = arr.length;
				Check.emptyArray(length);
				let result = [];
				arr.forEach((item) => {
					Check.naturalInpositive(Number(item.rawData));
					result.push(ValueCalc.lg(item));
				});
				return result;
			},
			number: function (num) {
				Check.naturalInpositive(num);
				return ValueCalc.lg(num);
			},
		}),
		unaryMinus: typed("unaryMinus", {
			Array: function (arr) {
				let length = arr.length;
				Check.emptyArray(length);
				let result = [];
				arr.forEach((item) => {
					result.push(ValueCalc.unaryMinus(item));
				});
				return result;
			},
			number: function (num) {
				return ValueCalc.unaryMinus(num);
			},
		}),
		sin: typed("sin", {
			Array: function (arr) {
				let length = arr.length;
				Check.emptyArray(length);
				let result = [];
				arr.forEach((item) => {
					result.push(ValueCalc.sin(item));
				});
				return result;
			},
			number: function (num) {
				return ValueCalc.sin(num);
			},
		}),
		cos: typed("cos", {
			Array: function (arr) {
				let length = arr.length;
				Check.emptyArray(length);
				let result = [];
				arr.forEach((item) => {
					result.push(ValueCalc.cos(item));
				});
				return result;
			},
			number: function (num) {
				return ValueCalc.cos(num);
			},
		}),
		tan: typed("tan", {
			Array: function (arr) {
				let length = arr.length;
				Check.emptyArray(length);
				let result = [];
				arr.forEach((item) => {
					result.push(ValueCalc.tan(item));
				});
				return result;
			},
			number: function (num) {
				return ValueCalc.tan(num);
			},
		}),
		asin: typed("asin", {
			Array: function (arr) {
				let length = arr.length;
				Check.emptyArray(length);
				let result = [];
				arr.forEach((item) => {
					Check.invalidAsinOrAcos(Number(item.rawData));
					result.push(ValueCalc.asin(item));
				});
				return result;
			},
			number: function (num) {
				Check.invalidAsinOrAcos(num);
				return ValueCalc.asin(num);
			},
		}),
		acos: typed("acos", {
			Array: function (arr) {
				let length = arr.length;
				Check.emptyArray(length);
				let result = [];
				arr.forEach((item) => {
					Check.invalidAsinOrAcos(Number(item.rawData));
					result.push(ValueCalc.acos(item));
				});
				return result;
			},
			number: function (num) {
				Check.invalidAsinOrAcos(num);
				return ValueCalc.acos(num);
			},
		}),
		atan: typed("atan", {
			Array: function (arr) {
				let length = arr.length;
				Check.emptyArray(length);
				let result = [];
				arr.forEach((item) => {
					result.push(ValueCalc.atan(item));
				});
				return result;
			},
			number: function (num) {
				return ValueCalc.atan(num);
			},
		}),
	},
	{ override: true }
);
// 数值计算规则
uncerMath.import(
	{
		// 自定义乘法
		multiply: typed("multiply", {
			"Object, Object": function (obj1, obj2) {
				return {
					data: calc(`(${obj1.data}) * (${obj2.data})`),
					uncer: dimensionalAdd(
						Number(obj1.data) * Number(obj2.uncer),
						Number(obj1.uncer) * Number(obj2.data)
					),
				};
			},
			"number, number": function (num1, num2) {
				return {
					data: String(num1 * num2),
					uncer: "0",
				};
			},
			"Object, number": function (obj, num) {
				return {
					data: String(Number(obj.data) * num),
					uncer: toPositive(String(Number(obj.uncer) * num)),
				};
			},
			"number, Object": function (num, obj) {
				return {
					data: String(Number(obj.data) * num),
					uncer: toPositive(String(Number(obj.uncer) * num)),
				};
			},
		}),
		// 自定义除法
		divide: typed("divide", {
			"Object, Object": function (obj1, obj2) {
				Check.divisorZero(Number(obj2.data));
				return {
					data: String(Number(obj1.data) / Number(obj2.data)),
					uncer: dimensionalAdd(
						Number(obj1.uncer) / Number(obj2.data),
						(Number(obj1.data) /
							Number(obj2.data) /
							Number(obj2.data)) *
							Number(obj2.uncer)
					),
				};
			},
			"number, number": function (num1, num2) {
				Check.divisorZero(num2);
				return {
					data: String(num1 / num2),
					uncer: "0",
				};
			},
			"Object, number": function (obj, num) {
				Check.divisorZero(num);
				return {
					data: String(Number(obj.data) / num),
					uncer: String(Math.abs(Number(obj.uncer) / num)),
				};
			},
			"number, Object": function (num, obj) {
				Check.divisorZero(Number(obj.data));
				return {
					data: String(num / Number(obj.data)),
					uncer: toPositive(
						calc(
							`(${obj.uncer}) * (${String(num)}) / (${
								obj.data
							}) / (${obj.data})`
						)
					),
				};
			},
		}),
		add: typed("add", {
			"Object, Object": function (obj1, obj2) {
				return {
					data: String(Number(obj1.data) + Number(obj2.data)),
					uncer: dimensionalAdd(obj1.uncer, obj2.uncer),
				};
			},
			"number, Object": function (num, obj) {
				return {
					data: String(num + Number(obj.data)),
					uncer: obj.uncer,
				};
			},
			"Object, number": function (obj, num) {
				return {
					data: String(num + Number(obj.data)),
					uncer: obj.uncer,
				};
			},
			"number, number": function (num1, num2) {
				return {
					data: num1 + num2,
					uncer: "0",
				};
			},
		}),
		subtract: typed("subtract", {
			"Object, Object": function (obj1, obj2) {
				return {
					data: String(Number(obj1.data) - Number(obj2.data)),
					uncer: dimensionalAdd(obj1.uncer, obj2.uncer),
				};
			},
			"number, Object": function (num, obj) {
				return {
					data: String(num - Number(obj.data)),
					uncer: obj.uncer,
				};
			},
			"Object, number": function (obj, num) {
				return {
					data: String(Number(obj.data) - num),
					uncer: obj.uncer,
				};
			},
			"number, number": function (num1, num2) {
				return {
					data: num1 - num2,
					uncer: "0",
				};
			},
		}),
		ln: typed("ln", {
			Object: function (obj) {
				Check.naturalInpositive(Number(obj.data));
				return {
					data: String(Math.log(Number(obj.data))),
					uncer: String(Number(obj.uncer) / Number(obj.data)),
				};
			},
			number: function (num) {
				Check.naturalInpositive(num);
				return {
					data: String(Math.log(num)),
					uncer: "0",
				};
			},
		}),
		sqrt: typed("sqrt", {
			Object: function (obj) {
				Check.radicandNegative(Number(obj.data));
				return {
					data: String(Math.sqrt(Number(obj.data))),
					uncer: String(
						Number(obj.uncer) / Math.sqrt(Number(obj.data)) / 2
					),
				};
			},
			number: function (num) {
				Check.radicandNegative(num);
				return {
					data: String(Math.sqrt(num)),
					uncer: "0",
				};
			},
		}),
		abs: typed("abs", {
			Object: function (obj) {
				return {
					data: String(Math.abs(Number(obj.data))),
					uncer: obj.uncer,
				};
			},
			number: function (num) {
				return {
					data: String(Math.abs(num)),
					uncer: "0",
				};
			},
		}),
		pow: typed("pow", {
			"Object, Object": function (obj1, obj2) {
				let y1 = Number(obj1.data);
				let y2 = Number(obj2.data);
				Check.invalidPow(y1, y2);
				return {
					data: String(Math.pow(y1, y2)),
					uncer: dimensionalAdd(
						Math.pow(y1, y2) * Math.log(y1) * Number(obj2.uncer),
						y2 * Math.pow(y1, y2 - 1) * Number(obj1.uncer)
					),
				};
			},
			"Object, number": function (obj, num) {
				Check.invalidPow(Number(obj.data), num);
				return {
					data: String(Math.pow(Number(obj.data), num)),
					uncer: calc(
						`${String(
							Math.abs(
								num *
									Math.pow(Number(obj.data), num - 1) *
									Number(obj.data)
							)
						)} * ${obj.uncer}`
					),
				};
			},
			"number, Object": function (num, obj) {
				Check.invalidPow(num, Number(obj.data));
				return {
					data: String(Math.pow(num, Number(obj.data))),
					uncer: calc(
						`${String(
							Math.abs(
								Math.log(Math.abs(Number(obj.data))) *
									Math.pow(num, Number(obj.data))
							)
						)} * ${obj.uncer}`
					),
				};
			},
			"number, number": function (num1, num2) {
				Check.invalidPow(num1, num2);
				return {
					data: String(Math.pow(num1, num2)),
					uncer: "0",
				};
			},
		}),
		lg: typed("lg", {
			Object: function (obj) {
				Check.naturalInpositive(Number(obj.data));
				return {
					data: String(Math.log10(Number(obj.data))),
					uncer: calc(
						`${Number(obj.uncer) / Number(obj.data)} * (${String(
							Math.LN10
						)})`
					),
				};
			},
			number: function (num) {
				Check.naturalInpositive(num);
				return {
					data: String(Math.log10(num)),
					uncer: "0",
				};
			},
		}),
		unaryMinus: typed("unaryMinus", {
			Object: function (obj) {
				return {
					data: String(-Number(obj.data)),
					uncer: obj.uncer,
				};
			},
			number: function (num) {
				return {
					data: String(-num),
					uncer: "0",
				};
			},
		}),
		sin: typed("sin", {
			Object: function (obj) {
				return {
					data: String(Math.sin(Number(obj.data))),
					uncer: calc(
						`${obj.uncer} * ${Math.abs(Math.cos(Number(obj.data)))}`
					),
				};
			},
			number: function (num) {
				return {
					data: String(Math.sin(num)),
					uncer: "0",
				};
			},
		}),
		cos: typed("cos", {
			Object: function (obj) {
				return {
					data: String(Math.cos(Number(obj.data))),
					uncer: calc(
						`${obj.uncer} * ${Math.abs(Math.sin(Number(obj.data)))}`
					),
				};
			},
			number: function (num) {
				return {
					data: String(Math.cos(num)),
                    uncer: "0",
				};
			},
		}),
		tan: typed("tan", {
			Object: function (obj) {
				return {
					data: String(Math.tan(Number(obj.data))),
					uncer: String(
						Number(obj.uncer) /
							Math.cos(Number(obj.data)) /
							Math.cos(Number(obj.data))
					),
				};
			},
			number: function (num) {
				return {
					data: String(Math.tan(num)),
					uncer: "0",
				};
			},
		}),
		asin: typed("asin", {
			Object: function (obj) {
				Check.invalidAsinOrAcos(obj.data);
				return {
					data: String(Math.asin(Number(obj.data))),
					uncer: String(
						Number(obj.uncer) /
							Math.sqrt(1 - Math.pow(Number(obj.data), 2))
					),
				};
			},
			number: function (num) {
				return {
					data: String(Math.asin(num)),
                    uncer: "0",
				};
			},
		}),
		acos: typed("acos", {
			Object: function (obj) {
				Check.invalidAsinOrAcos(obj.data);
				return {
					data: String(Math.acos(Number(obj.data))),
					uncer: String(
						Number(obj.uncer) /
							Math.sqrt(1 - Math.pow(Number(obj.data), 2))
					),
				};
			},
            number: function (num) {
				return {
					data: String(Math.acos(num)),
                    uncer: "0",
				};
			},
		}),
		atan: typed("atan", {
			Object: function (obj) {
				return {
					data: String(Math.atan(Number(obj.data))),
					uncer: String(
						Number(obj.uncer) / (1 + Math.pow(Number(obj.data), 2))
					),
				};
			},
			number: function (num) {
                return {
					data: String(Math.atan(num)),
					uncer: "0",
				};
            },
		}),
	},
	{ override: true }
);
// 不确定度计算规则

function escapeVariableName(variableName) {
	if (!variableName) {
		return "";
	}
	function replaceChineseWithUnicode(str) {
		// 匹配中文字符的正则表达式
		const chineseRegex = /[\u4e00-\u9fa5]/g;

		// 使用 replace 逐个替换匹配到的中文字符
		return str.replace(chineseRegex, (ch) => {
			// 将中文字符转换为 Unicode 编码格式
			return "u" + ch.charCodeAt(0).toString(16).padStart(4, "0");
		});
	}
	// 将中文转成编码，防止数学解析器无法识别中文

	// 用双引号包裹变量名，防止撇号引起解析错误
	let tmp = variableName;

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
	};

	// 替换特殊字符
	tmp = tmp.replace(
		new RegExp(
			Object.keys(replacements)
				.map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
				.join("|"),
			"g"
		),
		(match) => replacements[match]
	);

	// 替换中文字符
	tmp = replaceChineseWithUnicode(tmp);
	return tmp;
}
// 处理变量名规范，以便数学解析器解析
function escapeExpression(expression, variables) {
	let preprocessed = expression;
	function escapeRegExp(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	}
	Object.keys(variables).forEach((key) => {
		const value = variables[key];
		const escapedKey = escapeRegExp(key); // 转义键
		const regex = new RegExp(escapedKey, "g"); // 创建全局正则表达式
		preprocessed = preprocessed.replace(regex, value); // 替换匹配的部分
	});

	return preprocessed;
}
// 处理表达式规范，以便数学解析器解析

function evaluateUncer(dataList, expression, currentTitle, multiplier) {
	expression = `(${expression})*${multiplier}`;
	const parser = uncerMath.parser();
	let variables = {};
	const sortedDataList = dataList
		.map((item) => ({
			title: item.title,
			data: item.analysis["avg"].propertyValue,
			uncer: item.moreUncer.wholeUncer,
		}))
		.sort((a, b) => b.title.length - a.title.length);
	sortedDataList.forEach((item) => {
		if (item.title !== currentTitle) {
			variables[item.title] = escapeVariableName(item.title);
			parser.set(variables[item.title], {
				data: item.data,
				uncer: item.uncer,
			});
		}
		// 防止该数据的命名与算式有冲突
	});
	try {
		let result = parser.evaluate(escapeExpression(expression, variables));
		if (typeof result === "number") {
			return "0";
		} else {
			return errorMode(result.uncer);
		}
	} catch (error) {
		ElMessage.error("计算不确定度过程中出错！");
		console.error("Error evaluating Uncer:", error);
		return "0"; // 错误处理
	}
}
// 依据计算式计算不确定度

function evaluateExpression(
	dataList,
	expression,
	option,
	currentTitle,
	multiplier
) {
	expression = `(${expression})*${multiplier}`;
	const parser = valueMath.parser();
	const sortedDataList = dataList
		.map((item) => ({
			title: item.title,
			dataSet: item.dataSet,
			rawData: item.analysis["avg"].propertyValue,
		}))
		.sort((a, b) => b.title.length - a.title.length);
	let variables = {};
	if (option === "forAll") {
		sortedDataList.forEach((item) => {
			if (item.title !== currentTitle) {
				variables[item.title] = escapeVariableName(item.title);
				parser.set(variables[item.title], item.dataSet);
			}
		});
	} else if (option === "forAvg") {
		sortedDataList.forEach((item) => {
			if (item.title !== currentTitle) {
				variables[item.title] = escapeVariableName(item.title);
				parser.set(variables[item.title], [
					{
						rawData: item.rawData,
						level: getLevel(item.rawData),
						bit: getBit(item.rawData),
					},
				]);
			}
		});
	}
	try {
		let result = parser.evaluate(escapeExpression(expression, variables));
		// 确保结果是数组
		if (!Array.isArray(result)) {
			result = [result];
		}
		// 返回计算结果
		if (typeof result[0] === "number") {
			ElMessage({
				type: "success",
				message: `计算结果为 ${result[0]}`,
				showClose: true,
				duration: 0,
			});
			return [];
		} else {
			result.forEach((item) => {
				if (item.bit >= 20) {
					item.rawData = standardByBit(item.rawData, 8);
				} else {
					item.rawData = standardByBit(item.rawData, item.bit);
				}
			});
			return result;
		}
	} catch (error) {
		ElMessage.error("计算数值过程中出错！");
		console.error("Error evaluating expression:", error);
		return []; // 错误处理，返回空数组
	}
}
// 依据计算式计算值

function calculateLeastSquares(x, y) {
	if (x.length !== y.length) {
		ElMessage.error("数组长度不一致！");
		return {};
	}
	if (x.length === 0) {
		ElMessage.error("数组为空！");
		return {};
	}
	if (x.length === 1) {
		ElMessage.error("数组长度为 1，无法进行线性拟合！");
		return {};
	}
	let n = x.length;
	let sumX = 0,
		sumY = 0,
		sumXY = 0,
		sumXX = 0,
		sumYY = 0;
	// Calculate sums and check for non-numeric values
	for (let i = 0; i < n; i++) {
		sumX += x[i];
		sumY += y[i];
		sumXY += x[i] * y[i];
		sumXX += x[i] * x[i];
		sumYY += y[i] * y[i];
	}
	// Calculate coefficients
	let a = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
	let b = (sumY - a * sumX) / n;
	// Calculate R²
	let ssTot = 0,
		ssRes = 0;
	for (let i = 0; i < n; i++) {
		let yi = a * x[i] + b;
		ssRes += (y[i] - yi) ** 2;
		ssTot += (y[i] - sumY / n) ** 2;
	}
	let rSquared = 1 - ssRes / ssTot;
	return { slope: a, intercept: b, rSquared: rSquared, xAvg: sumX / n };
}
// 计算最小二乘直线
function calculateQuadraticLeastSquares(x, y) {
	if (x.length !== y.length) {
		ElMessage.error("数组长度不一致！");
		return {};
	}
	if (x.length === 0) {
		ElMessage.error("数组为空！");
		return {};
	}
	if (x.length === 1 || x.length === 2) {
		ElMessage.error(`数组长度为${x.length}，无法进行二次拟合！`);
		return {};
	}

	let n = x.length;
	let sumX = 0,
		sumX2 = 0,
		sumX3 = 0,
		sumX4 = 0;
	let sumY = 0,
		sumXY = 0,
		sumX2Y = 0;
	let sumYY = 0;

	function determinant3x3(matrix) {
		return (
			matrix[0][0] *
				(matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
			matrix[0][1] *
				(matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
			matrix[0][2] *
				(matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
		);
	}
	// Helper functions

	function replaceColumn(matrix, vector, colIndex) {
		return matrix.map((row, i) => {
			let newRow = [...row];
			newRow[colIndex] = vector[i];
			return newRow;
		});
	}
	// Helper functions

	// Calculate sums
	for (let i = 0; i < n; i++) {
		let xi = x[i],
			yi = y[i];
		sumX += xi;
		sumX2 += xi * xi;
		sumX3 += xi * xi * xi;
		sumX4 += xi * xi * xi * xi;
		sumY += yi;
		sumXY += xi * yi;
		sumX2Y += xi * xi * yi;
		sumYY += yi * yi;
	}

	// Calculate the coefficients of the normal equations matrix
	let matrixA = [
		[sumX4, sumX3, sumX2],
		[sumX3, sumX2, sumX],
		[sumX2, sumX, n],
	];
	let vectorB = [sumX2Y, sumXY, sumY];

	// Solve the normal equations matrix using Cramer's Rule
	// console.log(matrixA)
	let detA = determinant3x3(matrixA);
	// console.log(detA)
	if (detA === 0) {
		ElMessage.error("矩阵不可逆！");
		return {};
	}

	let a = determinant3x3(replaceColumn(matrixA, vectorB, 0)) / detA;
	let b = determinant3x3(replaceColumn(matrixA, vectorB, 1)) / detA;
	let c = determinant3x3(replaceColumn(matrixA, vectorB, 2)) / detA;

	// Calculate R²
	let ssTot = 0,
		ssRes = 0;
	for (let i = 0; i < n; i++) {
		let yi = a * x[i] * x[i] + b * x[i] + c;
		ssRes += (y[i] - yi) ** 2;
		ssTot += (y[i] - sumY / n) ** 2;
	}
	let rSquared = 1 - ssRes / ssTot;

	return { a: a, b: b, c: c, rSquared: rSquared, xAvg: sumX / n };
}
// 二次拟合

function getLevel(str) {
	// 获得最小位数
	let trimmedStr = str.trim();
	if (isNaN(Number(trimmedStr))) {
		return 0; // 不是有效数字，返回0
	}
	trimmedStr = trimmedStr.replace(/^[+-]/, "");
	// 除去加减符号
	if (/e/i.test(trimmedStr)) {
		let parts = trimmedStr.split(/e/i);
		return Number(parts[1]) + getLevel(parts[0]);
	}
	// 处理科学计数法数字
	let [integerPart, decimalPart] = trimmedStr.split(".");
	if (decimalPart === undefined) {
		// let length = integerPart.length
		// integerPart = integerPart.replace(/0+$/,'')
		// return length - integerPart.length
		return 0;
	} else {
		return -decimalPart.length;
	}
	// 处理一般数字
}
// 获得一个数据的精度
function getBit(str) {
	str = String(str);
	let trimmedStr = str.trim();
	if (isNaN(Number(trimmedStr))) {
		return 0; // 不是有效数字，返回0
	}

	function isHead(str) {
		return str === "-" || str === "+" || str === "0" || str === "." ? 0 : 1;
	}
	// 判断是不是有效数字的开头

	function isTail(str) {
		return str === "e" || str === "E" || str === "%" ? 1 : 0;
	}
	// 判断是不是有效数字的末尾

	let len = trimmedStr.length;
	let validLen = 0;
	let startFlag = false;
	for (let i = 0; i < len; i++) {
		if (startFlag === false) {
			if (isHead(trimmedStr[i])) {
				startFlag = true;
				validLen++;
			}
		} else {
			if (!isTail(trimmedStr[i])) {
				if (trimmedStr[i] !== ".") {
					validLen++;
				}
			} else {
				break;
			}
		}
	}
	return validLen;
}
// 获得一个数据的有效位数
function toScientific(str) {
	console.log(str);
	if (/e/i.test(str)) {
		return str;
	}
	let bit = getBit(str);
	let length = str.length;
	let index = -1;
	for (let i = 0; i < length; i++) {
		if (
			str[i] !== "0" &&
			str[i] !== "." &&
			str[i] !== "+" &&
			str[i] !== "-"
		) {
			index = i;
			break;
		}
	}
	if (index === -1) {
		return "0";
	} else {
		let eStr = calc(str + "|!e");
		let parts = eStr.split(/e/i);
		parts[0] = calc(parts[0] + "|=" + String(bit - 1));
		return parts[0] + "e" + parts[1];
	}
}
// 把一个数据不损失有效数字地转化成科学计数法

function standardByLevel(str, level) {
	let eStr = calc(str + "| !e");
	let parts = eStr.split(/e/i);
	// 先转化成科学计数法处理
	let result = "";
	parts[0] = calc(parts[0] + "| ~6 , =" + String(Number(parts[1]) - level));
	result = parts[0] + "e" + parts[1];
	let bit = getBit(parts[0]);
	// 保留位数工作结束
	if (
		(Number(parts[1]) <= -3 && Number(parts[1]) - bit < -4) ||
		Number(parts[1]) >= bit
	) {
		return result;
	} else {
		return calc(result + "| = level", { level: -level });
	}
}
// 获取数据的精度
function standardByBit(str, bit) {
	function roundToPrecision(num, precision) {
		if (num === 0) {
			return "0";
		}
		let factor = Math.pow(
			10,
			precision - Math.floor(Math.log10(Math.abs(num))) - 1
		);
		let n = num * factor;
		let decimal = n - Math.floor(n);
		let integral = Math.floor(n);

		if (decimal < 0.5) {
			n = integral;
		} else if (decimal > 0.5) {
			n = integral + 1;
		} else {
			// 当小数部分正好为0.5时
			if (integral % 2 === 0 && n - integral === 0.5) {
				// 如果整数部分是偶数，并且除0.5外没有其他小数
				n = integral;
			} else {
				n = integral + 1;
			}
		}

		let result = n / factor;
		if (
			Math.abs(result) >= Math.pow(10, precision) ||
			(Math.abs(result) < 0.01 &&
				result !== 0 &&
				1000 * Math.abs(result) -
					Math.floor(1000 * Math.abs(result)) !==
					0)
		) {
			return result.toExponential(precision - 1);
		} else {
			return result.toFixed(
				Math.max(
					0,
					precision - Math.floor(Math.log10(Math.abs(result))) - 1
				)
			);
		}
	}
	// 把一个数据不损失地四舍六入到某位（或添加到某位）
	return roundToPrecision(Number(str), bit);
}
// 按有效位数标准化数据

function toPercent(str) {
	if (str === "0") {
		return str;
	}
	let bit = getBit(str);
	return standardByBit(calc(str + "* 100"), bit) + "%";
}
// 不损失有效数字地用百分数表示数据
function replaceAt(string, index, replacement) {
	let chars = string.split("");
	chars[index] = replacement;
	return chars.join("");
}
// 替换某位数据

function toPositive(str) {
	let index = str.indexOf("-");
	if (index !== -1) {
		str = replaceAt(str, index, "");
	}
	return str;
}
// 取绝对值
function errorMode(str) {
	let eStr = toScientific(str);
	// 先转化成等有效位数的科学计数法表示
	let parts = eStr.split(/e/i);
	let dotIndex = parts[0].indexOf(".");
	if (dotIndex === -1) {
		if (parts[0] === "1" || parts[0] === "2") {
			eStr = parts[0] + ".0e" + parts[1];
		}
		let level = getLevel(eStr);
		let bit = getBit(parts[0]);
		if (Number(parts[1]) <= -3 || Number(parts[1]) >= bit) {
			return eStr;
		} else {
			return calc(eStr + "| = level", { level: -level });
		}
	}
	// 科学计数法的前面没有小数点，说明只有一位数字，稍作处理，直接返回
	else {
		function insertString(original, index, stringToInsert) {
			return (
				original.substring(0, index) +
				stringToInsert +
				original.substring(index)
			);
		}
		// 在某位插入数据

		let result = "";
		let [integerPart, decimalPart] = parts[0].split(".");
		let simpleStr = integerPart + decimalPart;
		// 处理simpleStr这个纯数字的字符串，最后用dotIndex插入小数点
		let length = simpleStr.length;
		let index = 100;
		for (let i = 0; i < length; i++) {
			if (
				simpleStr[i] !== "0" &&
				simpleStr[i] !== "+" &&
				simpleStr[i] !== "-"
			) {
				index = i;
				simpleStr = simpleStr.slice(0, index + 3);
				break;
			}
		}
		// 找到simpleStr中第一个不为0的数字，并最多保留三位
		if (index + 2 <= length - 1) {
			// 考虑三位数字
			if (simpleStr[index] === "1" || simpleStr[index] === "2") {
				// 第一位为1或2，考虑第三位数字
				if (simpleStr[index + 2] !== "0") {
					// 要进位
					if (simpleStr[index + 1] !== "9") {
						simpleStr = replaceAt(
							simpleStr,
							index + 1,
							String(Number(simpleStr[index + 1]) + 1)
						);
						simpleStr = replaceAt(simpleStr, index + 2, "");
					}
					// 一般进位
					else {
						simpleStr = replaceAt(
							simpleStr,
							index,
							String(Number(simpleStr[index]) + 1)
						);
						if (simpleStr[index] === "3") {
							simpleStr = replaceAt(simpleStr, index + 1, "");
							simpleStr = replaceAt(simpleStr, index + 1, "");
						} else {
							simpleStr = replaceAt(simpleStr, index + 1, "0");
							simpleStr = replaceAt(simpleStr, index + 2, "");
						}
					}
					// 特殊进位
				} else {
					simpleStr = replaceAt(simpleStr, index + 2, "");
				}
				// 不用进位，直接舍去最后一位
			}
			// 需保留两位的情况
			else {
				// 只保留一位
				if (simpleStr[index + 1] !== "0") {
					// 要进位
					if (simpleStr[index] !== "9") {
						simpleStr = replaceAt(
							simpleStr,
							index,
							String(Number(simpleStr[index]) + 1)
						);
						simpleStr = replaceAt(simpleStr, index + 1, "");
						simpleStr = replaceAt(simpleStr, index + 1, "");
					}
					// 一般进位
					else {
						if (
							index !== 0 &&
							simpleStr[index - 1] !== "+" &&
							simpleStr[index - 1] !== "-"
						) {
							simpleStr = replaceAt(simpleStr, index - 1, "1");
							simpleStr = replaceAt(simpleStr, index, "0");
							simpleStr = replaceAt(simpleStr, index + 1, "");
							simpleStr = replaceAt(simpleStr, index + 1, "");
						}
						// 前面已经有数字了，改成1
						else {
							if (index !== 0) {
								// 有符号
								simpleStr = insertString(simpleStr, 1, "1");
								simpleStr = replaceAt(
									simpleStr,
									index + 1,
									"0"
								);
								simpleStr = replaceAt(simpleStr, index + 2, "");
								simpleStr = replaceAt(simpleStr, index + 2, "");
							} else {
								// 没符号
								simpleStr = replaceAt(simpleStr, index, "0");
								simpleStr = "1" + simpleStr;
								simpleStr = replaceAt(simpleStr, index + 2, "");
								simpleStr = replaceAt(simpleStr, index + 2, "");
							}
							let part1 = simpleStr.slice(0, dotIndex + 1);
							let part2 = simpleStr.slice(dotIndex + 1);
							result = part1 + "." + part2;
						}
					}
					// 特殊进位
				} else {
					simpleStr = replaceAt(simpleStr, index + 1, "");
					simpleStr = replaceAt(simpleStr, index + 1, "");
				}
				// 不进位
			}
			// 只保留一位的情况
		}
		// 处理保留了三位的情况
		else if (index + 1 <= length - 1) {
			if (simpleStr[index] !== "1" && simpleStr[index] !== "2") {
				if (simpleStr[index + 1] !== "0") {
					// 要进位
					if (simpleStr[index] !== "9") {
						simpleStr = replaceAt(
							simpleStr,
							index,
							String(Number(simpleStr[index]) + 1)
						);
						simpleStr = replaceAt(simpleStr, index + 1, "");
						simpleStr = replaceAt(simpleStr, index + 1, "");
					}
					// 一般进位
					else {
						if (
							index !== 0 &&
							simpleStr[index - 1] !== "+" &&
							simpleStr[index - 1] !== "-"
						) {
							simpleStr = replaceAt(simpleStr, index - 1, "1");
							simpleStr = replaceAt(simpleStr, index, "0");
							simpleStr = replaceAt(simpleStr, index + 1, "");
							simpleStr = replaceAt(simpleStr, index + 1, "");
						}
						// 前面已经有数字了，改成1
						else {
							if (index !== 0) {
								// 有符号
								simpleStr = insertString(simpleStr, 1, "1");
								simpleStr = replaceAt(
									simpleStr,
									index + 1,
									"0"
								);
								simpleStr = replaceAt(simpleStr, index + 2, "");
								simpleStr = replaceAt(simpleStr, index + 2, "");
							} else {
								// 没符号
								simpleStr = replaceAt(simpleStr, index, "0");
								simpleStr = "1" + simpleStr;
								simpleStr = replaceAt(simpleStr, index + 2, "");
								simpleStr = replaceAt(simpleStr, index + 2, "");
							}
							let part1 = simpleStr.slice(0, dotIndex + 1);
							let part2 = simpleStr.slice(dotIndex + 1);
							result = part1 + "." + part2;
						}
					}
					// 特殊进位
				} else {
					simpleStr = replaceAt(simpleStr, index + 1, "");
					simpleStr = replaceAt(simpleStr, index + 1, "");
				}
				// 不进位
			}
			// 只保留一位的情况。保留两位的情况此时无需处理。
		}
		// 处理保留了两位的情况
		else {
			if (simpleStr[index] === "1" || simpleStr[index] === "2") {
				simpleStr = replaceAt(simpleStr, index + 1, "0");
			}
		}
		// 处理保留了一位的情况
		if (result === "") {
			let part1 = simpleStr.slice(0, dotIndex);
			let part2 = simpleStr.slice(dotIndex);
			result = part1 + "." + part2;
		}
		if (result[result.length - 1] === ".") {
			result = replaceAt(result, result.length - 1, "");
			if (
				result.length > 1 &&
				result[result.length - 2] !== "+" &&
				result[result.length - 2] !== "-"
			) {
				result = insertString(result, result.length - 1, ".");
				parts[1] = String(Number(parts[1]) + 1);
			}
		}
		// 处理特殊情况
		let resultBit = getBit(result);
		result = result + "e" + parts[1];
		if (
			Number(parts[1]) > resultBit ||
			(Number(parts[1]) <= -3 && Number(parts[1]) - resultBit < -4)
		) {
			return result;
		} else {
			return standardByBit(result, resultBit);
		}
	}
}
// 把数据按不确定度方式保留位数

export {
	Check,
	bitToLevel,
	levelToBit,
	dimensionalAdd,
	evaluateExpression,
	evaluateUncer,
	calculateLeastSquares,
	calculateQuadraticLeastSquares,
	getLevel,
	getBit,
	toScientific,
	standardByBit,
	standardByLevel,
	toPercent,
	toPositive,
	errorMode,
};
