import {defineStore} from 'pinia'
import {ref} from 'vue'
import {calc} from 'a-calc'
import { create, all, typed } from 'mathjs';

//Don't import { ElMessage } from 'element-plus'

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
// 初始状态

const config = {
  // 可以选择在这里添加其他配置，如处理大数等
};
// 对math.js的配置

const valueMath = create(all, config)
const uncerMath = create(all, config)
// 导入自定义运算

class Check{
    static bothEmptyArray(len1, len2){
        if(len1 === 0 && len2 === 0){
            ElMessage.error('有的数组长度为空！')
            throw new Error('有的数组长度为空，计算终止。')
        }
    }
    // 检查两个数组存空的错误情况

    static emptyArray(len){
        if(len === 0){
            ElMessage.error('有的数组长度为空！')
            throw new Error('有的数组长度为空，计算终止。')
        }
    }
    // 检查单个数组存空的错误情况

    static lengthInEqual(len1, len2){
        if(len1 !== len2){
            ElMessage.error('数组的长度不一致！')
            throw new Error('数组的长度不一致！')
        }
    }
    // 检查两个长度非1的数组长度不一致的错误情况

    static divisorZero(divisor){
        if(divisor === 0){
            ElMessage.error('除数不能为零！')
            throw new Error('除数不能为零！')
        }
    }
    // 检查分母为0的错误情况

    static naturalInpositive(natural){
        if(natural === 0){
            ElMessage.error('对数的真数不能为0！')
            throw new Error('对数的真数不能为0！')
        }
        else if(natural < 0){
            ElMessage.error('对数的真数不能为负数！')
            throw new Error('对数的真数不能为负数！')
        }
    }
    // 检查真数非正的错误情况

    static radicandNegative(radicand){
        if(radicand < 0){
            ElMessage.error('被开方数不能为负数！')
            throw new Error('被开方数不能为负数！')
        }
    }
    // 检查被开方数为负数的错误情况

    static invalidPow(base, exp){
        if(base < 0 && !Number.isInteger(exp)){
            ElMessage.error('不能对负数取非整数次方！')
            throw new Error('不能对负数取非整数次方！')
        }
    }
}
// 检查错误情况的静态方法类

class ValueCalc{
    static createObj(tmpBit, tmpLevel, tmpRawData){
        return {
            bit: tmpBit,
            level: tmpLevel,
            rawData: tmpRawData
        }
    }
    // 创建valueMath运算对象

