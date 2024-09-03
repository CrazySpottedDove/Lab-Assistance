import {defineStore} from 'pinia'
import {ref} from 'vue'
import {calc} from 'a-calc'
function initState(){
    return{
        dataList:[],
        selectedDataIndex : -1,
        isLine:false,
        isReadme:true,
        isOutput:false,
        isNumberDoc:false,
        isUncerDoc:false,
        isPropertyDoc:false,
    }
}
import { create, all, typed, exp } from 'mathjs';
//Don't import { ElMessage } from 'element-plus'
const config = {
  // 可以选择在这里添加其他配置，如处理大数等
};
const math = create(all, config)
const math1 = create(all, config)
const math3 = create(all, config)
// 导入自定义运算
math1.import({
  // 自定义乘法
  multiply: typed('multiply', {
    'Array, Array': function (a, b) {
      let length1 = a.length
      let length2 = b.length
      let c = []
      if(length1 === 0 || length2 === 0){
        return []
      }
      if(length1 === 1){
        for(let i = 0; i<length2;i++){
            let tmpBit = Math.min(a[0].bit,b[i].bit)
            let tmpRawData = standardByBit(calc(`(${a[0].rawData}) * (${b[i].rawData})`),tmpBit+1)
            let tmpLevel = getLevel(standardByBit(calc(`(${a[0].rawData}) * (${b[i].rawData})`),tmpBit))
            c[i] = {
                bit:tmpBit,
                rawData:tmpRawData,
                level:tmpLevel
            }
        }
      }
      else if(length2 === 1){
        for(let i = 0; i<length1;i++){
            let tmpBit = Math.min(b[0].bit,a[i].bit)
            let tmpRawData = standardByBit(calc(`(${b[0].rawData}) * (${a[i].rawData})`),tmpBit+1)
            let tmpLevel = getLevel(standardByBit(calc(`(${b[0].rawData}) * (${a[i].rawData})`),tmpBit))
            c[i] = {
                bit:tmpBit,
                rawData:tmpRawData,
                level:tmpLevel
            }
        }
      }
      else{
        if(length1 === length2){
            for(let i = 0; i<length1;i++){
                let tmpBit = Math.min(a[i].bit,b[i].bit)
                let tmpRawData = standardByBit(calc(`(${a[i].rawData}) * (${b[i].rawData})`),tmpBit+1)
                let tmpLevel = getLevel(standardByBit(calc(`(${a[i].rawData}) * (${b[i].rawData})`),tmpBit))
                c[i] = {
                    bit:tmpBit,
                    rawData:tmpRawData,
                    level:tmpLevel
                }
            }
        }
        else{
            ElMessage.error('数组的长度不一致！')
            return []
        }
      }
      return c
    },
    'Array, number': function (a, b) {
      let length = a.length
      if(length === 0){
        return []
      }
      let c = []
      for(let i =0;i<length;i++){
        let maxLevel = Math.floor(Math.log10(Math.abs(b)))
        let tmpLevel = a[i].level + maxLevel
        let tmpRawData = standardByLevel(calc(`(${a[i].rawData})*(${String(b)})`),tmpLevel-1)
        let tmpBit = countSignificantDigits(standardByLevel(calc(`(${standardByBit(a[i].rawData,a[i].bit)})*(${String(b)})`),tmpLevel))
        c[i] = {
            bit:tmpBit,
            rawData:tmpRawData,
            level:tmpLevel
        }
      }
      return c
    },
    'number, Array': function (b, a) {
      let length = a.length
      if(length === 0){
        return []
      }
      let c = []
      for(let i =0;i<length;i++){
        let maxLevel = Math.floor(Math.log10(Math.abs(b)))
        let tmpLevel = a[i].level + maxLevel
        let tmpRawData = standardByLevel(calc(`(${a[i].rawData})*(${String(b)})`),tmpLevel-1)
        let tmpBit = countSignificantDigits(standardByLevel(calc(`(${standardByBit(a[i].rawData,a[i].bit)})*(${String(b)})`),tmpLevel))
        c[i] = {
            bit:tmpBit,
            rawData:tmpRawData,
            level:tmpLevel
        }
      }
      return c
    },
    'any, any': function (a, b) {
      return math.multiply(a, b);
    }
  }),
  // 自定义除法
  divide: typed('divide', {
    'Array, Array': function (a, b) {
      let length1 = a.length
      let length2 = b.length
      let c = []
      if(length1 === 0 || length2 === 0){
        return []
      }
      if(length1 === 1){
        for(let i = 0; i<length2;i++){
            let tmpBit = Math.min(a[0].bit,b[i].bit)
            let tmpRawData = standardByBit(calc(`(${a[0].rawData}) / (${b[i].rawData})`),tmpBit+1)
            let tmpLevel = getLevel(standardByBit(calc(`(${a[0].rawData}) / (${b[i].rawData})`),tmpBit))
            c[i] = {
                bit:tmpBit,
                rawData:tmpRawData,
                level:tmpLevel
            }
        }
      }
      else if(length2 === 1){
        for(let i = 0; i<length1;i++){
            let tmpBit = Math.min(b[0].bit,a[i].bit)
            let tmpRawData = standardByBit(calc(`(${a[i].rawData}) / (${b[0].rawData})`),tmpBit+1)
            let tmpLevel = getLevel(standardByBit(calc(`(${a[i].rawData}) / (${b[0].rawData})`),tmpBit))
            c[i] = {
                bit:tmpBit,
                rawData:tmpRawData,
                level:tmpLevel
            }
        }
      }
      else{
        if(length1 === length2){
            for(let i = 0; i<length1;i++){
                console.log(a[i])
                console.log(b[i])
                let tmpBit = Math.min(a[i].bit,b[i].bit)
                let tmpRawData = standardByBit(calc(`(${a[i].rawData}) / (${b[i].rawData})`),tmpBit+1)
                let tmpLevel = getLevel(standardByBit(calc(`(${a[i].rawData}) / (${b[i].rawData})`),tmpBit))
                c[i] = {
                    bit:tmpBit,
                    rawData:tmpRawData,
                    level:tmpLevel
                }
            }
        }
        else{
            ElMessage.error('数组的长度不一致！')
            return []
        }
      }
      return c
    },
    'Array, number': function (a, b) {
      let length = a.length
      if(length === 0){
        return []
      }
      let c = []
      for(let i =0;i<length;i++){
        let maxLevel = Math.floor(Math.log10(Math.abs(b)))
        let tmpLevel = a[i].level - maxLevel
        let tmpRawData = standardByLevel(calc(`(${a[i].rawData})/(${String(b)})`),tmpLevel-1)
        let tmpBit = countSignificantDigits(standardByLevel(calc(`(${standardByBit(a[i].rawData,a[i].bit)})/(${String(b)})`),tmpLevel))
        c[i] = {
            bit:tmpBit,
            rawData:tmpRawData,
            level:tmpLevel
        }
      }
      return c
    },
    'number, Array': function (b, a) {
      let length = a.length
      if(length === 0){
        return []
      }
      let c = []
      for(let i =0;i<length;i++){
        let tmpBit = a[i].bit
        let tmpRawData = standardByBit(calc(`(${String(b)})/(${a[i].rawData})`),tmpBit+1)
        let tmpLevel = getLevel(standardByBit(calc(`(${String(b)})/(${standardByBit(a[i].rawData,tmpBit)})`),tmpBit))
        c[i] = {
            bit:tmpBit,
            rawData:tmpRawData,
            level:tmpLevel
        }
      }
      return c
    },
    'any, any': function (a, b) {
      return math.divide(a, b);
    }
  }),
  add: typed('add', {
    'Array,Array': function(a,b){
        let length1 = a.length
        let length2 = b.length
        if(length1 === 0 || length2 === 0){
            return []
        }
        let c = []
        if(length1 === 1){
            for(let i = 0;i<length2;i++){
                let tmpLevel = Math.max(a[0].level,b[i].level)
                let tmpRawData = standardByLevel(calc(`(${a[0].rawData})+(${b[i].rawData})`),tmpLevel-1)
                let tmpBit = countSignificantDigits(standardByLevel(calc(`(${a[0].rawData})+(${b[i].rawData})`),tmpLevel))
                c[i] = {
                    bit:tmpBit,
                    rawData:tmpRawData,
                    level:tmpLevel
                }
            }
        }
        else if(length2 === 1){
            for(let i = 0;i<length1;i++){
                let tmpLevel = Math.max(b[0].level,a[i].level)
                let tmpRawData = standardByLevel(calc(`(${b[0].rawData})+(${a[i].rawData})`),tmpLevel-1)
                let tmpBit = countSignificantDigits(tmpRawDatstandardByLevel(calc(`(${b[0].rawData})+(${a[i].rawData})`),tmpLevel))
                c[i] = {
                    bit:tmpBit,
                    rawData:tmpRawData,
                    level:tmpLevel
                }
            }
        }
        else{
            if(length1 === length2){
                for(let i = 0;i<length1;i++){
                    let tmpLevel = Math.max(b[i].level,a[i].level)
                    let tmpRawData = standardByLevel(calc(`(${b[i].rawData})+(${a[i].rawData})`),tmpLevel-1)
                    let tmpBit = countSignificantDigits(standardByLevel(calc(`(${b[i].rawData})+(${a[i].rawData})`),tmpLevel))
                    c[i] = {
                        bit:tmpBit,
                        rawData:tmpRawData,
                        level:tmpLevel
                    }
                }
            }
            else{
                ElMessage.error('数组长度不一致！')
                return []
            }
        }
        return c
    },
    'Array,number': function(a,b){
        let length = a.length
        if(length === 0){
            return []
        }
        let c = []
        for(let i = 0;i<length;i++){
            let tmpLevel = a[i].level
            let tmpRawData = standardByLevel(calc(`(${a[i].rawData})+(${String(b)})`),tmpLevel-1)
            let tmpBit = countSignificantDigits(standardByLevel(calc(`(${standardByLevel(a[i].rawData,tmpLevel)})+(${String(b)})`),tmpLevel))
            c[i] = {
                bit:tmpBit,
                rawData:tmpRawData,
                level:tmpLevel
            }
        }
        return c
    },
    'number,Array': function(b,a){
        let length = a.length
        if(length === 0){
            return []
        }
        let c = []
        for(let i = 0;i<length;i++){
            let tmpLevel = a[i].level
            let tmpRawData = standardByLevel(calc(`(${a[i].rawData})+(${String(b)})`),tmpLevel-1)
            let tmpBit = countSignificantDigits(standardByLevel(calc(`(${standardByLevel(a[i].rawData,tmpLevel)})+(${String(b)})`),tmpLevel))
            c[i] = {
                bit:tmpBit,
                rawData:tmpRawData,
                level:tmpLevel
            }
        }
        return c
    },
    'number, number':function(obj1, obj2){
        return obj1 + obj2
    },
  }),
  subtract: typed('subtract', {
    'Array,Array': function(a,b){
        let length1 = a.length
        let length2 = b.length
        if(length1 === 0 || length2 === 0){
            return []
        }
        let c = []
        if(length1 === 1){
            for(let i = 0;i<length2;i++){
                let tmpLevel = Math.max(a[0].level,b[i].level)
                let tmpRawData = standardByLevel(calc(`(${a[0].rawData})-(${b[i].rawData})`),tmpLevel-1)
                let tmpBit = countSignificantDigits(standardByLevel(calc(`(${a[0].rawData})-(${b[i].rawData})`),tmpLevel))
                c[i] = {
                    bit:tmpBit,
                    rawData:tmpRawData,
                    level:tmpLevel
                }
            }
        }
        else if(length2 === 1){
            for(let i = 0;i<length1;i++){
                let tmpLevel = Math.max(b[0].level,a[i].level)
                let tmpRawData = standardByLevel(calc(`(${a[i].rawData})-(${b[0].rawData})`),tmpLevel-1)
                let tmpBit = countSignificantDigits(standardByLevel(calc(`(${a[i].rawData})-(${b[0].rawData})`),tmpLevel))
                c[i] = {
                    bit:tmpBit,
                    rawData:tmpRawData,
                    level:tmpLevel
                }
            }
        }
        else{
            if(length1 === length2){
                for(let i = 0;i<length1;i++){
                    let tmpLevel = Math.max(b[i].level,a[i].level)
                    let tmpRawData = standardByLevel(calc(`(${a[i].rawData})-(${b[i].rawData})`),tmpLevel-1)
                    let tmpBit = countSignificantDigits(standardByLevel(calc(`(${a[i].rawData})-(${b[i].rawData})`),tmpLevel))
                    c[i] = {
                        bit:tmpBit,
                        rawData:tmpRawData,
                        level:tmpLevel
                    }
                }
            }
            else{
                ElMessage.error('数组长度不一致！')
                return []
            }
        }
        return c
    },
    'Array,number': function(a,b){
        let length = a.length
        if(length === 0){
            return []
        }
        let c = []
        for(let i = 0;i<length;i++){
            let tmpLevel = a[i].level
            let tmpRawData = standardByLevel(calc(`(${a[i].rawData})-(${String(b)})`),tmpLevel-1)
            let tmpBit = countSignificantDigits(standardByLevel(calc(`(${standardByLevel(a[i].rawData,tmpLevel)})-(${String(b)})`),tmpLevel))
            c[i] = {
                bit:tmpBit,
                rawData:tmpRawData,
                level:tmpLevel
            }
        }
        return c
    },
    'number,Array': function(b,a){
        let length = a.length
        if(length === 0){
            return []
        }
        let c = []
        for(let i = 0;i<length;i++){
            let tmpLevel = a[i].level
            let tmpRawData = standardByLevel(calc(`(${String(b)})-(${a[i].rawData})`),tmpLevel-1)
            let tmpBit = countSignificantDigits(standardByLevel(calc(`(${String(b)})-(${standardByLevel(a[i].rawData,tmpLevel)})`),tmpLevel))
            c[i] = {
                bit:tmpBit,
                rawData:tmpRawData,
                level:tmpLevel
            }
        }
        return c
    },
    'number, number': function (obj1, obj2) {
        return obj1-obj2
    },
  }),
  ln:typed('ln',{
    'Array':function(x){
        let length = x.length
        if(length === 0){
            return []
        }
        let result = []
        for(let i = 0; i<length;i++){
            if(Number(x[i].rawData)<=0){
                ElMessage.error('不可对非正数取对数！')
                return []
            }
            let tmpLevel = -x[i].bit
            let tmpRawData = standardByLevel(String(Math.log(Number(x[i].rawData))),tmpLevel-1)
            let tmpBit = countSignificantDigits(standardByLevel(String(Math.log(Number(x[i].rawData))),tmpLevel))
            result[i] = {
                bit:tmpBit,
                rawData:tmpRawData,
                level:tmpLevel
            }
        }
        return result
    },
    'number':function(x){
        if(x <= 0){
            ElMessage.error('不可对非正数取对数！')
            return []
        }
        return Math.log(x)
    }
  }),
  sqrt:typed('sqrt',{
    'Array':function (x) {
        let length = x.length
        if(length === 0){
            return []
        }
        let result = []
        for(let i = 0; i<length; i++){
            if(Number(x[i].rawData)<0){
                ElMessage.error('不可对负数取根号！')
                return []
            }
            let tmpBit = x[i].bit
            let tmpRawData = standardByBit(String(Math.sqrt(Number(x[i].rawData))),tmpBit+1)
            let tmpLevel = getLevel(standardByBit(String(Math.sqrt(Number(x[i].rawData))),tmpBit))
            result[i] = {
                bit:tmpBit,
                rawData:tmpRawData,
                level:tmpLevel
            }
        }
        return result
    },
    'number':function(x){
        if(x < 0 ){
            ElMessage.error('不可对负数取平方根！')
            return []
        }
        return Math.sqrt(x)
    }
  })
}, { override: true });
// 数值计算规则
math3.import({
  // 自定义乘法
  multiply: typed('multiply', {
    'Object, Object':function(obj1, obj2){
        return {
            data:calc(`(${obj1.data})*(${obj2.data})`),
            uncer:String(math.sqrt(math.pow(Number(obj1.data)*Number(obj2.uncer),2)+math.pow(Number(obj1.uncer)*Number(obj2.data),2)))
        }
    },
    'number, number':function(obj1, obj2){
        return{
            data: String(obj1*obj2),
            uncer:'0'
        }
    },
    'Object, number':function(obj1, obj2){
        return {
            data:String(Number(obj1.data)*obj2),
            uncer:toPositive(String(Number(obj1.uncer)*obj2))
        }
    },
    'number, Object':function(obj1, obj2){
        return {
            data:String(Number(obj2.data)*obj1),
            uncer:toPositive(String(Number(obj2.uncer)*obj1))
        }
    },
  }),
  // 自定义除法
  divide: typed('divide', {
    'Object, Object':function(obj1, obj2){
        return {
            data:calc(`(${obj1.data}) / (${obj2.data})`),
            uncer:String(math.sqrt(math.pow(Number(obj1.uncer)/Number(obj2.data),2)+math.pow(Number(obj1.data)/Number(obj2.data)/Number(obj2.data)*Number(obj2.uncer),2)))
        }
    },
    'number, number':function(obj1, obj2){
        return{
            data: String(obj1/obj2),
            uncer:'0'
        }
    },
    'Object, number':function(obj1, obj2){
        return {
            data:String(Number(obj1.data)/obj2),
            uncer:toPositive(String(Number(obj1.uncer)/obj2))
        }
    },
    'number, Object':function(obj1, obj2){
        return {
            data:String(obj1/Number(obj2.data)),
            uncer:toPositive(calc(`(${obj2.uncer})*(${String(obj1)})/(${obj2.data})/(${obj2.data})`))
        }
    }
  }),
  add: typed('add', {
    'Object, Object': function (obj1, obj2) {
        return{
            data:String(Number(obj1.data)+Number(obj2.data)),
            uncer:String(math.sqrt(math.pow(Number(obj1.uncer),2)+math.pow(Number(obj2.uncer),2)))
        }
    },
    'number, Object': function (obj1, obj2){
        return{
            data:String(obj1+Number(obj2.data)),
            uncer:obj2.uncer
        }
    },
    'Object, number': function (obj1, obj2){
        return{
            data:String(Number(obj1.data)+obj2),
            uncer:obj1.uncer
        }
    },
    'number, number':function(obj1, obj2){
        return{
            data:obj1+obj2,
            uncer:'0'
        }
    },
  }),
  subtract: typed('subtract', {
    'Object, Object': function (obj1, obj2) {
        return{
            data:String(Number(obj1.data)-Number(obj2.data)),
            uncer:String(math.sqrt(math.pow(Number(obj1.uncer),2)+math.pow(Number(obj2.uncer),2)))
        }
    },
    'number, Object': function (obj1, obj2){
        return{
            data:String(obj1-Number(obj2.data)),
            uncer:obj2.uncer
        }
    },
    'Object, number': function (obj1, obj2){
        return{
            data:String(Number(obj1.data)-obj2),
            uncer:obj1.uncer
        }
    },
    'number, number':function(obj1, obj2){
        return{
            data:obj1-obj2,
            uncer:'0'
        }
    },
  }),
  ln:typed('ln',{
    'Object':function(x){
        return{
            data:String(Math.log(Math.abs(Number(x.data)))),
            uncer:calc(`(${x.uncer})/(${x.data})`)
        }
    },
    'number':function(x){
        if(x<=0){
            ElMessage.error('不确定度运算：不可对非正数取对数！已修正为绝对值！')
            x = -x
        }
        if(x === 0){
            return{
                data:'0',
                uncer:'0'
            }
        }
        return{
            data:String(Math.log(x)),
            uncer:'0'
        }
    }
  }),
  sqrt:typed('sqrt',{
    'Object':function(x){
        return{
            data:String(Math.sqrt(Math.abs(Number(x.data)))),
            uncer:calc(`(${x.uncer})/(${String(Math.sqrt(Math.abs(Number(x.data))))})/2`)
        }
    },
    'number':function(x){
        if(x<0){
            ElMessage.error('不确定度运算：不可对负数取平方根！已修正为绝对值！')
            x = -x
        }
        if(x == 0){
            return{
                data:'0',
                uncer:'0'
            }
        }
        return{
            data:String(Math.sqrt(x)),
            uncer:'0'
        }
    }
  })
}, { override: true });
// 不确定度计算规则
function escapeVariableName(variableName) {
    if(!variableName){
        return ''
    }
    // 用双引号包裹变量名，防止撇号引起解析错误
    let tmp = variableName.includes("'") ? variableName.replace(/'/g, "_apostrophe_") : variableName
    tmp = tmp.includes(",") ? tmp.replace(/,/g,"_comma_") : tmp
    return tmp
}
// 处理变量名规范
function escapeExpression(expression) {
    return escapeVariableName(expression)
}
// 处理表达式规范
function evaluateUncer(dataList, expression){
    const parser = math3.parser()
    dataList.forEach(item =>{
        parser.set(escapeVariableName(item.title),{data:item.analysis[0].propertyValue,uncer:item.moreUncer.wholeUncer})
    })
    try {
        // 直接使用 mathjs 解析器评估整个表达式
        //console.log(`Escaped expression: ${escapeExpression(expression)}`); // 调试输出
        let result = parser.evaluate(escapeExpression(expression));
        // 确保结果是数组
        // 返回计算结果
        return errorMode(result.uncer)
    } catch (error) {
        console.error("Error evaluating expression:", error);
        return '0';  // 错误处理，返回空数组
    }
}
// 依据计算式计算不确定度
function evaluateExpression(dataList, expression, option) {
    const parser = math1.parser();  // 使用 math1 实例创建解析器
    // 为每个数据集加载其 rawData 数组到解析器环境
    if(option === 'forAll'){
        dataList.forEach(item => {
            // let rawDataArray = item.dataSet.map(obj => obj.rawData)
            // parser.set(item.title, rawDataArray)
            //console.log(escapeVariableName(item.title))
            parser.set(escapeVariableName(item.title),item.dataSet)
        })
    }
    else if(option === 'forAvg'){
        dataList.forEach(item => {
            // parser.set(item.title, Number(item.analysis[0].propertyValue))
            let tmpRawData = item.analysis[0].propertyValue
            parser.set(escapeVariableName(item.title),[
                {
                    rawData:tmpRawData,
                    level:getLevel(tmpRawData),
                    bit:countSignificantDigits(tmpRawData)
                }
            ])
        })
    }
    try {
        // 直接使用 mathjs 解析器评估整个表达式
        let result = parser.evaluate(escapeExpression(expression));
        // 确保结果是数组
        if (!Array.isArray(result)) {
            result = [result];
        }
        // 返回计算结果
        result.forEach(item=>{
            item.rawData = standardByBit(item.rawData,item.bit)
        })
        return result
    } catch (error) {
        console.error("Error evaluating expression:", error);
        return [];  // 错误处理，返回空数组
    }
}
// 依据计算式计算值
function calculateLeastSquares(x, y) {
    if (x.length !== y.length) {
        ElMessage.error('数组长度不一致！')
        return {}
    }
    if (x.length === 0) {
        ElMessage.error('数组为空！')
        return {}
    }
    let n = x.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;
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
    let ssTot = 0, ssRes = 0;
    for (let i = 0; i < n; i++) {
        let yi = a * x[i] + b;
        ssRes += (y[i] - yi) ** 2;
        ssTot += (y[i] - (sumY / n)) ** 2;
    }
    let rSquared = 1 - ssRes / ssTot;
    return { slope: a, intercept: b, rSquared: rSquared , xAvg:sumX/n};
}
// 计算最小二乘直线
function calculateQuadraticLeastSquares(x, y) {
    if (x.length !== y.length) {
        ElMessage.error('数组长度不一致！');
        return {};
    }
    if (x.length === 0) {
        ElMessage.error('数组为空！');
        return {};
    }

    let n = x.length;
    let sumX = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0;
    let sumY = 0, sumXY = 0, sumX2Y = 0;
    let sumYY = 0;

    // Calculate sums
    for (let i = 0; i < n; i++) {
        let xi = x[i], yi = y[i];
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
        [sumX2, sumX, n]
    ];
    let vectorB = [sumX2Y, sumXY, sumY];

    // Solve the normal equations matrix using Cramer's Rule
    let detA = determinant3x3(matrixA);
    if (detA === 0) {
        ElMessage.error('矩阵不可逆！');
        return {};
    }

    let a = determinant3x3(replaceColumn(matrixA, vectorB, 0)) / detA;
    let b = determinant3x3(replaceColumn(matrixA, vectorB, 1)) / detA;
    let c = determinant3x3(replaceColumn(matrixA, vectorB, 2)) / detA;

    // Calculate R²
    let ssTot = 0, ssRes = 0;
    for (let i = 0; i < n; i++) {
        let yi = a * x[i] * x[i] + b * x[i] + c;
        ssRes += (y[i] - yi) ** 2;
        ssTot += (y[i] - (sumY / n)) ** 2;
    }
    let rSquared = 1 - ssRes / ssTot;

    return { a: a, b: b, c: c, rSquared: rSquared , xAvg:sumX/n};
}
// 二次拟合

function determinant3x3(matrix) {
    return matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
           matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
           matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]);
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
function getLevel(str){
    // 获得最小位数
    let trimmedStr = str.trim()
    if (isNaN(Number(trimmedStr))) {
        return 0; // 不是有效数字，返回0
    }
    trimmedStr = trimmedStr.replace(/^[+-]/, '')
    // 除去加减符号
    if (/e/i.test(trimmedStr)) {
        let parts = trimmedStr.split(/e/i);
        //return Number(parts[1])-countSignificantDigits(parts[0]) + 1
        return Number(parts[1])+getLevel(parts[0])
    }
    // 处理科学计数法数字
    let [integerPart, decimalPart] = trimmedStr.split('.')
    if(decimalPart === undefined){
        let length = integerPart.length
        integerPart = integerPart.replace(/0+$/,'')
        return length - integerPart.length
    }
    else{
        return -decimalPart.length
    }
    // 处理一般数字
}
// 获得一个数据的精度
function toScientific(str){
    if(/e/i.test(str)){
        return str
    }
    let bit = countSignificantDigits(str)
    let length = str.length
    let index = -1
    for (let i = 0 ; i < length; i++){
        if(str[i] !== '0' && str[i] !== '.' && str[i] !== '+' && str[i] !== '-'){
            index = i
            break
        }
    }
    if(index === -1){
        return '0'
    }
    else{
        let eStr = calc(str + '|!e')
        let parts = eStr.split(/e/i)
        parts[0] = calc(parts[0] + '|=' + String(bit-1))
        return parts[0] + 'e' + parts[1]
    }
}
// 把一个数据不损失有效数字地转化成科学计数法
function roundToPrecision(num, precision) {
    if(num === 0){
        return '0'
    }
    let factor = Math.pow(10, precision - Math.floor(Math.log10(Math.abs(num))) - 1);
    let n = num * factor;
    let decimal = n - Math.floor(n);
    let integral = Math.floor(n);

    if (decimal < 0.5) {
        n = integral;
    } else if (decimal > 0.5) {
        n = integral + 1;
    } else {
        // 当小数部分正好为0.5时
        if ((integral % 2 === 0) && (n - integral === 0.5)) {
            // 如果整数部分是偶数，并且除0.5外没有其他小数
            n = integral;
        } else {
            n = integral + 1;
        }
    }

    let result = n / factor;
    if (Math.abs(result) >= Math.pow(10, precision) || (Math.abs(result) < 0.01 && result !== 0 && 1000*Math.abs(result) - Math.floor(1000*Math.abs(result)) !== 0)) {
        return result.toExponential(precision - 1);
    } else {
        return result.toFixed(Math.max(0, precision - Math.floor(Math.log10(Math.abs(result))) - 1));
    }
}
// 把一个数据不损失地四舍六入到某位（或添加到某位）
function standardByBit(str,bit){
    return roundToPrecision(Number(str),bit)
}
// 按有效位数标准化数据
function toPercent(str){
    if(str === '0'){
        return str
    }
    let bit = countSignificantDigits(str)
    return standardByBit(calc(str +'* 100'),bit)+'%'
}
// 不损失有效数字地用百分数表示数据
function toPositive(str){
    let index = str.indexOf('-')
    if(index !== -1){
        str = replaceAt(str,index,'')
    }
    return str
}
// 取绝对值
function replaceAt(string, index, replacement) {
    let chars = string.split('');
    chars[index] = replacement;
    return chars.join('');
}
// 替换某位数据
function insertString(original, index, stringToInsert) {
    return original.substring(0, index) + stringToInsert + original.substring(index);
}
// 在某位插入数据
function countSignificantDigits(str) {
    // 去掉字符串前后的空格并检查是否为有效数字
    str = String(str)
    let trimmedStr = str.trim();
    if (isNaN(Number(trimmedStr))) {
        return 0; // 不是有效数字，返回0
    }

    // 去掉数字前的正负号
    trimmedStr = trimmedStr.replace(/^[+-]/, '');

    // 处理科学记数法
    if (/e/i.test(trimmedStr)) {
        let parts = trimmedStr.split(/e/i);
        let significantDigits = countSignificantDigits(parts[0]);
        return significantDigits; // 返回科学记数法前的部分的有效数字位数
    }

    // 分离整数部分和小数部分
    let [integerPart, decimalPart] = trimmedStr.split('.');
    if(integerPart === '0'){
        integerPart = ''
        if(decimalPart !== undefined){
            decimalPart = decimalPart.replace(/^0+/, '')
        }
    }
    if (decimalPart === undefined) {
        decimalPart = ''
    }
    // 计算有效数字位数
    return integerPart.length + decimalPart.length;
}
// 获取数据的有效位数
function standardByLevel(str,level){
    let eStr = calc(str + '| !e')
    let parts = eStr.split(/e/i)
    // 先转化成科学计数法处理
    let result = ''
    parts[0] = calc(parts[0] + '| ~6 , =' + String(Number(parts[1])-level))
    result = parts[0] + 'e' + parts[1]
    let bit = countSignificantDigits(parts[0])
    // 保留位数工作结束
    if((Number(parts[1]) <= -3 && Number(parts[1]) - bit < -4)|| Number(parts[1]) >= bit){
        return result
    }
    else{
        return calc(result + '| = level',{level:-level})
    }
}
// 获取数据的精度
function errorMode(str){
    let eStr = toScientific(str)
    // 先转化成等有效位数的科学计数法表示
    let parts = eStr.split(/e/i)
    let dotIndex = parts[0].indexOf('.')
    if(dotIndex === -1){
        if(parts[0] === '1' || parts[0] === '2'){
            eStr = parts[0] +'.0e' + parts[1]
        }
        let level = getLevel(eStr)
        let bit = countSignificantDigits(parts[0])
        if(Number(parts[1]) <= -3 || Number(parts[1]) >= bit){
            return eStr
        }
        else{
            return calc(eStr + '| = level',{level:-level})
        }
    }
    // 科学计数法的前面没有小数点，说明只有一位数字，稍作处理，直接返回
    else{
        let result = ''
        let [integerPart , decimalPart] = parts[0].split('.')
        let simpleStr = integerPart + decimalPart
        // 处理simpleStr这个纯数字的字符串，最后用dotIndex插入小数点
        let length = simpleStr.length
        let index = 100
        for(let i = 0 ; i < length ; i++){
            if(simpleStr[i] !== '0' && simpleStr[i] !== '+' && simpleStr[i] !== '-'){
                index = i
                simpleStr = simpleStr.slice(0,index+3)
                break
            }
        }
        // 找到simpleStr中第一个不为0的数字，并最多保留三位
        if(index+2 <= length-1){
            // 考虑三位数字
            if(simpleStr[index] === '1' || simpleStr[index] === '2'){
                // 第一位为1或2，考虑第三位数字
                if(simpleStr[index+2] !== '0'){
                    // 要进位
                    if(simpleStr[index+1] !== '9'){
                        simpleStr = replaceAt(simpleStr,index+1,String((Number(simpleStr[index+1])+1)))
                        simpleStr = replaceAt(simpleStr,index+2,'')
                    }
                    // 一般进位
                    else{
                        simpleStr = replaceAt(simpleStr,index,String((Number(simpleStr[index])+1)))
                        if(simpleStr[index] === '3'){
                            simpleStr = replaceAt(simpleStr,index+1,'')
                            simpleStr = replaceAt(simpleStr,index+1,'')
                        }
                        else{
                            simpleStr = replaceAt(simpleStr,index+1,'0')
                            simpleStr = replaceAt(simpleStr,index+2,'')
                        }
                    }
                    // 特殊进位
                }
                else{
                    simpleStr = replaceAt(simpleStr,index+2,'')
                }
                // 不用进位，直接舍去最后一位
            }
            // 需保留两位的情况
            else{
                // 只保留一位
                if(simpleStr[index+1] !== '0'){
                    // 要进位
                    if(simpleStr[index] !== '9'){
                        simpleStr = replaceAt(simpleStr,index,String(Number(simpleStr[index])+1))
                        simpleStr = replaceAt(simpleStr,index+1,'')
                        simpleStr = replaceAt(simpleStr,index+1,'')
                    }
                    // 一般进位
                    else{
                        if(index !== 0 && simpleStr[index-1] !== '+' && simpleStr[index-1] !== '-'){
                            simpleStr = replaceAt(simpleStr,index-1,'1')
                            simpleStr = replaceAt(simpleStr,index,'0')
                            simpleStr = replaceAt(simpleStr,index+1,'')
                            simpleStr = replaceAt(simpleStr,index+1,'')
                        }
                        // 前面已经有数字了，改成1
                        else{
                            if(index !== 0){
                                // 有符号
                                simpleStr = insertString(simpleStr,1,'1')
                                simpleStr = replaceAt(simpleStr,index+1,'0')
                                simpleStr = replaceAt(simpleStr,index+2,'')
                                simpleStr = replaceAt(simpleStr,index+2,'')
                            }
                            else{
                                // 没符号
                                simpleStr = replaceAt(simpleStr,index,'0')
                                simpleStr = '1' + simpleStr
                                simpleStr = replaceAt(simpleStr,index+2,'')
                                simpleStr = replaceAt(simpleStr,index+2,'')
                            }
                            let part1 = simpleStr.slice(0,dotIndex+1)
                            let part2 = simpleStr.slice(dotIndex+1)
                            result = part1 + '.' + part2
                        }
                    }
                    // 特殊进位
                }
                else{
                    simpleStr = replaceAt(simpleStr,index+1,'')
                    simpleStr = replaceAt(simpleStr,index+1,'')
                }
                // 不进位
            }
            // 只保留一位的情况
        }
        // 处理保留了三位的情况
        else if(index+1 <= length-1){
            if(simpleStr[index] !== '1' && simpleStr[index] !== '2'){
                if(simpleStr[index+1] !== '0'){
                    // 要进位
                    if(simpleStr[index] !== '9'){
                        simpleStr = replaceAt(simpleStr,index,String(Number(simpleStr[index])+1))
                        simpleStr = replaceAt(simpleStr,index+1,'')
                        simpleStr = replaceAt(simpleStr,index+1,'')
                    }
                    // 一般进位
                    else{
                        if(index !== 0 && simpleStr[index-1] !== '+' && simpleStr[index-1] !== '-'){
                            simpleStr = replaceAt(simpleStr,index-1,'1')
                            simpleStr = replaceAt(simpleStr,index,'0')
                            simpleStr = replaceAt(simpleStr,index+1,'')
                            simpleStr = replaceAt(simpleStr,index+1,'')
                        }
                        // 前面已经有数字了，改成1
                        else{
                            if(index !== 0){
                                // 有符号
                                simpleStr = insertString(simpleStr,1,'1')
                                simpleStr = replaceAt(simpleStr,index+1,'0')
                                simpleStr = replaceAt(simpleStr,index+2,'')
                                simpleStr = replaceAt(simpleStr,index+2,'')
                            }
                            else{
                                // 没符号
                                simpleStr = replaceAt(simpleStr,index,'0')
                                simpleStr = '1' + simpleStr
                                simpleStr = replaceAt(simpleStr,index+2,'')
                                simpleStr = replaceAt(simpleStr,index+2,'')
                            }
                            let part1 = simpleStr.slice(0,dotIndex+1)
                            let part2 = simpleStr.slice(dotIndex+1)
                            result = part1 + '.' + part2
                        }
                    }
                    // 特殊进位
                }
                else{
                    simpleStr = replaceAt(simpleStr,index+1,'')
                    simpleStr = replaceAt(simpleStr,index+1,'')
                }
                // 不进位
            }
            // 只保留一位的情况。保留两位的情况此时无需处理。
        }
        // 处理保留了两位的情况
        else{
            if(simpleStr[index] === '1' || simpleStr[index] === '2'){
                simpleStr = replaceAt(simpleStr,index+1,'0')
            }
        }
        // 处理保留了一位的情况
        if(result === ''){
            let part1 = simpleStr.slice(0,dotIndex)
            let part2 = simpleStr.slice(dotIndex)
            result = part1 + '.' + part2
        }
        if(result[result.length-1] === '.'){
            result = replaceAt(result,result.length-1,'')
            if(result.length > 1 && result[result.length - 2] !== '+' && result[result.length - 2] !== '-'){
                result = insertString(result,result.length-1,'.')
                parts[1] = String(Number(parts[1])+1)
            }
        }
        // 处理特殊情况
        let resultBit = countSignificantDigits(result)
        result = result + 'e' + parts[1]
        if(Number(parts[1]) > resultBit || (Number(parts[1]) <= -3 && Number(parts[1]) - resultBit < -4)){
            return result
        }
        else{
            return standardByBit(result,resultBit)
        }
    }
}
// 把数据按不确定度方式保留位数
export const useAllDataStore = defineStore('allData',()=>{
    const state = ref(initState())
    function deleteData(index){
        state.value.dataList.splice(index,1)
        if(state.value.selectedDataIndex >= index){
            state.value.selectedDataIndex--
        }
    }
    function addData(type){
        if(type === 'direct'){
            state.value.dataList.push({
                dataSet:[],
                named:false,
                theoData:'',
                analysis:[
                    {
                        propertyName:'平均值',
                        propertyValue:''
                    },
                    {
                        propertyName:'相对平均偏差',
                        propertyValue:''
                    },
                    {
                        propertyName:'标准偏差',
                        propertyValue:''
                    },
                    {
                        propertyName:'相对标准偏差',
                        propertyValue:''
                    },
                    {
                        propertyName:'A类不确定度',
                        propertyValue:'0'
                    }
                ],
                type:'direct',
                moreUncer:{
                    equipUncer:'',
                    bUncer:'',
                    wholeUncer:''
                },
                unit:''
            })
        }
        else{
            state.value.dataList.push({
                dataSet:[],
                named:false,
                theoData:'',
                analysis:[],
                type:'indirect',
                computeMethod:'',
                computeOption:'',
                moreUncer:{
                    wholeUncer:''
                },
                unit:''
            })
        }
        state.value.selectedDataIndex = state.value.dataList.length - 1
    }
    function refresh(){
        let selectedList = state.value.dataList[state.value.selectedDataIndex]
        if(selectedList.type === 'direct' || (selectedList.type ==='indirect' && selectedList.computeOption === 'forAll')){
            let length = selectedList.dataSet.length
            let dataLevel = 100
            let dataLev = -100
            let sum =  '0'
            if(length !== 0){
                for(let i = 0; i < length; i++){
                    sum = calc(`(${sum}) + (${selectedList.dataSet[i].rawData})`)
                    // 求和
                    let tmp = getLevel(selectedList.dataSet[i].rawData)
                    dataLevel = tmp < dataLevel ? tmp : dataLevel
                    dataLev = tmp > dataLev ? tmp : dataLev
                    // 取最小level
                }
                if(selectedList.type === 'direct'){
                    for(let i = 0; i<length;i++){
                        selectedList.dataSet[i].rawData = standardByLevel(selectedList.dataSet[i].rawData,dataLevel)
                        selectedList.dataSet[i].bit = countSignificantDigits(selectedList.dataSet[i].rawData)
                        selectedList.dataSet[i].level = dataLevel
                    }
                }
                let avgvalue = standardByLevel(calc('sum / length',{sum:sum,length:length}),dataLevel-1)
                if(selectedList.type === 'direct'){
                    selectedList.analysis[0].propertyValue = standardByLevel(calc('sum / length',{sum:sum,length:length}),dataLevel)
                }
                else{
                    selectedList.analysis[0].propertyValue = standardByLevel(calc('sum / length',{sum:sum,length:length}),dataLev)
                }
                // 均值
                let relErrValue = '0'
                if(selectedList.theoData !== ''){
                    for(let i = 0; i < length; i++){
                        selectedList.dataSet[i].relErr = calc('('+selectedList.dataSet[i].rawData + '-' + selectedList.theoData + ')/' + selectedList.theoData )
                        selectedList.dataSet[i].relErr = toPositive(selectedList.dataSet[i].relErr)
                        relErrValue = calc(relErrValue + '+' + standardByBit(selectedList.dataSet[i].relErr,3) )
                        selectedList.dataSet[i].relErr = errorMode(selectedList.dataSet[i].relErr)
                        selectedList.dataSet[i].relErr = toPercent(selectedList.dataSet[i].relErr)
                        // 相对误差
                    }
                    if(selectedList.type === 'direct'){
                        selectedList.analysis[5] ={
                            propertyName:'平均相对误差',
                            propertyValue:''
                        },
                        selectedList.analysis[6]={
                            propertyName:'平均值与理论值的相对误差',
                            propertyValue:''
                        }
                        selectedList.analysis[6].propertyValue = calc('(' + avgvalue + '-' + selectedList.theoData + ')/' + selectedList.theoData)
                        selectedList.analysis[6].propertyValue = errorMode(selectedList.analysis[6].propertyValue)
                        selectedList.analysis[6].propertyValue = toPositive(selectedList.analysis[6].propertyValue)
                        selectedList.analysis[6].propertyValue = toPercent(selectedList.analysis[6].propertyValue)
                        // 平均值与理论值的相对误差
                        selectedList.analysis[5].propertyValue = calc(relErrValue + '/' + String(length))
                        selectedList.analysis[5].propertyValue = errorMode(selectedList.analysis[5].propertyValue)
                        selectedList.analysis[5].propertyValue = toPercent(selectedList.analysis[5].propertyValue)
                        // 平均相对误差
                    }
                    else{
                        selectedList.analysis[4] ={
                            propertyName:'平均相对误差',
                            propertyValue:''
                        },
                        selectedList.analysis[5]={
                            propertyName:'平均值与理论值的相对误差',
                            propertyValue:''
                        }
                        selectedList.analysis[5].propertyValue = calc('(' + avgvalue + '-' + selectedList.theoData + ')/' + selectedList.theoData)
                        selectedList.analysis[5].propertyValue = errorMode(selectedList.analysis[5].propertyValue)
                        selectedList.analysis[5].propertyValue = toPositive(selectedList.analysis[5].propertyValue)
                        selectedList.analysis[5].propertyValue = toPercent(selectedList.analysis[5].propertyValue)
                        // 平均值与理论值的相对误差
                        selectedList.analysis[4].propertyValue = calc(relErrValue + '/' + String(length))
                        selectedList.analysis[4].propertyValue = errorMode(selectedList.analysis[4].propertyValue)
                        selectedList.analysis[4].propertyValue = toPercent(selectedList.analysis[4].propertyValue)
                        // 平均相对误差
                    }
                }
                else{
                    if(selectedList.type === 'direct'){
                        delete selectedList.analysis[5]
                        delete selectedList.analysis[6]
                    }
                    else{
                        delete selectedList.analysis[4]
                        delete selectedList.analysis[5]
                    }
                }
                let shiftValue = '0'
                let stdShiftValue = '0'
                for(let i = 0; i<length; i++){
                    let tmp = calc(selectedList.dataSet[i].rawData + '-' + avgvalue)
                    shiftValue = calc(shiftValue + '+' +toPositive(tmp))
                    stdShiftValue = calc(stdShiftValue + '+' + calc(tmp + '*' + tmp))
                }
                selectedList.analysis[1].propertyValue = calc(shiftValue + '/' + String(length) + '/' + avgvalue)
                selectedList.analysis[1].propertyValue = errorMode(selectedList.analysis[1].propertyValue)
                selectedList.analysis[1].propertyValue = toPercent(selectedList.analysis[1].propertyValue)
                if(length > 1){
                    selectedList.analysis[2].propertyValue = calc(stdShiftValue + '/' + String(length-1))
                }
                else{
                    selectedList.analysis[2].propertyValue = '0'
                }
                if(selectedList.type === 'direct'){
                    if(length > 1){
                        selectedList.analysis[4].propertyValue = calc(selectedList.analysis[2].propertyValue + '/' +String(length))
                        selectedList.analysis[4].propertyValue = String(Math.sqrt(Number(selectedList.analysis[4].propertyValue)))
                        selectedList.analysis[4].propertyValue = errorMode(selectedList.analysis[4].propertyValue)
                    }
                    else{
                        selectedList.analysis[4].propertyValue = '0'
                    }
                }
                selectedList.analysis[2].propertyValue = String(Math.sqrt(Number(selectedList.analysis[2].propertyValue)))
                selectedList.analysis[3].propertyValue = calc(selectedList.analysis[2].propertyValue + '/' + avgvalue)
                selectedList.analysis[2].propertyValue = errorMode(selectedList.analysis[2].propertyValue)
                selectedList.analysis[3].propertyValue = errorMode(selectedList.analysis[3].propertyValue)
                selectedList.analysis[3].propertyValue = toPercent(selectedList.analysis[3].propertyValue)
            }
            if(selectedList.type == 'direct'){
                if(selectedList.moreUncer.equipUncer){
                    selectedList.moreUncer.bUncer = calc(selectedList.moreUncer.equipUncer + '/' + String(Math.sqrt(3)))
                    selectedList.moreUncer.bUncer = errorMode(selectedList.moreUncer.bUncer)
                }
                else{
                    selectedList.moreUncer.bUncer = ''
                }
                if(selectedList.analysis[4].propertyValue !== '0'){
                    if(selectedList.moreUncer.bUncer !== ''){
                        selectedList.moreUncer.wholeUncer = calc(selectedList.moreUncer.bUncer +'*'+ selectedList.moreUncer.bUncer +'+'+ selectedList.analysis[4].propertyValue +'*'+ selectedList.analysis[4].propertyValue)
                        selectedList.moreUncer.wholeUncer = errorMode(String(Math.sqrt(Number(selectedList.moreUncer.wholeUncer))))
                    }
                    else{
                        selectedList.moreUncer.wholeUncer = selectedList.analysis[4].propertyValue
                    }
                }
                else{
                    if(selectedList.moreUncer.bUncer !== ''){
                        selectedList.moreUncer.wholeUncer = selectedList.moreUncer.bUncer
                    }
                    else{
                        if(selectedList.dataSet.length === 1){
                            if(selectedList.moreUncer.wholeUncer === ''){
                                selectedList.moreUncer.wholeUncer = '0'
                            }
                            else{
                                selectedList.moreUncer.wholeUncer = errorMode(selectedList.moreUncer.wholeUncer)
                            }
                        }
                        else{
                            selectedList.moreUncer.wholeUncer = '0'
                        }
                    }
                }
            }
        }
        else if(selectedList.type === 'indirect' && selectedList.computeOption === 'forAvg'){
            selectedList.analysis[0].propertyValue=selectedList.dataSet[0].rawData
            if(selectedList.theoData !== ''){
                selectedList.analysis[1] ={
                    propertyName:'相对误差',
                    propertyValue:''
                }
                selectedList.analysis[1].propertyValue = calc(`((${selectedList.analysis[0].propertyValue})-(${selectedList.theoData}))/(${selectedList.theoData})`)
                selectedList.analysis[1].propertyValue = toPositive(selectedList.analysis[1].propertyValue)
                selectedList.analysis[1].propertyValue = toPercent(errorMode(selectedList.analysis[1].propertyValue))
            }
            else{
                delete selectedList.analysis[1]
            }
        }
    }
    function editIndirectData(){
        let selectedList = state.value.dataList[state.value.selectedDataIndex]
        if(selectedList.computeMethod === ''){
            return
        }
        if(selectedList.computeOption === ''){
            ElMessage.error('还未选择计算方式！')
            return
        }
        let resultDataSet
        if(selectedList.computeOption === 'forAll'){
            resultDataSet = evaluateExpression(state.value.dataList , selectedList.computeMethod, 'forAll')
            // 数值计算
        }
        else if(selectedList.computeOption === 'forAvg'){
            resultDataSet = evaluateExpression(state.value.dataList , selectedList.computeMethod, 'forAvg')
            // 数值计算
        }
        selectedList.dataSet = resultDataSet
        selectedList.moreUncer.wholeUncer = evaluateUncer(state.value.dataList, selectedList.computeMethod)
        refresh()
    }
    function analysisChange(){
        let selectedList = state.value.dataList[state.value.selectedDataIndex]
        if(selectedList.computeOption === 'forAll'){
            selectedList.analysis = [
                {
                    propertyName:'平均值',
                    propertyValue:''
                },
                {
                    propertyName:'相对平均偏差',
                    propertyValue:''
                },
                {
                    propertyName:'标准偏差',
                    propertyValue:''
                },
                {
                    propertyName:'相对标准偏差',
                    propertyValue:''
                },
            ]
        }
        else{
            selectedList.analysis = [
                {
                    propertyName:'实验值',
                    propertyValue:''
                }
            ]
        }
    }
    function evaluateLine(xData,yData){
        let x = state.value.dataList.find(item => item.title === xData)
        let xbit = -100
        let ybit = -100
        let yLevel = -100
        if(x){
            x.dataSet.forEach(item =>{
                xbit = xbit > item.bit ? xbit : item.bit
            })
            x=x.dataSet.map(object => Number(object.rawData))
        }
        else{
            ElMessage.error('变量x不存在！')
            return ''
        }
        let y = state.value.dataList.find(item => item.title === yData)
        if(y){
            y.dataSet.forEach(item =>{
                ybit = ybit > item.bit ? ybit : item.bit
                yLevel = yLevel < item.level ? item.level : yLevel
            })
            y=y.dataSet.map(object => Number(object.rawData))
        }
        else{
            ElMessage.error('变量y不存在！')
            return ''
        }
        let computeResult = calculateLeastSquares(x,y)
        let bit = xbit > ybit? ybit:xbit
        computeResult.slope = standardByBit(String(computeResult.slope),bit)
        let xLevel = getLevel(standardByBit(String(computeResult.slope * computeResult.xAvg),bit))
        let interceptLevel = xLevel > yLevel ? xLevel : yLevel
        computeResult.intercept = standardByLevel(String(computeResult.intercept),interceptLevel)
        computeResult.rSquared = calc(String(computeResult.rSquared)+'|=6')
        return computeResult
    }
    function evaluateSquare(xData,yData){
        let x = state.value.dataList.find(item => item.title === xData)
        let xbit = -100
        let ybit = -100
        let yLevel = -100
        if(x){
            x.dataSet.forEach(item =>{
                xbit = xbit > item.bit ? xbit : item.bit
            })
            x=x.dataSet.map(object => Number(object.rawData))
        }
        else{
            ElMessage.error('变量x不存在！')
            return ''
        }
        let y = state.value.dataList.find(item => item.title === yData)
        if(y){
            y.dataSet.forEach(item =>{
                ybit = ybit > item.bit ? ybit : item.bit
                yLevel = yLevel < item.level ? item.level : yLevel
            })
            y=y.dataSet.map(object => Number(object.rawData))
        }
        else{
            ElMessage.error('变量y不存在！')
            return ''
        }
        let computeResult = calculateQuadraticLeastSquares(x,y)
        let bit = xbit > ybit? ybit : xbit
        computeResult.a = standardByBit(String(computeResult.a),bit)
        computeResult.b = standardByBit(String(computeResult.b),bit)
        let xLevel = getLevel(standardByBit(String(computeResult.a * computeResult.xAvg * computeResult.xAvg + computeResult.b * computeResult.xAvg),bit))
        let cLevel = xLevel > yLevel ? xLevel : yLevel
        computeResult.c = standardByLevel(String(computeResult.c),cLevel)
        computeResult.rSquared = calc(String(computeResult.rSquared)+'|=6')
        return computeResult
    }
    return{
        state,
        deleteData,
        addData,
        refresh,
        editIndirectData,
        analysisChange,
        evaluateLine,
        evaluateSquare,
    }
})