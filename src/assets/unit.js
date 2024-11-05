import { divide } from "mathjs";

/**单位相关函数 */
const Unit = (function () {
    const constructRegex = /\s*[*/()]+\s*|\s*[-+]?\d+\s*|\s*[a-zA-Z]+\s*/g;
    /**
     *  判断是否是字母
     * @param {*} str
     * @returns   {boolean}
     */
    function isLetter(str){
        return /[a-zA-Z]+/.test(str)
    }

    /**
     *  判断是否是数字
     * @param {*} str
     * @returns   {boolean}
     */
    function isNumber(str){
        return Number(str)!==NaN
    }

	return {
        /**  构造一个单位对象
         *
         * @param {string} str
         * @returns   {object}
         */
		construct: function (str) {
			if (str === "") {
				return {};
			}
            let arr = str.match(constructRegex)
            if(arr){
                arr = arr.map(match => match.trim())
            }
            else{
                return {}
            }
            let unit = {}
            let inDivisionParen = false
            // 这里的匹配要求用户输入不要发电
            for (let i = 0; i < arr.length; i++) {
                // 是字母
                if(isLetter(arr[i])){
                    if(arr[i+1] && isNumber(arr[i+1])){
                        if(inDivisionParen){
                            unit[arr[i]] = -Number(arr[i+1])
                        }
                        else{
                             unit[arr[i]] = Number(arr[i + 1]);
                        }
                        i = i+2
                    }
                    else{
                        unit[arr[i]] = 1
                        i++
                    }
                }
                else {
                    // 乘法，直接算下一个
                    if(arr[i]==='*'){
                        i++
                    }
                    // 除法，就地处理
                    else if(arr[i]==='/'){
                        if(arr[i+1]==='('){
                            inDivisionParen = true
                            i = i+2
                        }
                        else{
                            if(arr[i+2]&&isNumber(arr[i+2])){
                                unit[arr[i+1]] = -Number(arr[i+2])
                                i = i+3
                            }
                            else{
                                unit[arr[i+1]] = -1
                                i = i+2
                            }
                        }
                    }
                    // 结束除法括号
                    else if(arr[i]===')'){
                        inDivisionParen = false
                        i++
                    }
                    else if(arr[i]==='('){
                        i++
                    }
                }
            }
            return unit;
		},

        /** 乘法
         *
         * @param {object} a
         * @param {object} b
         * @returns   {object}
         */
        multiply: function(a,b){
            let result = {}
            for(let key in a){
                result[key] = a[key]
            }
            for(let key in b){
                if(result[key]){
                    result[key] += b[key]
                }
                else{
                    result[key] = b[key]
                }
            }
            for(let key in result){
                if(result[key]===0){
                    delete result[key]
                }
            }
            return result
        },

        /** 除法
         *
         * @param {object} a
         * @param {object} b
         * @returns   {object}
         */
        divide: function(a,b){
            let result = {}
            for(let key in a){
                result[key] = a[key]
            }
            for(let key in b){
                if(result[key]){
                    result[key] -= b[key]
                }
                else{
                    result[key] = -b[key]
                }
            }
            for(let key in result){
                if(result[key]===0){
                    delete result[key]
                }
            }
        },
        
	};
})();