    static multiply(a, b){
        if(typeof a === 'object' && typeof b === 'object'){
            let bit1 = a.bit
            let bit2 = b.bit
            let rawData1 = a.rawData
            let rawData2 = b.rawData
            let tmpBit = Math.min(bit1, bit2)
            let tmpRawData = calc(`(${rawData1}) * (${rawData2})`)
            let tmpLevel = bitToLevel(tmpRawData, tmpBit)
            return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData)
        }
        else if(typeof a === 'number' && typeof b === 'number'){
            return a*b
        }
        else{
            function valueMultiplyObjAndNum(obj, num){
                let numExp = Math.floor(Math.log10(Math.abs(num)))
                let tmpLevel = obj.level + numExp
                let tmpRawData = calc(`(${obj.rawData}) * (${String(num)})`)
                let tmpBit = levelToBit(tmpRawData, tmpLevel)
                return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData)
            }
            if(typeof a === 'object'){
                return valueMultiplyObjAndNum(a, b)
            }
            else{
                return valueMultiplyObjAndNum(b, a)
            }
        }
    }
    // valueMath中的单位乘法

    static divide(a, b){
        if(typeof a === 'object' && typeof b === 'object'){
            let bit1 = a.bit
            let bit2 = b.bit
            let rawData1 = a.rawData
            let rawData2 = b.rawData
            let tmpBit = Math.min(bit1, bit2)
            let tmpRawData = calc(`(${rawData1}) / (${rawData2})`)
            let tmpLevel = bitToLevel(tmpRawData, tmpBit)
            return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData)
        }
        else if(typeof a === 'number' && typeof b === 'number'){
            return a/b
        }
        else{
            if(typeof a === 'object'){
                let obj = a
                let num = b
                let numExp = Math.floor(Math.log10(Math.abs(num)))
                let tmpLevel = obj.level - numExp
                let tmpRawData = calc(`(${obj.rawData}) / (${String(num)})`)
                let tmpBit = levelToBit(tmpRawData, tmpLevel)
                return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData)
            }
            else{
                let obj = b
                let num = a
                let tmpBit = obj.bit
                let tmpRawData = calc(`(${String(num)}) / (${obj.rawData})`)
                let tmpLevel = bitToLevel(tmpRawData, tmpBit)
                return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData)
            }
        }
    }
    // valueMath中的单位除法

    static add(a, b){
        if(typeof a === 'object' && typeof b === 'object'){
            let level1 = a.level
            let level2 = b.level
            let rawData1 = a.rawData
            let rawData2 = b.rawData
            let tmpLevel = Math.max(level1, level2)
            let tmpRawData = calc(`(${rawData1}) + (${rawData2})`)
            let tmpBit = levelToBit(tmpRawData, tmpLevel)
            return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData)
        }
        else if(typeof a === 'number' && typeof b === 'number'){
            return a+b
        }
        else{
            function valueAddObjAndNum(obj, num){
                let tmpLevel = obj.level
                let tmpRawData = calc(`(${obj.rawData}) + ${String(num)}`)
                let tmpBit = levelToBit(tmpRawData, tmpLevel)
                return ValueCalc.createObj(tmpBit, tmpLevel ,tmpRawData)
            }
            if(typeof a === 'object'){
                return valueAddObjAndNum(a, b)
            }
            else{
                return valueAddObjAndNum(b, a)
            }
        }
    }
    // valueMath中的单位加法

    static subtract(a, b){
        if(typeof a === 'object' && typeof b === 'object'){
            let level1 = a.level
            let level2 = b.level
            let rawData1 = a.rawData
            let rawData2 = b.rawData
            let tmpLevel = Math.max(level1, level2)
            let tmpRawData = calc(`(${rawData1}) - (${rawData2})`)
            let tmpBit = levelToBit(tmpRawData, tmpLevel)
            return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData)
        }
        else if(typeof a === 'number' && typeof b === 'number'){
            return a - b
        }
        else{
            if(typeof a === 'object'){
                let obj = a
                let num = b
                let tmpLevel = obj.level
                let tmpRawData = calc(`(${obj.rawData}) - ${String(num)}`)
                let tmpBit = levelToBit(tmpRawData, tmpLevel)
                return ValueCalc.createObj(tmpBit, tmpLevel ,tmpRawData)
            }
            else{
                let obj = b
                let num = a
                let tmpLevel = obj.level
                let tmpRawData = calc(`(${String(num)}) - ${obj.rawData}`)
                let tmpBit = levelToBit(tmpRawData, tmpLevel)
                return ValueCalc.createObj(tmpBit, tmpLevel ,tmpRawData)
            }
        }
    }
    // valueMath中的单位减法

    static ln(x){
        if(typeof x === 'object'){
            let tmpLevel = -x.bit
            let tmpRawData = String(Math.log(Number(x.rawData)))
            let tmpBit = levelToBit(tmpRawData, tmpLevel)
            return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData)
        }
        else{
            return Math.log(x)
        }
    }
    // valueMath中的单位ln函数

    static sqrt(x){
        if(typeof x === 'object'){
            let tmpBit = x.bit
            let tmpRawData = String(Math.sqrt(Number(x.rawData)))
            let tmpLevel = bitToLevel(tmpRawData, tmpBit)
            return ValueCalc.createObj(tmpBit, tmpLevel ,tmpRawData)
        }
        else{
            return Math.sqrt(x)
        }
    }
    // valueMath中的单位sqrt函数

    static abs(x){
        if(typeof x === 'object'){
            let tmpBit = x.bit
            let tmpLevel = x.level
            let tmpRawData = String(Math.abs(Number(x.rawData)))
            return ValueCalc.createObj(tmpBit, tmpLevel ,tmpRawData)
        }
        else{
            return Math.abs(x)
        }
    }
    // valueMath中的单位Abs函数

    static pow(a, b){
        if(typeof a === 'object' && typeof b === 'object'){
            let rawData1 = a.rawData
            let rawData2 = b.rawData
            let tmpBit = a.bit
            let tmpRawData = String(Math.pow(Number(rawData1), Number(rawData2)))
            let tmpLevel = bitToLevel(tmpRawData, tmpBit)
            return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData)
        }
        else if(typeof a === 'object'){
            let tmpBit = a.bit
            let tmpRawData = String(Math.pow(Number(a.rawData), b))
            let tmpLevel = bitToLevel(tmpRawData, tmpBit)
            return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData)
        }
        else if(typeof b === 'object'){
            let tmpBit = b.bit
            let tmpRawData = String(Math.pow(a, Number(b.rawData)))
            let tmpLevel = bitToLevel(tmpRawData, tmpBit)
            return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData)
        }
        else{
            return Math.pow(a, b)
        }
    }

    static lg(x){
        if(typeof x === 'object'){
            let tmpLevel = -x.bit
            let tmpRawData = String(Math.log10(Number(x.rawData)))
            let tmpBit = levelToBit(tmpRawData, tmpLevel)
            return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData)
        }
        else{
            return Math.log10(x)
        }
    }

    static unaryMinus(x){
        if(typeof x === 'object'){
            let tmpLevel = x.level
            let tmpBit = x.bit
            let tmpRawData = String(-Number(x.rawData))
            return ValueCalc.createObj(tmpBit, tmpLevel, tmpRawData)
        }
        else{
            return -x
        }
    }
}
// valueMath的单位计算静态方法类

function bitToLevel(str, bit){
    let stdStr = standardByBit(str, bit)
    return getLevel(stdStr)
}
// 给数据，位数，得到精度

function levelToBit(str, level){
    let stdStr = standardByLevel(str, level)
    return getBit(stdStr)
}
// 给数据，精度，得到位数

function dimensionalAdd(a, b){
    let x = typeof a === 'string' ? Number(a) : a
    let y = typeof b === 'string' ? Number(b) : b
    return String(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)))
}
// 维度和

valueMath.import({
  multiply: typed('multiply', {
    'Array, Array': function (arr1, arr2) {
      let length1 = arr1.length
      let length2 = arr2.length
      let result = []
      Check.bothEmptyArray(length1, length2)
      if(length1 === 1){
        arr2.forEach(item => {
            result.push(ValueCalc.multiply(arr1[0], item))
        })
      }
      else if(length2 === 1){
        arr1.forEach(item => {
            result.push(ValueCalc.multiply(item, arr2[0]))
        })
      }
      else{
        Check.lengthInEqual(length1, length2)
        for(let i = 0; i < length1; i++){
            result.push(ValueCalc.multiply(arr1[i], arr2[i]))
        }
      }
      return result
    },
    'Array, number': function (arr, num) {
      let length = arr.length
      Check.emptyArray(length)
      let result = []
      arr.forEach(item => {
        result.push(ValueCalc.multiply(item, num))
      })
      return result
    },
    'number, Array': function (num , arr) {
      let length = arr.length
      Check.emptyArray(length)
      let result = []
      arr.forEach(item => {
        result.push(ValueCalc.multiply(num, item))
      })
      return result
    },
    'number, number': function (num1, num2) {
      return ValueCalc.multiply(num1, num2)
    }
  }),
  divide: typed('divide', {
    'Array, Array': function (arr1, arr2) {
      let length1 = arr1.length
      let length2 = arr2.length
      let result = []
      Check.bothEmptyArray(length1, length2)
      if(length1 === 1){
        arr2.forEach(item => {
            Check.divisorZero(Number(item.rawData))
            result.push(ValueCalc.divide(arr1[0], item))
        })
      }
      else if(length2 === 1){
        Check.divisorZero(Number(arr2[0].rawData))
        arr1.forEach(item => {
            result.push(ValueCalc.divide(item, arr2[0]))
        })
      }
      else{
        Check.lengthInEqual(length1, length2)
        for(let i = 0; i < length1; i++){
            Check.divisorZero(arr2[i])
            result.push(ValueCalc.divide(arr1[i], arr2[i]))
        }
      }
      return result
    },
    'Array, number': function (arr, num) {
      let length = arr.length
      Check.emptyArray(length)
      Check.divisorZero(num)
      let result = []
      arr.forEach(item => {
        result.push(ValueCalc.divide(item, num))
      })
      return result
    },
    'number, Array': function (num, arr) {
      let length = arr.length
      Check.emptyArray(length)
      let result = []
      arr.forEach(item => {
        Check.divisorZero(Number(item.rawData))
        result.push(num, item)
      })
      return result
    },
    'number, number': function (num1, num2) {
        Check.divisorZero(num2)
        return ValueCalc.divide(num1, num2)
    }
  }),
  add: typed('add', {
    'Array,Array': function(arr1, arr2){
        let length1 = arr1.length
        let length2 = arr2.length
        Check.bothEmptyArray(length1, length2)
        let result = []
        if(length1 === 1){
            arr2.forEach(item => {
                result.push(ValueCalc.add(arr1[0], item))
            })
        }
        else if(length2 === 1){
            arr1.forEach(item => {
                result.push(ValueCalc.add(item, arr2[0]))
            })
        }
        else{
            Check.lengthInEqual(length1, length2)
            for(let i = 0; i < length1; i++){
                result.push(ValueCalc.add(arr1[i], arr2[i]))
            }
        }
        return result
    },
    'Array,number': function(arr, num){
        let length = arr.length
        Check.emptyArray(length)
        let result = []
        arr.forEach(item => {
            result.push(ValueCalc.add(item, num))
        })
        return result
    },
    'number,Array': function(num, arr){
        let length = arr.length
        Check.emptyArray(length)
        let result = []
        arr.forEach(item => {
            result.push(ValueCalc.add(num, item))
        })
        return result
    },
    'number, number':function(num1, num2){
        return ValueCalc.add(num1, num2)
    },
  }),
  subtract: typed('subtract', {
    'Array,Array': function(arr1, arr2){
        let length1 = arr1.length
        let length2 = arr2.length
        Check.bothEmptyArray(length1, length2)
        let result = []
        if(length1 === 1){
            arr2.forEach(item => {
                result.push(ValueCalc.subtract(arr1[0], item))
            })
        }
        else if(length2 === 1){
            arr1.forEach(item => {
                result.push(ValueCalc.subtract(item, arr2[0]))
            })
        }
        else{
            Check.lengthInEqual(length1, length2)
            for(let i = 0; i < length1; i++){
                result.push(ValueCalc.subtract(arr1[i], arr2[i]))
            }
        }
        return result
    },
    'Array,number': function(arr, num){
        let length = arr.length
        Check.emptyArray(length)
        let result = []
        arr.forEach(item => {
            result.push(ValueCalc.subtract(item, num))
        })
        return result
    },
    'number,Array': function(num, arr){
        let length = arr.length
        Check.emptyArray(length)
        let result = []
        arr.forEach(item => {
            result.push(ValueCalc.subtract(num, item))
        })
        return result
    },
    'number, number':function(num1, num2){
        return ValueCalc.subtract(num1, num2)
    },
  }),
  ln:typed('ln',{
    'Array':function(arr){
        let length = arr.length
        Check.emptyArray(length)
        let result = []
        arr.forEach(item => {
            Check.naturalInpositive(Number(item.rawData))
            result.push(ValueCalc.ln(item))
        })
        return result
    },
    'number':function(num){
        Check.naturalInpositive(num)
        return ValueCalc.ln(num)
    }
  }),
  sqrt:typed('sqrt',{
    'Array':function (arr) {
        let length = arr.length
        Check.emptyArray(length)
        let result = []
        arr.forEach(item => {
            Check.radicandNegative(Number(item.rawData))
            result.push(ValueCalc.sqrt(item))
        })
        return result
    },
    'number':function(num){
        Check.radicandNegative(num)
        return Math.sqrt(num)
    }
  }),
  abs:typed('abs',{
    'Array':function(arr){
        let length = arr.length
        Check.emptyArray(length)
        let result = []
        arr.forEach(item => {
            result.push(ValueCalc.abs(item))
        })
        return result
    },
    'number':function(num){
        return ValueCalc.abs(num)
    }
  }),
  pow:typed('pow',{
    'Array,Array':function(arr1, arr2){
        let length1 = arr1.length
        let length2 = arr2.length
        Check.bothEmptyArray(length1, length2)
        let result = []
        if(length1 === 1){
            arr2.forEach(item => {
                Check.invalidPow(Number(arr1[0].rawData), Number(item.rawData))
                result.push(ValueCalc.pow(arr1[0], item))
            })
        }
        else if(length2 === 1){
            arr1.forEach(item => {
                Check.invalidPow(Number(item.rawData), Number(arr2[0].rawData))
                result.push(ValueCalc.pow(item, arr2[0]))
            })
        }
        else{
            Check.lengthInEqual(length1, length2)
            for(let i = 0 ; i < length1 ; i++){
                Check.invalidPow(Number(arr1[i].rawData, Number(arr2[i].rawData)))
                result.push(ValueCalc.pow(arr1[i], arr2[i]))
            }
        }
        return result
    },
    'Array,number':function(arr, num){
        let length = arr.length
        Check.emptyArray(length)
        let result = []
        arr.forEach(item => {
            Check.invalidPow(Number(item.rawData), num)
            result.push(ValueCalc.pow(item, num))
        })
        return result
    },
    'number,Array':function(num,arr){
        let length = arr.length
        Check.emptyArray(length)
        let result = []
        arr.forEach(item => {
            Check.invalidPow(num, Number(item.rawData))
            result.push(ValueCalc.pow(num, item))
        })
        return result
    },
    'number,number':function(num1,num2){
        Check.invalidPow(num1, num2)
        return ValueCalc.pow(num1, num2)
    }
  }),
  lg: typed('lg', {
        'Array':function(arr){
            let length = arr.length
            Check.emptyArray(length)
            let result = []
            arr.forEach(item => {
                Check.naturalInpositive(Number(item.rawData))
                result.push(ValueCalc.lg(item))
            })
            return result
        },
        'number':function(num){
            Check.naturalInpositive(num)
            return ValueCalc.lg(num)
        }
  }),
  unaryMinus: typed('unaryMinus', {
    'Array':function(arr){
        let length = arr.length
        Check.emptyArray(length)
        let result = []
        arr.forEach(item => {
            result.push(ValueCalc.unaryMinus(item))
        })
        return result
    },
    'number':function(num){
        return ValueCalc.unaryMinus(num)
    }
  })
}, { override: true });
// 数值计算规则

uncerMath.import({
  // 自定义乘法
  multiply: typed('multiply', {
    'Object, Object':function(obj1, obj2){
        return {
            data: calc(`(${obj1.data}) * (${obj2.data})`),
            uncer: dimensionalAdd(Number(obj1.data) * Number(obj2.uncer), Number(obj1.uncer) * Number(obj2.data))
        }
    },
    'number, number':function(num1, num2){
        return{
            data: String(num1 * num2),
            uncer: '0'
        }
    },
    'Object, number':function(obj, num){
        return {
            data: String(Number(obj.data) * num),
            uncer: toPositive(String(Number(obj.uncer) * num))
        }
    },
    'number, Object':function(num, obj){
        return {
            data: String(Number(obj.data) * num),
            uncer: toPositive(String(Number(obj.uncer) * num))
        }
    },
  }),
  // 自定义除法
  divide: typed('divide', {
    'Object, Object':function(obj1, obj2){
        Check.divisorZero(Number(obj2.data))
        return {
            data: calc(`(${obj1.data}) / (${obj2.data})`),
            uncer: dimensionalAdd(Number(obj1.uncer) / Number(obj2.data), Number(obj1.data) / Number(obj2.data) / Number(obj2.data) * Number(obj2.uncer))
        }
    },
    'number, number':function(num1, num2){
        Check.divisorZero(num2)
        return{
            data: String(num1 / num2),
            uncer: '0'
        }
    },
    'Object, number':function(obj, num){
        Check.divisorZero(num)
        return {
            data: String(Number(obj.data) / num),
            uncer: String(Math.abs((Number(obj.uncer) / num)))
        }
    },
    'number, Object':function(num, obj){
        Check.divisorZero(Number(obj.data))
        return {
            data: String(num / Number(obj.data)),
            uncer: toPositive(calc(`(${obj.uncer}) * (${String(num)}) / (${obj.data}) / (${obj.data})`))
        }
    }
  }),
  add: typed('add', {
    'Object, Object': function (obj1, obj2) {
        return{
            data: String(Number(obj1.data) + Number(obj2.data)),
            uncer: dimensionalAdd(obj1.uncer, obj2.uncer)
        }
    },
    'number, Object': function (num, obj){
        return{
            data: String(num + Number(obj.data)),
            uncer: obj.uncer
        }
    },
    'Object, number': function (obj, num){
        return{
            data: String(num + Number(obj.data)),
            uncer: obj.uncer
        }
    },
    'number, number':function(num1, num2){
        return{
            data: num1 + num2,
            uncer: '0'
        }
    },
  }),
  subtract: typed('subtract', {
    'Object, Object': function (obj1, obj2) {
        return{
            data: String(Number(obj1.data) - Number(obj2.data)),
            uncer: dimensionalAdd(obj1.uncer, obj2.uncer)
        }
    },
    'number, Object': function (num, obj){
        return{
            data: String(num - Number(obj.data)),
            uncer: obj.uncer
        }
    },
    'Object, number': function (obj, num){
        return{
            data: String(Number(obj.data) - num),
            uncer: obj.uncer
        }
    },
    'number, number': function(num1, num2){
        return{
            data: num1 - num2,
            uncer: '0'
        }
    },
  }),
  ln:typed('ln',{
    'Object': function(obj){
        Check.naturalInpositive(Number(obj.data))
        return{
            data: String(Math.log(Number(obj.data))),
            uncer: calc(`(${obj.uncer}) / (${obj.data})`)
        }
    },
    'number': function(num){
        Check.naturalInpositive(num)
        return{
            data:String(Math.log(num)),
            uncer:'0'
        }
    }
  }),
  sqrt: typed('sqrt',{
    'Object': function(obj){
        Check.radicandNegative(Number(obj.data))
        return{
            data: String(Math.sqrt(Number(obj.data))),
            uncer: calc(`(${obj.uncer}) / (${String(Math.sqrt(Number(obj.data)))}) / 2`)
        }
    },
    'number': function(num){
        Check.radicandNegative(num)
        return{
            data: String(Math.sqrt(num)),
            uncer: '0'
        }
    }
  }),
  abs:typed('abs',{
    'Object': function(obj){
        return{
            data: String(Math.abs(Number(obj.data))),
            uncer: obj.uncer
        }
    },
    'number': function(num){
        return{
            data: String(Math.abs(num)),
            uncer: '0'
        }
    }
  }),
  pow:typed('pow',{
    'Object, Object': function(obj1, obj2){
        let y1 = Number(obj1.data)
        let y2 = Number(obj2.data)
        Check.invalidPow(y1, y2)
        return{
            data:String(Math.pow(y1, y2)),
            uncer: dimensionalAdd(Math.pow(y1, y2) * Math.log(y1) * Number(obj2.uncer), y2 * Math.pow(y1, y2 - 1) * Number(obj1.uncer))
        }
    },
    'Object, number': function(obj, num){
        Check.invalidPow(Number(obj.data), num)
        return{
            data:String(Math.pow(Number(obj.data), num)),
            uncer:String(Math.abs(num * Math.pow(Number(obj.data) , num - 1) * Number(obj.data)))
        }
    },
    'number, Object':function(num, obj){
        Check.invalidPow(num, Number(obj.data))
        return{
            data:String(Math.pow(num, Number(obj.data))),
            uncer:String(Math.log(Number(obj.data)) * Math.pow(num, Number(obj.data)))
        }
    },
    'number, number':function(num1, num2){
        Check.invalidPow(num1, num2)
        return{
            data:String(Math.pow(num1, num2)),
            uncer:'0'
        }
    }
  }),
  lg:typed('lg',{
    'Object': function(obj){
        Check.naturalInpositive(Number(obj.data))
        return{
            data: String(Math.log10(Number(obj.data))),
            uncer: calc(`(${obj.uncer}) / (${obj.data}) * (${String(Math.LN10)})`)
        }
    },
    'number': function(num){
        Check.naturalInpositive(num)
        return{
            data:String(Math.log10(num)),
            uncer:'0'
        }
    }
  }),
  unaryMinus: typed('unaryMinus', {
    'Object': function(obj) {
      return{
        data: String(-Number(obj.data)),
        uncer: obj.uncer
      }
    },
    'number': function(num) {
      return{
        data: String(-num),
        uncer: '0'
      }
    }
  }),
}, { override: true });
// 不确定度计算规则


function escapeVariableName(variableName) {
    if(!variableName){
        return ''
    }
    function replaceChineseWithUnicode(str) {
        // 匹配中文字符的正则表达式
        const chineseRegex = /[\u4e00-\u9fa5]/g

        // 使用 replace 逐个替换匹配到的中文字符
        return str.replace(chineseRegex, (ch) => {
            // 将中文字符转换为 Unicode 编码格式
            return 'u' + ch.charCodeAt(0).toString(16).padStart(4, '0')
        })
    }
    // 将中文转成编码，防止数学解析器无法识别中文

    // 用双引号包裹变量名，防止撇号引起解析错误
    let tmp = variableName;
    tmp = tmp.replace(/'/g, "_APOSTROPHE_");
    tmp = tmp.replace(/,/g, "_COMMA_");
    tmp = tmp.replace(/\+/g, "_ADD_");
    tmp = tmp.replace(/\-/g, "_SUBTRACT_");
    tmp = tmp.replace(/\*/g, "_MULTIPLY_");
    tmp = tmp.replace(/\//g, "_DIVIDE_");
    tmp = tmp.replace(/\^/g, "_POW_");
    tmp = tmp.replace(/ln/g, "_LN_");
    tmp = tmp.replace(/log/g, "_LOG_");
    tmp = tmp.replace(/lg/g, "_LG_");
    tmp = tmp.replace(/{/g, "_LEFTBRACE_");
    tmp = tmp.replace(/}/g, "_RIGHTBRACE_");
    tmp = tmp.replace(/;/g, "_SEMICOLON_");
    tmp = tmp.replace(/\./g, "_PERIOD_");
    tmp = replaceChineseWithUnicode(tmp);
    tmp = tmp.replace(/\(/g, "_LEFTPARENTHESIS_");
    tmp = tmp.replace(/\)/g, "_RIGHTPARENTHESIS_");
    tmp = tmp.replace(/\\/g, "_BACKSLASH_")
    return tmp
}
// 处理变量名规范，以便数学解析器解析
function escapeExpression(expression, variables) {
    return preprocessExpression(expression, variables)
}
// 处理表达式规范，以便数学解析器解析
function preprocessExpression(expression, variables) {
    let preprocessed = expression;
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    Object.keys(variables).forEach(key => {
        const value = variables[key];
        const escapedKey = escapeRegExp(key); // 转义键
        const regex = new RegExp(escapedKey, 'g'); // 创建全局正则表达式
        preprocessed = preprocessed.replace(regex, value); // 替换匹配的部分
    });

    return preprocessed;
}
// 预处理，替换变量名使变量名合法

function evaluateUncer(dataList, expression, currentTitle){
    const parser = uncerMath.parser()
    let variables = {}
    dataList.forEach(item =>{
        if(item.title !== currentTitle){
            variables[item.title] = escapeVariableName(item.title)
            parser.set(escapeVariableName(item.title), {data: item.analysis['avg'].propertyValue, uncer: item.moreUncer.wholeUncer})
        }
        // 防止该数据的命名与算式有冲突
    })
    try {
        let result = parser.evaluate(escapeExpression(expression, variables))
        if(typeof result === 'number'){
            return '0'
        }
        else{
            return errorMode(result.uncer)
        }
    }
    catch (error) {
        ElMessage.error('计算过程中出错！')
        console.error("Error evaluating expression:", error)
        return '0'  // 错误处理
    }
}
// 依据计算式计算不确定度
function evaluateExpression(dataList, expression, option, currentTitle) {
    const parser = valueMath.parser();
    let variables = {}
    if(option === 'forAll'){
        dataList.forEach(item => {
            if(item.title !== currentTitle){
                variables[item.title] = escapeVariableName(item.title)
                parser.set(escapeVariableName(item.title), item.dataSet)
            }
        })
    }
    else if(option === 'forAvg'){
        dataList.forEach(item => {
            variables[item.title] = escapeVariableName(item.title)
            let tmpRawData = item.analysis['avg'].propertyValue
            parser.set(escapeVariableName(item.title),[
                {
                    rawData:tmpRawData,
                    level:getLevel(tmpRawData),
                    bit:getBit(tmpRawData)
                }
            ])
        })
    }
    try {
        let result = parser.evaluate(escapeExpression(expression, variables));
        // 确保结果是数组
        if (!Array.isArray(result)) {
            result = [result];
        }
        // 返回计算结果
        if(typeof result[0] === 'number'){
            ElMessage.success(`计算结果为 ${result[0]}`)
            return []
        }
        else{
            result.forEach(item=>{
                item.rawData = standardByBit(item.rawData,item.bit)
            })
            return result
        }
    }
    catch (error) {
        ElMessage.error('计算过程中出错！')
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
        //return Number(parts[1])-getBit(parts[0]) + 1
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
    let bit = getBit(str)
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
    let bit = getBit(str)
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
// function getBit(str) {
//     // 去掉字符串前后的空格并检查是否为有效数字
//     str = String(str)
//     let trimmedStr = str.trim();
//     if (isNaN(Number(trimmedStr))) {
//         return 0; // 不是有效数字，返回0
//     }

//     // 去掉数字前的正负号
//     trimmedStr = trimmedStr.replace(/^[+-]/, '');

//     // 处理科学记数法
//     if (/e/i.test(trimmedStr)) {
//         let parts = trimmedStr.split(/e/i);
//         let significantDigits = getBit(parts[0]);
//         return significantDigits; // 返回科学记数法前的部分的有效数字位数
//     }

//     // 分离整数部分和小数部分
//     let [integerPart, decimalPart] = trimmedStr.split('.');
//     if(integerPart === '0'){
//         integerPart = ''
//         if(decimalPart !== undefined){
//             decimalPart = decimalPart.replace(/^0+/, '')
//         }
//     }
//     if (decimalPart === undefined) {
//         decimalPart = ''
//     }
//     // 计算有效数字位数
//     return integerPart.length + decimalPart.length;
// }
// // 获取数据的有效位数
function getBit(str){
    str = String(str)
    let trimmedStr = str.trim();
    if (isNaN(Number(trimmedStr))) {
        return 0; // 不是有效数字，返回0
    }

    function isHead(str){
        return (str === '-' || str === '+' || str === '0' || str === '.') ? 0 : 1
    }
    // 判断是不是有效数字的开头

    function isTail(str){
        return (str === 'e' || str === 'E' || str === '%') ? 1 : 0
    }
    // 判断是不是有效数字的末尾

    let len = trimmedStr.length
    let validLen = 0
    let startFlag = false
    for(let i = 0; i < len; i++){
        if(startFlag === false){
            if(isHead(trimmedStr[i])){
                startFlag = true
                validLen++
            }
        }
        else{
            if(!isTail(trimmedStr[i])){
                if(trimmedStr[i] !== '.'){
                    validLen++
                }
            }
            else{
                break
            }
        }
    }
    return validLen
}
// 返回数据的有效位数

function standardByLevel(str,level){
    let eStr = calc(str + '| !e')
    let parts = eStr.split(/e/i)
    // 先转化成科学计数法处理
    let result = ''
    parts[0] = calc(parts[0] + '| ~6 , =' + String(Number(parts[1])-level))
    result = parts[0] + 'e' + parts[1]
    let bit = getBit(parts[0])
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
        let bit = getBit(parts[0])
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
        let resultBit = getBit(result)
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
    function addData(flag){
        if(flag){
            state.value.dataList.push({
                dataSet:[],
                named:false,
                theoData:'',
                analysis:{
                    avg:{
                        propertyName:'平均值',
                        propertyValue:''
                    },
                    relAvgDev: {
                        propertyName:'相对平均偏差',
                        propertyValue:''
                    },
                    stdDev: {
                        propertyName:'标准偏差',
                        propertyValue:''
                    },
                    relStdDev: {
                        propertyName:'相对标准偏差',
                        propertyValue:''
                    },
                    aUncer: {
                        propertyName:'A类不确定度',
                        propertyValue:'0'
                    }
                },
                type:'direct',
                moreUncer:{
                    equipUncer:'',
                    bUncer:'',
                    wholeUncer:''
                },
                unit:'',
                levelRule: false,
                doc:''
            })
        }
        else{
            state.value.dataList.push({
                dataSet:[],
                named:false,
                theoData:'',
                analysis:{
                    avg:{
                        propertyName:'平均值',
                        propertyValue:'0'
                    },
                    relAvgDev:{
                        propertyName:'相对平均偏差',
                        propertyValue:'0'
                    },
                    stdDev:{
                        propertyName:'标准偏差',
                        propertyValue:'0'
                    },
                    relStdDev:{
                        propertyName:'相对标准偏差',
                        propertyValue:'0'
                    },
                },
                type:'indirect',
                computeMethod:'',
                computeOption:'forAll',
                moreUncer:{
                    wholeUncer:''
                },
                unit:'',
                dataMethod:false,
                doc:''
            })
        }
        state.value.selectedDataIndex = state.value.dataList.length - 1
    }
    function refresh(){
        try{
            let selectedList = state.value.dataList[state.value.selectedDataIndex]
            let length = selectedList.dataSet.length
            let selectedDataSet = selectedList.dataSet
            let selectedAnalysis = selectedList.analysis
            let selectedTheoData = selectedList.theoData
            let selectedType = selectedList.type
            function checkInvalidData(rawData){
                if(rawData === ''){
                    ElMessage.error('数据不能为空！如果要删除，尝试点击右边的删除图标。')
                    throw new Error('数据不能为空！如果要删除，尝试点击右边的删除图标。')
                }
                let rawDataNum = Number(rawData)
                if(typeof rawDataNum !== 'number' || isNaN(rawDataNum)){
                    ElMessage.error('无效的数据！是否包含了字母或百分号？')
                    throw new Error('无效的数据！是否包含了字母或百分号？')
                }
            }
            // 检测rawData不合法的错误情况
            function createAnalysis(key, name, value){
                selectedAnalysis[key] = {
                    propertyName: name,
                    propertyValue: value
                }
            }
            // 创造某个analysis
            function initAnalysis(key){
                selectedAnalysis[key].propertyValue = '0'
            }
            // 将某个analysis置0
            function editAnalysis(key, value){
                selectedAnalysis[key].propertyValue = value
            }
            if(selectedType === 'direct' || (selectedType ==='indirect' && selectedList.computeOption === 'forAll')){
                let dataMaxLevel = -100
                let dataMinLevel = 100
                let sum =  '0'
                if(length !== 0){
                    selectedDataSet.forEach(item => {
                        checkInvalidData(item.rawData)
                        sum = calc(`(${sum}) + (${item.rawData})`)
                        let tmpLevel = getLevel(item.rawData)
                        dataMaxLevel = Math.max(dataMaxLevel, tmpLevel)
                        dataMinLevel = Math.min(dataMinLevel, tmpLevel)
                    })
                    // 取最大level和最小level

                    if(selectedType === 'direct'){
                        if(selectedList.levelRule === false){
                            selectedDataSet.forEach(item => {
                                item.rawData = standardByLevel(item.rawData, dataMinLevel)
                                item.bit = getBit(item.rawData)
                                item.level = dataMinLevel
                            })
                        }
                        else{
                            selectedDataSet.forEach(item => {
                                item.bit = getBit(item.rawData)
                                item.level = getLevel(item.rawData)
                            })
                        }
                    }
                    // 规范化direct数据

                    let avgValue = calc(`(${sum}) / (${length})`)
                    if(selectedType === 'direct'){
                        editAnalysis('avg', standardByLevel(avgValue, dataMinLevel))
                    }
                    else{
                        editAnalysis('avg', standardByLevel(avgValue, dataMaxLevel))
                    }
                    // 将均值依照level赋值

                    let relErrSum = '0'
                    if(selectedTheoData !== ''){
                        // 当理论值不为空时，处理相关数据
                        checkInvalidData(selectedTheoData)
                        if(selectedTheoData === '0'){
                            ElMessage.warning('理论值为 0，不计算相对误差、平均相对误差与平均值与理论值的相对误差！')
                            createAnalysis('relErr', '相对误差', '0')
                            createAnalysis('avgRelErr', '平均相对误差', '0')
                            createAnalysis('avgOverallRelErr', '平均值与理论值的相对误差', '0')
                        }
                        else{
                            selectedDataSet.forEach(item => {
                                let tmpRelErr = calc(`((${item.rawData}) - (${selectedTheoData})) / (${selectedTheoData})`)
                                tmpRelErr = toPositive(tmpRelErr)
                                relErrSum = calc(`(${relErrSum}) + (${tmpRelErr})`)
                                tmpRelErr = toPercent(errorMode(tmpRelErr))
                                item.relErr = tmpRelErr
                            })
                            // 添加相对误差
                            let tmpAvgRelErr = calc(`(${relErrSum}) / ${String(length)}`)
                            tmpAvgRelErr = toPercent(errorMode(tmpAvgRelErr))
                            createAnalysis('avgRelErr', '平均相对误差', tmpAvgRelErr)
                            // 添加平均相对误差
                            let tmpOverallRelErr = calc(`((${avgValue}) - (${selectedTheoData})) / (${selectedTheoData})`)
                            tmpOverallRelErr = toPositive(tmpOverallRelErr)
                            tmpOverallRelErr = toPercent(errorMode(tmpOverallRelErr))
                            createAnalysis('avgOverallRelErr', '平均值与理论值的相对误差', tmpOverallRelErr)
                            // 添加平均值与理论值的相对误差
                        }
                    }
                    else{
                        delete selectedAnalysis['avgRelErr']
                        delete selectedAnalysis['avgOverallRelErr']
                    }
                    // 处理理论值相关

                    let devSum = '0'
                    let devSquareSum = '0'
                    selectedDataSet.forEach(item => {
                        let tmpDev = toPositive(calc(`(${item.rawData}) - (${avgValue})`))
                        devSum = calc(`(${devSum}) + (${tmpDev})`)
                        devSquareSum = calc(`(${devSquareSum}) + (${tmpDev}) * (${tmpDev})`)
                    })
                    // 计算偏差的和、平方偏差的和

                    if(avgValue === '0'){
                        ElMessage.warning('平均值为 0，不计算相对平均偏差！')
                        initAnalysis('relAvgDev')
                    }
                    else{
                        let tmpRelAvgDev = toPositive(calc(`(${devSum}) / (${String(length)}) / (${avgValue})`))
                        tmpRelAvgDev = toPercent(errorMode(tmpRelAvgDev))
                        editAnalysis('relAvgDev', tmpRelAvgDev)
                    }
                    // 计算相对平均偏差

                    if(length > 1){
                        let tmpStdDev = String(Math.sqrt(Number(devSquareSum) / (length - 1)))

                        editAnalysis('stdDev', errorMode(tmpStdDev))
                        if(avgValue === '0'){
                            ElMessage.warning('平均值为 0，不计算相对标准偏差！')
                            initAnalysis('relStdDev')
                        }
                        else{
                            let tmpRelStdDev = toPositive(calc(`(${tmpStdDev}) / (${avgValue})`))
                            tmpRelStdDev = toPercent(errorMode(tmpRelStdDev))
                            editAnalysis('relStdDev', tmpRelStdDev)
                        }
                        if(selectedType === 'direct'){
                            let tmpAUncer = String(Number(tmpStdDev) / Math.sqrt(length))
                            editAnalysis('aUncer', errorMode(tmpAUncer))
                        }
                        else{
                            delete selectedAnalysis['aUncer']
                        }
                    }
                    else{
                        initAnalysis('stdDev')
                        initAnalysis('relStdDev')
                        if(selectedType === 'direct'){
                            initAnalysis('aUncer')
                        }
                        else{
                            delete selectedAnalysis['aUncer']
                        }
                    }
                    // 计算标准偏差，相对标准偏差和A类不确定度

                    if(selectedType === 'direct'){
                        let selectedUncers = selectedList.moreUncer
                        if(selectedUncers.equipUncer){
                            checkInvalidData(selectedUncers.equipUncer)
                            let tmpBUncer = calc(`(${selectedUncers.equipUncer}) / (${String(Math.sqrt(3))})`)
                            selectedUncers.bUncer = errorMode(tmpBUncer)
                        }
                        else{
                            delete selectedUncers.bUncer
                        }
                        // 解决B类不确定度
                        if(selectedUncers.bUncer){
                            let tmpWholeUncer = dimensionalAdd(selectedAnalysis['aUncer'].propertyValue, selectedUncers.bUncer)
                            selectedUncers.wholeUncer = errorMode(tmpWholeUncer)
                        }
                        else{
                            selectedUncers.wholeUncer = selectedAnalysis['aUncer'].propertyValue
                        }
                        // 解决总不确定度
                    }
                    // 计算direct数据的不确定度
                }
                // 长度不为0情况
                else{
                    initAnalysis('avg')
                    initAnalysis('relAvgDev')
                    initAnalysis('stdDev')
                    initAnalysis('relStdDev')
                    if(selectedType === 'direct'){
                        initAnalysis('aUncer')
                        if(selectedList.moreUncer.equipUncer){
                            checkInvalidData(selectedList.moreUncer.equipUncer)
                            let tmpBUncer = calc(`(${selectedList.moreUncer.equipUncer}) / (${String(Math.sqrt(3))})`)
                            selectedList.moreUncer.bUncer = errorMode(tmpBUncer)
                            selectedList.moreUncer.wholeUncer = selectedList.moreUncer.bUncer
                        }
                    }
                    delete selectedAnalysis['relErr']
                    delete selectedAnalysis['avgRelErr']
                    delete selectedAnalysis['avgOverallRelErr']
                }
                // 长度为0情况
            }
            // 多数据情况
            else if(selectedType === 'indirect' && selectedList.computeOption === 'forAvg'){
                createAnalysis('avg', '实验值', selectedDataSet[0].rawData)
                if(selectedTheoData !== ''){
                    checkInvalidData(selectedTheoData)
                    let tmpRelErr = calc(`((${selectedDataSet[0].rawData}) - (${selectedTheoData})) / (${selectedTheoData})`)
                    tmpRelErr = toPositive(tmpRelErr)
                    tmpRelErr = toPercent(errorMode(tmpRelErr))
                    createAnalysis('relErr', '相对误差', tmpRelErr)
                }
                else{
                    delete selectedAnalysis['relErr']
                }
            }
            // 单数据情况
            if(selectedType === 'indirect'){
                ElMessage.success('刷新成功！')
            }
        }
        catch(error){
            ElMessage.error('在刷新时出错！')
            console.error('Error during refresh', error)
        }
    }
    // 刷新当前选中数据
    function editIndirectData(){
        let selectedList = state.value.dataList[state.value.selectedDataIndex]
        if(selectedList.computeMethod === ''){
            ElMessage.warning('还未填写算式！')
            return
        }
        let resultDataSet
        if(selectedList.computeOption === 'forAll'){
            resultDataSet = evaluateExpression(state.value.dataList , selectedList.computeMethod, 'forAll', selectedList.title)
            // 数值计算
        }
        else if(selectedList.computeOption === 'forAvg'){
            resultDataSet = evaluateExpression(state.value.dataList , selectedList.computeMethod, 'forAvg', selectedList.title)
            // 数值计算
        }
        selectedList.dataSet = resultDataSet
        selectedList.moreUncer.wholeUncer = evaluateUncer(state.value.dataList, selectedList.computeMethod)
        refresh()
    }
    function analysisChange(){
        let selectedList = state.value.dataList[state.value.selectedDataIndex]
        if(selectedList.computeOption === 'forAll'){
            selectedList.analysis = {
                avg:{
                    propertyName:'平均值',
                    propertyValue:'0'
                },
                relAvgDev:{
                    propertyName:'相对平均偏差',
                    propertyValue:'0'
                },
                stdDev:{
                    propertyName:'标准偏差',
                    propertyValue:'0'
                },
                relStdDev:{
                    propertyName:'相对标准偏差',
                    propertyValue:'0'
                },
            }
        }
        else{
            selectedList.analysis = {
                avg: {
                    propertyName:'实验值',
                    propertyValue:'0'
                }
            }
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
        errorMode,
    }
})