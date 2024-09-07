<script setup>
import { useAllDataStore } from '../assets/stores';
import { computed, ref} from 'vue';
import { CircleClose } from '@element-plus/icons-vue';

//Don't import { ElMessage } from 'element-plus'!
const store = useAllDataStore()
const dataList = computed(()=>store.state.dataList)
const propertyLabel = [
    {
        prop:'propertyName',
        label:'分析结果'
    },
    {
        prop:'propertyValue',
        label:'值（已保留有效数字）'
    }
]
const selectedDataIndex = computed(()=>store.state.selectedDataIndex)
const isLine = computed(()=>store.state.isLine)
const isReadme = computed(()=>store.state.isReadme)
const isOutput = computed(()=>store.state.isOutput)
const isNumberDoc = computed(()=>store.state.isNumberDoc)
const isUncerDoc = computed(()=>store.state.isUncerDoc)
const isPropertyDoc = computed(()=>store.state.isPropertyDoc)
const tableOneColumns = computed(()=>{
    return selectedDataIndex.value >= 0 ? (dataList.value[selectedDataIndex.value].theoData === undefined || dataList.value[selectedDataIndex.value].theoData === ''? [{label:dataList.value[selectedDataIndex.value].title , prop:'rawData'}] : [{label:dataList.value[selectedDataIndex.value].title, prop:'rawData'},{label:'相对误差',prop:'relErr'}]) : []
})
const graphData = ref('')
function handleChange() {
  store.refresh()
}
const dataInput = ref('')
const handleAddRawData = ()=>{
    dataList.value[selectedDataIndex.value].dataSet.push({rawData:dataInput.value})
    dataInput.value = ''
    store.refresh()
}
const handleEditTheoData = ()=>{
    store.refresh()
}
const handleDeleteRawData = (index) =>{
    dataList.value[selectedDataIndex.value].dataSet.splice(index,1)
    store.refresh()
}
const handleEditEquipUncer = ()=>{
    store.refresh()
}
const handleCompute = ()=>{
    store.editIndirectData()
}
const handleComputeOptionChange =()=>{
    store.analysisChange()
}
const computeOptions = [
    {
        value:'forAll',
        label:'遍历元素'
    },
    {
        value:'forAvg',
        label:'对平均值'
    },
]
const graphOptions = [
    {
        value:'line',
        label:'线性拟合'
    },
    {
        value:'square',
        label:'二次拟合'
    },
    {
        value:'simple',
        label:'折线'
    },
    {
        value:'smooth',
        label:'曲线'
    }
]
const graphOption = ref('line')

const rely =
`\\documentclass{ctexart}
\\usepackage{geometry}
\\usepackage{amsmath}
\\usepackage{bm}
\\geometry{left=0cm,right=0cm,top=0cm,bottom=0cm}
\\pagestyle{empty}
\\usepackage{float}
\\usepackage{tabularray}
\\usepackage{calc}
\\usepackage{etoolbox}
\\newcommand{\\Romannumeral}[1]{\\uppercase\\expandafter{\\romannumeral #1}}
\\NewDocumentCommand{\\framed}{omo}{%
	\\framebox[\\widthof{#2}+4em]{
		\\begin{minipage}{\\widthof{#2}+2em}
			\\quad\\\\[2ex]
			\\centering #2
			\\IfNoValueF{#1}{\\caption{#1}\\IfNoValueF{#3}{\\em #3}}
		\\end{minipage}
	}
}
\\usepackage{tikz}
\\usetikzlibrary{calc}
\\usepackage{pgfplots}
\\usepackage{ifthen}
\\newcommand{\\xlabel}{}
\\newcommand{\\xmin}{}
\\newcommand{\\xmax}{}
\\newcommand{\\ylabel}{}
\\newcommand{\\ymin}{}
\\newcommand{\\ymax}{}
\\newboolean{xfield}
\\newboolean{yfield}
\\setboolean{xfield}{false}
\\setboolean{yfield}{false}
\\NewDocumentCommand{\\xstyle}{moo}{
	\\renewcommand{\\xlabel}{#1}
	\\IfNoValueF{#2}{
		\\setboolean{xfield}{true}
		\\renewcommand{\\xmin}{#2}
		\\renewcommand{\\xmax}{#3}
	}
}
\\NewDocumentCommand{\\ystyle}{moo}{
	\\renewcommand{\\ylabel}{#1}
	\\IfNoValueF{#2}{
		\\setboolean{yfield}{true}
		\\renewcommand{\\ymin}{#2}
		\\renewcommand{\\ymax}{#3}
	}
}
\\newcounter{markstyle}
\\NewDocumentEnvironment{plot}{mos}{
	#1%
	\\begin{tikzpicture}
		\\setcounter{markstyle}{0}
		\\ifbool{xfield}{
			\\ifbool{yfield}{
				\\begin{axis}[xlabel={\\xlabel},ylabel={\\ylabel},xmin=\\xmin,xmax=\\xmax,ymin=\\ymin,ymax=\\ymax,\\IfNoValueF{#2}{#2,} legend pos= outer north east,grid= major,\\IfBooleanT{#3}{axis equal,}]
			}{
				\\begin{axis}[xlabel={\\xlabel},ylabel={\\ylabel},xmin=\\xmin,xmax=\\xmax,\\IfNoValueF{#2}{#2,} legend pos= outer north east,grid= major,\\IfBooleanT{#3}{axis equal,}]
			}
		}{
			\\ifbool{yfield}{
				\\begin{axis}[xlabel={\\xlabel},ylabel={\\ylabel},ymin=\\ymin,ymax=\\ymax,\\IfNoValueF{#2}{#2,} legend pos= outer north east,grid= major,\\IfBooleanT{#3}{axis equal,}]
			}{
				\\begin{axis}[xlabel={\\xlabel},ylabel={\\ylabel},\\IfNoValueF{#2}{#2,} legend pos= outer north east,grid= major,\\IfBooleanT{#3}{axis equal,}]
			}
		}
}{
	\\end{axis}\\end{tikzpicture}\\setboolean{xfield}{false}\\setboolean{yfield}{false}
}

\\NewDocumentCommand{\\datapoint}{O{}mo}{
	\\ifcase\\value{markstyle}
		\\addplot[mark=*,solid,black,#1] coordinates {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{markstyle}
	\\or
		\\addplot[mark=square*,dashed,green,#1] coordinates {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{markstyle}
	\\or
		\\addplot[mark=diamond*,dotted,red,#1] coordinates {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{markstyle}
	\\or
		\\addplot[mark=triangle*,blue,#1] coordinates {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{markstyle}
	\\or
		\\addplot[mark=cross,yellow,#1] coordinates {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{markstyle}
	\\fi
}
\\begin{document}

\\end{document}`
const xData = ref('')
const yData = ref('')
const titleList = computed(()=>{
    return dataList.value.map(data => ({value:data.title,label:data.title}))
})

const graphContent = ref('')
function titleFormat(input) {
    if (!input) {
        return '';
    }

    // 定义希腊字母的映射
    const greekLetters = {
        'α': '\\alpha ',
        'β': '\\beta ',
        'γ': '\\gamma ',
        'δ': '\\delta ',
        'ε': '\\epsilon ',
        'ζ': '\\zeta ',
        'η': '\\eta ',
        'θ': '\\theta ',
        'ι': '\\iota ',
        'κ': '\\kappa ',
        'λ': '\\lambda ',
        'μ': '\\mu ',
        'ν': '\\nu ',
        'ξ': '\\xi ',
        'ο': '\\omicron ',
        'π': '\\pi ',
        'ρ': '\\rho ',
        'σ': '\\sigma ',
        'τ': '\\tau ',
        'υ': '\\upsilon ',
        'φ': '\\phi ',
        'χ': '\\chi ',
        'ψ': '\\psi ',
        'ω': '\\omega ',
        'Δ': '\\Delta ',
        'Θ': '\\Theta ',
        'Λ': '\\Lambda ',
        'Ξ': '\\Xi ',
        'Π': '\\Pi ',
        'Σ': '\\Sigma ',
        'Φ': '\\Phi ',
        'Ψ': '\\Psi ',
        'Ω': '\\Omega '
    };

    const chinese = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]+/g

    // 处理希腊字母替换
    input = input.replace(/α|β|γ|δ|ε|ζ|η|θ|ι|κ|λ|μ|ν|ξ|ο|π|ρ|σ|τ|υ|φ|χ|ψ|ω|Δ|Θ|Λ|Ξ|Π|Σ|Φ|Ψ|Ω/g, match => greekLetters[match]);

    input = input.replace(chinese, (match) => `\\text{${match}} `)
    // 使用正则表达式匹配字母后面直接跟随的数字或逗号隔开的数字
    return input.replace(/([a-zA-Z\\]+)\s*(\d+(,\d+)*)/g, '$1_{$2}');
}
// 把表格数据的头按LaTeX格式化

const unitFormat = ((str) => {
    if (str === '') {
        return str
    }
    // 替换常见符号
    str = str.replace(/μ/g, '\\mu')
             .replace(/°/g, '{}^{\\circ}')
             .replace(/℃/g, '{}^{\\circ}C')
             .replace(/\*/g, '\\cdot ')
    // 将字母后面跟随的正负数（包括负号）转化为上标
    str = str.replace(/([a-zA-Z])([-]?\d+)/g, '$1^{\$2}')
    // 处理分数的情况
    if (str.includes('/')) {
        str = '(' + str + ')'
    }
    return '/\\mathrm{' + str + '}'
})
// 把单位按LaTeX格式化

const commentFormat = (str) => {
    if (str === '') {
        return str;
    }

    const greekLetters = {
        'α': '\\alpha ',
        'β': '\\beta ',
        'γ': '\\gamma ',
        'δ': '\\delta ',
        'ε': '\\epsilon ',
        'ζ': '\\zeta ',
        'η': '\\eta ',
        'θ': '\\theta ',
        'ι': '\\iota ',
        'κ': '\\kappa ',
        'λ': '\\lambda ',
        'μ': '\\mu ',
        'ν': '\\nu ',
        'ξ': '\\xi ',
        'ο': '\\omicron ',
        'π': '\\pi ',
        'ρ': '\\rho ',
        'σ': '\\sigma ',
        'τ': '\\tau ',
        'υ': '\\upsilon ',
        'φ': '\\phi ',
        'χ': '\\chi ',
        'ψ': '\\psi ',
        'ω': '\\omega ',
        'Δ': '\\Delta ',
        'Θ': '\\Theta ',
        'Λ': '\\Lambda ',
        'Ξ': '\\Xi ',
        'Π': '\\Pi ',
        'Σ': '\\Sigma ',
        'Φ': '\\Phi ',
        'Ψ': '\\Psi ',
        'Ω': '\\Omega '
    };
    // 处理希腊字母替换
    str = str.replace(/α|β|γ|δ|ε|ζ|η|θ|ι|κ|λ|μ|ν|ξ|ο|π|ρ|σ|τ|υ|φ|χ|ψ|ω|Δ|Θ|Λ|Ξ|Π|Σ|Φ|Ψ|Ω/g, match => greekLetters[match]);

    // 处理希腊字母或字母后面的数字
    str = str.replace(/([a-zA-Z\\]+)\s*(\d+(,\d+)*)/g, '$1_{$2}');

    // 处理乘法符号
    str = str.replace(/\*/g, ' ');

    // 处理乘方表达式
    const processExponentiation = (input) => {
        let output = '';
        let i = 0;

        while (i < input.length) {
            const char = input[i];

            if (char === '^') {
                let base = output; // 底数部分
                let exponent = ''; // 指数部分
                let stack = [];
                i++; // 跳过 '^'

                // 处理指数部分
                while (i < input.length && (stack.length > 0 || !/[+\-*/^ {}]/.test(input[i]))) {
                    if (input[i] === '(') {
                        stack.push('(');
                    }
                    if (input[i] === ')') {
                        stack.pop();
                    }
                    exponent += input[i];
                    i++;
                }

                // 移除指数部分的外层括号
                if (exponent[0] === '(' && exponent[exponent.length - 1] === ')') {
                    exponent = exponent.slice(1, -1);
                    exponent = `{${exponent}}`
                }
                else{
                    exponent = `{${exponent}}`
                }
                exponent = processExponentiation(exponent);
                // 构建 LaTeX 格式的输出
                output = `${base}^${exponent}`;
            } else {
                output += char;
                i++;
            }
        }
        return output;
    };


    str = processExponentiation(str);

    // 处理分数表达式
    const processFractions = (input) => {
        let output = '';
        let stack = [];
        let numerator = '';
        let denominator = '';
        let inDenominator = false;
        let lastSlashIndex = -1;

        for (let i = 0; i < input.length; i++) {
            const char = input[i];

            if (char === '(') {
                stack.push('(');
                if (inDenominator) {
                    denominator += char;
                } else {
                    numerator += char;
                }
            } else if (char === ')') {
                stack.pop();
                if (inDenominator) {
                    denominator += char;
                } else {
                    numerator += char;
                }
            } else if (char === '/' && stack.length === 0) {
                inDenominator = true;
                lastSlashIndex = i;
            } else {
                if (inDenominator) {
                    denominator += char;
                } else {
                    numerator += char;
                }
            }
        }

        if (lastSlashIndex === -1) {
            output = numerator;
        } else {
            if (numerator.startsWith('(') && numerator.endsWith(')')) {
                numerator = numerator.slice(1, -1);
            }
            if (denominator.startsWith('(') && denominator.endsWith(')')) {
                denominator = denominator.slice(1, -1);
            }
            output = `\\frac{${numerator}}{${denominator}}`;
        }

        return output;
    };

    str = processFractions(str);

    // 处理 abs() 形式
    str = str.replace(/abs\(([^)]+)\)/g, '\\left| $1 \\right|');

    // 处理 sqrt() 形式
    str = str.replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}');

    // 处理 ln() 形式
    str = str.replace(/ln\(([^)]+)\)/g, '\\ln\\left( $1 \\right)');

    return str;
};
//表格注释按LaTeX格式化

const docFormat = (str) => {
    if(str === ''){
        return ''
    }
    else{
        return `(\\text{${str}})`
    }
}
// 含义按LaTeX格式化

const dataFormat = ((str) =>{
    if(typeof str === 'string'){
        return formatScientificToLatex(str.replace(/%/g, '\\%'))
    }
    else{
        return ''
    }
})
// 表格中的非运算数据

const headContent = computed(()=>{
    let head = ''
    let hlength = 1
    let vlength = 0
    let flag = true
    for(let i = 0; i<result.value.length;i++){
        let theItem = dataList.value.find(item => item.title === result.value[i] && !(item.type==='indirect' && item.computeOption === 'forAvg' ) )
        if(theItem && theItem.dataSet.length !== 1){
            if(theItem && flag){
                head = ''
                flag = false
                hlength = theItem.dataSet.length
                vlength++
            }
            if(theItem){
                vlength++
            }
        }
    }
    if(dataValues.value && dataValues.value.length >0){
        if(!(dataValues.value.length === 1 && typeof dataValues.value[0].data === 'object')){
            head = ',cell{'
        }
    }
    for(let i = 0; i < dataValues.value.length; i++){
        let datavalue = dataValues.value[i]
        vlength++
        if(typeof datavalue.data === 'object'){
            hlength = datavalue.data.length
            if(i !== dataValues.value.length -1){
                if(i !== 0){
                    head = headContent.value + ','
                }
            }
            else{
                if(!(dataValues.value.length ===1 && typeof dataValues.value[0].data === 'object')){
                    head += `}{2}={r=1,c=${hlength}}{c}`
                }
            }
        }
        else{
            head = head + String(vlength)
            if(i !== dataValues.value.length - 1){
                if(typeof dataValues.value[i+1].data !== 'object'){
                    head += ','
                }
            }
            else{
                head += `}{2}={r=1,c=${hlength}}{c}`
            }
        }
    }
    return head
})
const commentContent = computed(()=>{
    let comment = ''
    for(let i = 0; i<result.value.length;i++){
        let theItem = dataList.value.find(item => item.title === result.value[i] && !(item.type==='indirect' && item.computeOption === 'forAvg' ) )
        if(theItem && theItem.dataSet.length !== 1){
            if(theItem){
                if(theItem.computeMethod){
                    comment += ` $\\displaystyle ${titleFormat(theItem.title)} = ${commentFormat(theItem.computeMethod)} $\\qquad`
                }
            }
        }
    }
    for(let i = 0; i < dataValues.value.length; i++){
        let datavalue = dataValues.value[i]
        if(typeof datavalue.data === 'object'){}
        else{
            if(datavalue.formula){
                comment += ` $\\displaystyle ${titleFormat(datavalue.formulaTitle)} = ${commentFormat(datavalue.formula)} $\\qquad`
            }
        }
    }
    return comment
})

const centerContent = computed(()=>{
    let center = ''
    let flag = true
    for(let i = 0; i<result.value.length;i++){
        let theItem = dataList.value.find(item => item.title === result.value[i] && !(item.type==='indirect' && item.computeOption === 'forAvg' ) )
        if(theItem && theItem.dataSet.length !== 1){
            if(theItem && flag){
                flag = false
                center += '编号 &'
                for(let j = 1; j<=theItem.dataSet.length;j++){
                    if(j!== theItem.dataSet.length){
                        center += '$'+ String(j) + '$ & '
                    }
                    else{
                        center += '$'+ String(j) + '$ \\\\\n\t\t\t'
                    }
                }
            }
            if(theItem){
                center += '$'+ titleFormat(theItem.title) + docFormat(theItem.doc) + unitFormat(theItem.unit) + '$ & '
                for(let j=0; j<theItem.dataSet.length;j++){
                    if(j!==theItem.dataSet.length-1){
                        center += '$'+ dataFormat(theItem.dataSet[j].rawData)+ '$ & '
                    }
                    else{
                        if(i!== result.value.length-1){
                            center += '$'+ dataFormat(theItem.dataSet[j].rawData)+'$ \\\\'
                        }
                        else{
                            center += '$'+ dataFormat(theItem.dataSet[j].rawData)+'$'
                            if(dataValues.value && dataValues.value.length >0){
                                center += ' \\\\'
                            }
                        }
                    }
                }
                if(i!==result.value.length-1 || (dataValues.value && dataValues.value.length >0)){
                    center += '\n\t\t\t'
                }
            }
        }
    }
    for(let i = 0; i < dataValues.value.length; i++){
        let datavalue = dataValues.value[i]
        if(typeof datavalue.data === 'object'){
            center += datavalue.title
            datavalue.data.forEach(metadata =>{
                center += ' & '+ metadata
            })
            if(i !== dataValues.value.length -1){
                center += ' \\\\\n\t\t\t'
            }
        }
        else{
            if(i !== dataValues.value.length - 1){
                center += datavalue.title +' & '+ datavalue.data + ' \\\\' + '\n\t\t\t'
            }
            else{
                center += datavalue.title +' & '+ datavalue.data
            }
        }
    }
    center += '\n\t\t'
    return center
})
// 表格的中心内容

const tableTitleContent = ref('')
const props={
    multiple:true,
    checkStrictly: true,
    emitPath: false, // 如果只希望返回最后一级选项的值
    label:'label',
    value:'value',
}
const optionMap = (name , title, unit, doc)=>{
    let tmpunit = unitFormat(unit)
    let tmpdoc = docFormat(doc)
    if(title === ''){
        ElMessage.error('未命名的数据！')
        return ''
    }
    if(name === '平均值'){
        return `$\\overline{${titleFormat(title)}}`+ tmpdoc + tmpunit +'$'
    }
    if(name === '实验值'){
        return `$${titleFormat(title)}`+ tmpdoc + tmpunit +'$'
    }
    if(name === '相对平均偏差'){
        return `$\\overline{\\delta}_{r,${titleFormat(title)}}$`
    }
    if(name === '标准偏差'){
        return `$s_{${titleFormat(title)}}`+tmpunit+'$'
    }
    if(name === '相对标准偏差'){
        return `$s_{r,${titleFormat(title)}}$`
    }
    if(name === 'A类不确定度'){
        return `$u_{A,${titleFormat(title)}}`+tmpunit+'$'
    }
    if(name === `B类不确定度`){
        return `$u_{B,${titleFormat(title)}}`+tmpunit+'$'
    }
    if(name === `不确定度`){
        return `$u_{${titleFormat(title)}}`+tmpunit+'$'
    }
    if(name === '平均相对误差'){
        return `$\\overline{\\varepsilon}_{r,${titleFormat(title)}}$`
    }
    if(name === '平均值与理论值的相对误差'){
        return `$\\Delta_{r,${titleFormat(title)}}$`
    }
    if(name === '理论值'){
        return `$${titleFormat(title)}_{\\text{theory}}`+ tmpdoc +tmpunit+'$'
    }
    if(name === '相对误差'){
        return `$\\varepsilon_{r,${titleFormat(title)}}$`
    }
}

const dataOptions = computed(()=>{
    let tmpDataOptions = []
    for(let i = 0; i<dataList.value.length; i++){
        let theItem = dataList.value[i]
        let unit = theItem.unit
        let doc = theItem.doc
        let tmp = {}
        tmp.label = theItem.title
        if(theItem.dataSet.length === 1){
            tmp.value = {
                title:`$${titleFormat(theItem.title)}`+unitFormat(unit)+'$',
                data:'$'+dataFormat(theItem.dataSet[0].rawData)+'$'
            }
            if(theItem.type === 'indirect'){
                tmp.value.formula = theItem.computeMethod
                tmp.value.formulaTitle = titleFormat(theItem.title)
            }
        }
        else{
            tmp.value = theItem.title
        }
        tmp.children=[]
        if(theItem.theoData && theItem.theoData !== '0'){
            tmp.children.push({
                value:{title:optionMap('理论值',theItem.title,unit,doc),data:'$'+dataFormat(theItem.theoData)+'$'},
                label:'理论值'
            })
            let tmpdata = []
            theItem.dataSet.forEach(item=>{
                if(item.relErr){
                    tmpdata.push('$'+item.relErr.replace(/%/g, '\\%')+'$')
                }
            })
            tmp.children.push({
                value:{title:optionMap('相对误差',theItem.title,unit,doc),data:tmpdata},
                label:'相对误差'
            })
        }
        for(let key in theItem.analysis){
            let ana = theItem.analysis[key]
            if(ana.propertyValue !== '' && ana.propertyValue !== '0'){
                let tmpChild = {
                    value:{
                        title:optionMap(ana.propertyName,theItem.title,unit, doc)
                    },
                    label:ana.propertyName
                }
                tmpChild.value.data = dataFormat(ana.propertyValue)
                tmpChild.value.data = '$'+ tmpChild.value.data +'$'
                tmp.children.push(tmpChild)
            }
        }
        if(theItem.moreUncer.bUncer && theItem.moreUncer.bUncer !== '0'){
            tmp.children.push({
                value:{title:optionMap('B类不确定度',theItem.title,unit, doc),data:'$'+dataFormat(theItem.moreUncer.bUncer)+'$'},
                label:'B类不确定度'
            })
        }
        if(theItem.moreUncer.wholeUncer && theItem.moreUncer.wholeUncer !== '0'){
            tmp.children.push({
                value:{title:optionMap('不确定度',theItem.title,unit, doc),data:'$'+dataFormat(theItem.moreUncer.wholeUncer)+'$'},
                label:'不确定度'
            })
        }
        tmpDataOptions.push(tmp)
    }
    return tmpDataOptions
})
const dataValuesSource = ref([])
const dataValues = computed(()=>{
    let tmp = []
    if(dataValuesSource.value && dataValuesSource.value.length){
        dataValuesSource.value.forEach(item=>{
            if(typeof item === 'object'){

                tmp.push(item)
            }
        })
    }
    return tmp
})
const result = computed(()=>{
    let tmp = []
    if(dataValuesSource.value && dataValuesSource.value.length){
        dataValuesSource.value.forEach(item=>{
            if(typeof item === 'string'){
                if(item === ''){
                    ElMessage.error('未命名的数据！')
                    return []
                }
                tmp.push(item)
            }
        })
    }
    return tmp
})
const code = ref('')
const handleTableUpdate = (()=>{
    code.value = `\\begin{table}[H]\n\t\\framed[${tableTitleContent.value}]{\n\t\t\\begin{tblr}{hlines,vlines,cells={c}`+headContent.value+'}\n\t\t\t'+centerContent.value+'\\end{tblr}\n\t}['+commentContent.value+']\n\\end{table}'
    ElMessage.success('刷新成功！')
})
const copyToClipboard = (str,type) => {
    navigator.clipboard.writeText(str)
    .then(() => {
        ElMessage.success(`${type === 'rely' ? '依赖' : '内容'}已复制到剪贴板！`)
    })
    .catch(err => alert('复制失败: ' + err));
}
const handleRelyCopy = ()=>{
    copyToClipboard(rely,'rely')
}
const handleCodeCopy = ()=>{
    copyToClipboard(code.value,'code')
}
const handleGraphCopy = ()=>{
    copyToClipboard(graphContent.value,'graph')
}
function formatScientificToLatex(str) {
    // 正则表达式匹配科学计数法
    const scientificRegex = /^([-+]?\d+(\.\d+)?)([eE][-+]?\d+)$/;
    const match = str.match(scientificRegex);

    if (match) {
        // 分解匹配结果
        const base = match[1]; // 基数部分
        let exponent = match[3].substring(1); // 指数部分，移除'e'或'E'

        // 移除指数部分的正号
        exponent = exponent.replace(/^\+/, "");

        // 转换为LaTeX格式
        return `${base} \\times 10^{${exponent}}`;
    }
    else {
        return str; // 不是科学计数法的情况
    }
}
const graphTitleContent = ref('')
const handleGraphUpdate = ()=>{
    if(graphOption.value === 'line'){
        graphData.value = store.evaluateLine(xData.value,yData.value)
        let center1 = ' '
        let center2 = ' '
        let x = dataList.value.find(item => item.title === xData.value)
        let y = dataList.value.find(item => item.title === yData.value)
        if(x && y){
            const xMin = x.dataSet.reduce((min, data) => {
                return min < Number(data.rawData) ? min : Number(data.rawData);
            },Number(x.dataSet[0].rawData))
            const xMax = x.dataSet.reduce((max, data) => {
                return max > Number(data.rawData) ? max : Number(data.rawData);
            },Number(x.dataSet[0].rawData))
            const yMin = xMin * Number(graphData.value.slope) + Number(graphData.value.intercept)
            const yMax = xMax * Number(graphData.value.slope) + Number(graphData.value.intercept)
            if(x.dataSet.length === y.dataSet.length){
                for(let i = 0; i<x.dataSet.length;i++){
                    center1 = center1 +'('+x.dataSet[i].rawData+','+y.dataSet[i].rawData+') '
                }
                center2 = center2 + '(' + String(xMin)+','+String(yMin)+') ('+ String(xMax)+','+String(yMax)+') '
            }
            else{
                ElMessage.error('数组长度不一致！')
            }
        }
        graphContent.value = `\\begin{figure}[H]\n\t\\framed[${graphTitleContent.value}]{\n\t\t\\begin{plot}{\\xstyle{$${titleFormat(xData.value)}`+unitFormat(x.unit)+`$}\\ystyle{$${titleFormat(yData.value)}`+unitFormat(y.unit)+`$}}\n\t\t\t\\datapoint[no markers]{` + center2 +'}[拟合直线]\n\t\t\t\\datapoint[only marks]{'+center1+'}[实验数据]\n\t\t\\end{plot}\n\t}[$y='+formatScientificToLatex(graphData.value.slope)+'x'+(graphData.value.intercept[0]==='-'?'':'+')+formatScientificToLatex(graphData.value.intercept)+'\\qquad R^2='+formatScientificToLatex(graphData.value.rSquared)+'$]'+'\n\\end{figure}'
    }
    else if(graphOption.value === 'square'){
        graphData.value = store.evaluateSquare(xData.value,yData.value)
        let center1 = ' '
        let center2 = ''
        let x = dataList.value.find(item => item.title === xData.value)
        let y = dataList.value.find(item => item.title === yData.value)
        let xMin = ''
        let xMax = ''
        if(x && y){
            xMin = x.dataSet.reduce((min, data) => {
                return min < Number(data.rawData) ? min : Number(data.rawData);
            },Number(x.dataSet[0].rawData))
            xMax = x.dataSet.reduce((max, data) => {
                return max > Number(data.rawData) ? max : Number(data.rawData);
            },Number(x.dataSet[0].rawData))
            if(x.dataSet.length === y.dataSet.length){
                for(let i = 0; i<x.dataSet.length;i++){
                    center1 = center1 +'('+x.dataSet[i].rawData+','+y.dataSet[i].rawData+') '
                }
                center2 = graphData.value.a + '*x*x' + (graphData.value.b[0]==='-'?'':'+')+graphData.value.b+'*x'+(graphData.value.c[0]==='-'?'':'+')+graphData.value.c
            }
            else{
                ElMessage.error('数组长度不一致！')
            }
        }
        graphContent.value = `\\begin{figure}[H]\n\t\\framed[标题]{\n\t\t\\begin{plot}{\\xstyle{$${titleFormat(xData.value)}`+unitFormat(x.unit)+`$}\\ystyle{$${titleFormat(yData.value)}`+unitFormat(y.unit)+`$}}\n\t\t\t\\addplot[no markers,domain=`+String(xMin)+':'+String(xMax)+']{' + center2 +'};\n\t\t\t\\addlegendentry{拟合曲线}\n\t\t\t\\datapoint[only marks]{'+center1+'}[实验数据]\n\t\t\\end{plot}\n\t}[$y='+formatScientificToLatex(graphData.value.a) + 'x^2' + (graphData.value.b[0]==='-'?'':'+')+formatScientificToLatex(graphData.value.b)+'x'+(graphData.value.c[0]==='-'?'':'+')+formatScientificToLatex(graphData.value.c)+'\\qquad R^2='+formatScientificToLatex(graphData.value.rSquared)+'$]'+'\n\\end{figure}'
    }
    else if(graphOption.value === 'simple'){
        let center1 = ' '
        let x = dataList.value.find(item => item.title === xData.value)
        let y = dataList.value.find(item => item.title === yData.value)
        if(x && y){
            if(x.dataSet.length === y.dataSet.length){
                for(let i = 0; i<x.dataSet.length;i++){
                    center1 = center1 +'('+x.dataSet[i].rawData+','+y.dataSet[i].rawData+') '
                }
            }
            else{
                ElMessage.error('数组长度不一致！')
            }
        }
        graphContent.value = `\\begin{figure}[H]\n\t\\framed[标题]{\n\t\t\\begin{plot}{\\xstyle{$${titleFormat(xData.value)}`+unitFormat(x.unit)+`$}\\ystyle{$${titleFormat(yData.value)}`+unitFormat(y.unit)+`$}}\n\t\t\t`+'\\datapoint{'+center1+'}[图例]\n\t\t\\end{plot}\n\t}'+'\n\\end{figure}'
    }
    else if(graphOption.value === 'smooth'){
        let center1 = ' '
        let x = dataList.value.find(item => item.title === xData.value)
        let y = dataList.value.find(item => item.title === yData.value)
        if(x && y){
            if(x.dataSet.length === y.dataSet.length){
                for(let i = 0; i<x.dataSet.length;i++){
                    center1 = center1 +'('+x.dataSet[i].rawData+','+y.dataSet[i].rawData+') '
                }
            }
            else{
                ElMessage.error('数组长度不一致！')
            }
        }
        graphContent.value = `\\begin{figure}[H]\n\t\\framed[标题]{\n\t\t\\begin{plot}{\\xstyle{$${titleFormat(xData.value)}`+unitFormat(x.unit)+`$}\\ystyle{$${titleFormat(yData.value)}`+unitFormat(y.unit)+`$}}\n\t\t\t`+'\\datapoint[smooth]{'+center1+'}[图例]\n\t\t\\end{plot}\n\t}'+'\n\\end{figure}'
    }
    ElMessage.success('刷新成功！')
}
const handleUncerEdit = ()=>{
    store.refresh()
}
const handleDataMethodChange =()=>{
    let selectedList = dataList.value[selectedDataIndex.value]
    if(selectedList.dataMethod){
        dataList.value[selectedDataIndex.value].dataSet.forEach(item=>{
            item.rawData = store.errorMode(item.rawData)
        })
    }
    else{
        store.editIndirectData()
    }
}
const handleTableSelectAll =()=>{
    let tmpValueSource = []
    dataOptions.value.forEach(item => {
        tmpValueSource.push(item.value)
    })
    dataValuesSource.value = tmpValueSource
    handleTableUpdate()
}
const handleTableClearAll = ()=>{
    dataValuesSource.value = []
    tableTitleContent.value = ''
    handleTableUpdate()
}
</script>
<template>

<div v-show="selectedDataIndex >= 0 ? dataList[selectedDataIndex].type === 'direct' : false">
    <div class="card-div">
        <el-card shadow="hover">
            <el-table
                :data="selectedDataIndex >= 0 ? dataList[selectedDataIndex].dataSet : []"
            >
                <el-table-column fixed="left" width="60px">
                    <template #="scope">
                        {{ scope.$index+1 }}
                    </template>
                </el-table-column>
                <el-table-column
                    v-for="(column, index) in tableOneColumns"
                    :key="index"
                    :prop="column.prop"
                    :label="column.label"
                    align = 'center'
                >
                    <template #default="scope">
                        <el-input
                            v-model="scope.row[column.prop]"
                            @change="handleChange() "
                            :disabled = "column.prop === 'relErr'"
                        >
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" width="60px">
                    <template #="scope">
                        <el-icon
                            @click="handleDeleteRawData(scope.$index)"
                            class="deleteicon el-icon--right"
                        >
                            <circle-close></circle-close>
                        </el-icon>
                    </template>
                </el-table-column>
            </el-table>
            <div class="edit-one">
                <div class="new-data" v-show="selectedDataIndex >= 0">
                    <label style="font-weight: 550;width: 20%;text-align: left;">新数据</label>
                    <input v-model="dataInput" @change="handleAddRawData" style="text-align: center;width: 80%;">
                </div>
                <div v-if="selectedDataIndex >= 0" class="theo-data">
                    <label style="font-weight: 550;width: 20%;text-align: left;" >理论值</label>
                    <input v-model="dataList[selectedDataIndex].theoData" style="text-align: center;width: 80%;" placeholder="选填" @change="handleEditTheoData"></input>
                </div>
            </div>
            <div class="equipment" v-if="selectedDataIndex >= 0">
                <label style="font-weight: 550;width: 10%;text-align: left;min-width: 5em;" >精度规则</label>
                <el-switch
                    v-model="dataList[selectedDataIndex].levelRule"
                    size="large"
                    inactive-text="统一精度"
                    active-text="不统一精度"
                    style="font-size: large;width: 40%;--el-switch-on-color: #626aef;"
                />
                <span style="width: 1%;"></span>
                <label style="font-weight: 550;width: 9%;text-align: left;min-width: 5em;" >符号含义</label>
                <input v-model="dataList[selectedDataIndex].doc" style="text-align: center;width: 40%;" placeholder="选填，仅对 LaTeX 制表/图有影响">
            </div>
        </el-card>
    </div>
</div>
<!-- 直接数据的编辑卡片 -->
<div class="card-div" v-if="selectedDataIndex >= 0 ? dataList[selectedDataIndex].type === 'indirect' : false">
    <el-card shadow="hover">
        <div class="equipment">
            <label style="font-weight: 550;width: 10%;text-align: center;min-width: 4.5em;">计算方式</label>
            <el-select
                style="width: 10%;text-align: center;min-width: 7em"
                v-model="dataList[selectedDataIndex].computeOption"
                @change="handleComputeOptionChange"
            >
                <el-option v-for="option in computeOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
            </el-select>
            <span style="width: 1%;"></span>
            <input style="text-align: center;width: 64%;" placeholder="示例：(a+b)/(9.8*c)" v-model="dataList[selectedDataIndex].computeMethod">
            <span style="width: 1%;"></span>
            <el-button style="width: 14%;" @click="handleCompute">刷新</el-button>
        </div>
        <div class="equipment">
            <label style="font-weight: 550;width: 10%;text-align: center;">保留方式</label>
            <span style="width: 5%;"></span>
            <el-switch
                v-model="dataList[selectedDataIndex].dataMethod"
                size="large"
                active-text="不确定度方式"
                inactive-text="有效数字方式"
                style="font-size: large;width: 40%;--el-switch-on-color: #626aef;"
                @change="handleDataMethodChange"
            />
            <span style="width: 1%;"></span>
            <label style="font-weight: 550;width: 5%;text-align: left;min-width: 5em;" >符号含义</label>
            <input v-model="dataList[selectedDataIndex].doc" style="text-align: center;width: 39%;" placeholder="选填，仅对 LaTeX 制表/图有影响">
            <br />
        </div>
    </el-card>
</div>
<!-- 间接数据的编辑卡片 -->
<div class="card-div" v-if="selectedDataIndex >= 0">
    <el-card shadow="hover">
        <div class="equipment">
            <label style="font-weight: 550;width: 16%;text-align: left;">单位</label>
            <input style="text-align: center;width: 84%;" placeholder="选填，仅对LaTeX制表/图有影响" v-model="dataList[selectedDataIndex].unit">
        </div>
    </el-card>
</div>
<!-- 公用的单位卡片 -->
<div class="card-div" v-if="selectedDataIndex >= 0 ? dataList[selectedDataIndex].type === 'indirect' && dataList[selectedDataIndex].computeOption === 'forAll' : false">
    <div class="card-div">
        <el-card shadow="hover">
            <el-table
                :data="selectedDataIndex >= 0 ? dataList[selectedDataIndex].dataSet : []"
            >
                <el-table-column fixed="left" width="60px">
                    <template #="scope">
                        {{ scope.$index+1 }}
                    </template>
                </el-table-column>
                <el-table-column
                    v-for="(column, index) in tableOneColumns"
                    :key="index"
                    :prop="column.prop"
                    :label="column.label"
                    align = 'center'
                >
                    <template #default="scope">
                        <el-input
                            v-model="scope.row[column.prop]"
                            @change="handleChange() "
                            :disabled = "column.prop === 'relErr'"
                        >
                        </el-input>
                    </template>
                </el-table-column>
            </el-table>
            <div class="edit-one">
                <div v-if="selectedDataIndex >= 0" class="indirect-theo-data">
                    <label style="font-weight: 550;width: 20%;text-align: left;" >理论值</label>
                    <input v-model="dataList[selectedDataIndex].theoData" style="text-align: center;width: 80%;" placeholder="选填" @change="handleEditTheoData"></input>
                </div>
            </div>
        </el-card>
    </div>
</div>
<div class="card-div" v-if="selectedDataIndex >= 0 ? dataList[selectedDataIndex].type === 'indirect' && dataList[selectedDataIndex].computeOption === 'forAvg' : false">
    <div class="card-div">
        <el-card shadow="hover">
            <div class="edit-one">
                <div v-if="selectedDataIndex >= 0" class="indirect-theo-data">
                    <label style="font-weight: 550;width: 20%;text-align: left;" >理论值</label>
                    <input v-model="dataList[selectedDataIndex].theoData" style="text-align: center;width: 80%;" placeholder="选填" @change="handleEditTheoData"></input>
                </div>
            </div>
        </el-card>
    </div>
</div>
 <!-- 间接数据的展示卡片 -->
<div class="card-div" v-show="selectedDataIndex >= 0">
    <el-card shadow="hover">
        <el-table
            :data="selectedDataIndex >= 0 ? Object.values(dataList[selectedDataIndex].analysis) : []"
        >
            <el-table-column
                v-for="(property,index) in propertyLabel"
                :key="index"
                :prop="property.prop"
                :label="property.label"
                align="center"
            >
            </el-table-column>
        </el-table>
    </el-card>
</div>
<!-- 公用的属性卡片 -->
<div class="card-div" v-if="selectedDataIndex >= 0 ? dataList[selectedDataIndex].type === 'direct' : false">
    <el-card shadow="hover">
        <div class="equipment">
            <label style="font-weight: 550;width: 20%;text-align: left;">仪器允差</label>
            <input style="text-align: center;width: 80%;" placeholder="选填" v-model="dataList[selectedDataIndex].moreUncer.equipUncer" @change="handleEditEquipUncer">
        </div>
        <div class="equipment" v-show="dataList[selectedDataIndex].moreUncer.bUncer">
            <label style="font-weight: 550;width: 20%;text-align: left;">B类不确定度</label>
            <input
                style="text-align: center;width: 80%;"
                v-model="dataList[selectedDataIndex].moreUncer.bUncer"
                disabled
            >
        </div>
        <div class="equipment">
            <label style="font-weight: 550;width: 20%;text-align: left;">不确定度</label>
            <input style="text-align: center;width: 80%;" :disabled="dataList[selectedDataIndex].dataSet.length !== 1" v-model="dataList[selectedDataIndex].moreUncer.wholeUncer" @change="handleUncerEdit">
        </div>
    </el-card>
</div>
<!-- 直接数据的不确定度卡片 -->
 <div class="card-div" v-if="selectedDataIndex >= 0 ? dataList[selectedDataIndex].type === 'indirect' : false">
    <el-card shadow="hover">
        <div class="equipment">
            <label style="font-weight: 550;width: 20%;text-align: left;">不确定度</label>
            <input style="text-align: center;width: 80%;" disabled v-model="dataList[selectedDataIndex].moreUncer.wholeUncer">
        </div>
    </el-card>
</div>
<!-- 间接数据的不确定度卡片 -->

<div v-show="isLine">
    <div class="card-div">
        <el-card shadow="hover">
            <div class="equipment">
                <label style="font-weight: 550;width: 10%;text-align: center;">x轴数据</label>
                <span style="width: 1%;"></span>
                <el-select
                    style="width: 22%;text-align: center;min-width: 5.5em"
                    v-model="xData"
                >
                    <el-option v-for="title in titleList" :key="title.value" :label="title.label" :value="title.value"></el-option>
                </el-select>
                <span style="width: 1%;"></span>
                <label style="font-weight: 550;width: 10%;text-align: center;">y轴数据</label>
                <span style="width: 1%;"></span>
                <el-select
                    style="width: 22%;text-align: center;min-width: 5.5em"
                    v-model="yData"
                >
                    <el-option v-for="title in titleList" :key="title.value" :label="title.label" :value="title.value"></el-option>
                </el-select>
                <span style="width: 1%;"></span>
                <label style="font-weight: 550;width: 10%;text-align: center;">标题</label>
                <span style="width: 1%;"></span>
                <input placeholder="标题" v-model="graphTitleContent" style="width: 22%; text-align: center;">
            </div>
            <div class="equipment">
                <label style="font-weight: 550;width: 10%;text-align: center;">制图方法</label>
                <span style="width: 5%;"></span>
                <el-select
                    style="width: 45%;text-align: center;min-width: 5.5em"
                    v-model="graphOption"
                >
                    <el-option v-for="option in graphOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
                </el-select>
                <span style="width: 5%;"></span>
                <el-button @click="handleGraphUpdate" style="width: 35%; text-align: center;">刷新</el-button>
            </div>
        </el-card>
    </div>
    <div class="card-div" v-if="graphData !== ''">
        <el-card shadow="hover">
            <div class="equipment" style="font-size: 15pt;font-weight: bold;" v-if="graphOption === 'line'">
                拟合结果：{{'y = '+graphData.slope+' x '+(graphData.intercept[0]==='-'?'':'+ ')+graphData.intercept+' '+','+' R² = '+graphData.rSquared}}
            </div>
            <div class="equipment" style="font-size: 15pt;font-weight: bold;" v-if="graphOption === 'square'">
                拟合结果：{{'y = '+ graphData.a + ' x² ' + (graphData.b[0]==='-'?'':'+ ')+graphData.b+' x '+(graphData.c[0]==='-'?'':'+ ')+graphData.c+' , R² = '+graphData.rSquared}}
            </div>
        </el-card>
    </div>
    <div class="card-div">
        <el-card shadow="hover" style="height: 350px; overflow: auto;">
            <div>
                <div style="text-align: center;"> <el-button style="font-weight: bold; font-size: large;" @click="handleRelyCopy">依赖(点击复制)</el-button></div>
                <pre>{{rely}}</pre>
            </div>
        </el-card>
        <br>
        <el-card shadow="hover">
            <div>
                <div style="text-align: center;"> <el-button style="font-weight: bold; font-size: large;" @click="handleGraphCopy">内容(点击复制)</el-button></div>
                <pre>{{graphContent}}</pre>
            </div>
        </el-card>
    </div>
</div>
<!-- 导出为LaTeX图像视图 -->
<div v-show="isReadme">
    <h2>直接数据</h2>
    <p>直接数据默认是精度相同的数据集。因此，输入时<em>允许省略末尾的零</em>（只要有一个数据末尾不为0）。如果直接数据的精度确实不同，可以通过<em>精度规则-不统一精度</em>调整。</p>
    <p>在新数据处输入数据并回车即可添加数据，各类信息会随着数据的输入自动更新。</p>
    <p>单位只会影响 <span class="formula">LaTeX</span> 制作图表，不参与计算。斑鸠会自动处理 <span class="formula">*，/</span> 和数字上标，也包括 <span class="formula">μ，°，℃</span> 这几个不常见字符。</p>
    <p>单位示例：<span class="formula">kg*m/s2</span> 。</p>
    <h2>间接数据</h2>
    <p>间接数据通过直接数据计算得到。可以在待填处填入计算式，目前支持 <span class="formula">+，-, *, /, ^, ()</span>  运算符与 <span class="formula">ln(), lg(), sqrt(), abs()</span> 函数。使用直接数据前，需要在侧栏处为直接数据<em>命名</em>。现在对变量的命名没有严格要求，一般建议把中文部分放在数据的<em>含义</em>内容中。</p>
    <p>tips:字母后的数字会<em>自动识别成下标</em>， <span class="formula">a1，b1,2</span> 都是合法的命名。</p>
    <p>示例：有直接数据 <span class="formula">a, b, c, d</span>，可写计算式 <span class="formula">(a+b)*c/d/9.8</span>。</p>
    <p>需要注意的是，直接在运算式中输入数字，处理器会默认该数据是<em>精准数据</em>，会按照<em>存疑数字原则</em>保留计算结果的有效数字。如果数字拥有有效数字，请把它<em>作为直接数据</em>输入。</p>
    <p>确定计算方式和计算式后，<em>点击刷新</em>，即可获得最新的间接数据。</p>
    <p>斑鸠会自动根据计算式求出间接数据的不确定度。请确保依赖的直接数据的不确定度正确。</p>
    <h2><span class="formula">LaTeX</span> 制表</h2>
    <p>选择表格数据，点击刷新，即生成对应表格的 <span class="formula">LaTeX</span> 代码。点击全选，可以选中当前的所有数据。</p>
    <p><span class="formula">LaTeX</span> 代码的依赖同时包含制表和制图的依赖。因此，<em>只需复制一次</em>即可。</p>
    <p>间接数据的计算公式也会出现在图表中。</p>
    <h2><span class="formula">LaTeX</span> 制图</h2>
    <p>为数据命名后，即可通过选择数据与制图方法获得 <span class="formula">LaTeX</span> 代码。在这里，依赖的内容与 <span class="formula">LaTeX</span> 制表处相同。</p>
    <p>在最小二乘直线斜率的有效数字方面，使用 x 数据集中最大的有效位数、 y 数据集中最大的有效位数中的最小者。</p>
    <p>选择好数据后，<em>点击刷新</em>，即可获得最新的代码。</p>
    <h2>参考</h2>
    <p>时有忘记各种计算方法的时候，所以留了三个参考，方便查阅。</p>
</div>
  <!-- readme视图 -->
<div v-show="isOutput">
    <div class="card-div">
        <el-card shadow="hover">
            <div class="equipment">
                <label style="font-weight: 550;width: 10%;text-align: center;">表格数据</label>
                <span style="width: 1%;"></span>
                <el-cascader
                    :options="dataOptions"
                    :props="props"
                    placeholder="选择数据"
                    v-model="dataValuesSource"
                    style="width: 38.5%;"
                >
                </el-cascader>
                <span style="width: 1%;"></span>
                <label style="font-weight: 550;width: 10%;text-align: center;">标题</label>
                <span style="width: 1%;"></span>
                <input placeholder="标题" v-model="tableTitleContent" style="width: 38.5%; text-align: center;">

            </div>
            <div class="equipment">
                <el-button @click="handleTableSelectAll" style="width: 32%;">全选</el-button>
                <el-button @click="handleTableClearAll" style="width: 32%;">清空</el-button>
                <el-button @click="handleTableUpdate" style="width: 32%;">刷新</el-button>
            </div>
        </el-card>
    </div>
    <div class="card-div">
        <el-card shadow="hover" style="height: 350px; overflow: auto;">
            <div>
                <div style="text-align: center;"> <el-button style="font-weight: bold; font-size: large;" @click="handleRelyCopy">依赖(点击复制)</el-button></div>
                <pre>{{rely}}</pre>
            </div>
        </el-card>
        <br>
        <el-card shadow="hover">
            <div>
                <div style="text-align: center;"> <el-button style="font-weight: bold; font-size: large;" @click="handleCodeCopy">内容(点击复制)</el-button></div>
                <pre>{{code}}</pre>
            </div>
        </el-card>
    </div>
</div>
<!-- 导出为LaTeX图表视图 -->
<div v-show="isNumberDoc">
    <h2>1. 有效数字的修约原则</h2>
    <p>有效数字的修约遵循<em>四舍六入五凑偶</em>的原则：</p>
    <ul>
        <li>当修约的保留位后首位数字<strong>小于5</strong>时，舍去保留位之后的所有数字，保留位不变。例如：3.141保留到0.01位，则修约到 3.14。</li>
        <li>当修约的保留位后首位数字<strong>大于5</strong>，或<strong>等于5且后面还有非零数字</strong>时，舍去修约位置之后的所有数字，并将保留位的最后一位数加1。例如：3.146或3.1451 保留到0.01位，则修约到 3.15。</li>
        <li>当修约的保留位后首位数字<strong>等于5，且后面数字均为0</strong>时，若保留位为偶数，则直接舍去保留位之后的所有数字；若保留位为奇数，则在舍去的基础上，保留位进一。例如：2.550 保留到0.1位，则修约到 2.6；换成2.650，则也修约到2.6。</li>
    </ul>

    <h2>2. 函数值的有效位数表示法</h2>
    <p>在函数运算中，函数值的有效位数通常由函数中所用参数的有效位数决定：</p>
    <ul>

        <li>三角函数：计算结果的有效数字和角度的有效数字位数相同。</li>
        <li>对数函数：计算结果的<strong>小数部分</strong>与真数的有效位数相同；</li>
        <li>其它函数：将自变量的最后一位上下变动一个单位，函数结果在哪一位开始变动，就保留到哪一位。</li>
    </ul>

    <h2>3. 有效数字的运算法则</h2>
    <p>有效数字的运算遵循以下法则：</p>
    <ul>
        <li>加、减法运算：结果的有效位数由<strong>小数点后最少的位数</strong>决定，即取<strong>最低的精度</strong>。例如：5.12 + 2.3 = 7.4 (保留1位小数)。</li>
        <li>乘、除法运算：结果的有效位数由所有参与运算的数中<strong>有效数字最少</strong>的决定，即取<strong>最少的位数</strong>。例如：4.56 × 2.4 = 11 (保留2位有效数字)。</li>
        <li>混合运算：应按顺序逐步运算，并遵循每一步的运算规则。例如：(2.1 + 3.55) × 2.10 = 12 (在加法中，有效数字为2位)。</li>
        <li>在实际操作中，<strong>中间运算可不进行修约</strong>，只需保证最后结果的有效位数正确。</li>
        <li>关于<strong>精确数字</strong>，一般认为它的有效数字有<strong>无穷多位</strong>。但存在一个特殊情况：取 93.1 和 92.9 的平均值时，如果直接按无穷多位来算，结果应当是 (93.1 + 92.9) / 2 = 186.0 / 2 = 93.00。然而，可以发现，平均值的精度居然比原始数据的精度还高了，这显然是不合理的。此时，我们应考虑<strong>存疑数字</strong>，原始数据的存疑数字是 0.1 ，所以除以 2 后仍是 0.1 ，因此结果是 93.0。 这个点比较隐蔽，不排除批改报告的老师没有注意到的情况。因此，<strong>保留时可以注明“依照存疑数字保留有效位数”</strong>。</li>
    </ul>
</div>
<!-- 有效数字视图 -->
<div v-show="isUncerDoc">
    <h2>1. 不确定度的保留位数法则</h2>
    <p>不确定度的保留位数通常与测量结果的有效位数相对应，具体法则如下：</p>
    <ul>
        <li>修约法则：保留位后一位若不为 0，则进位。保留位后的数字一律舍去。</li>
        <li>当不确定度的<strong>第一位 ≥3 </strong>时，保留<strong>一位有效数字</strong>。例如，不确定度为0.056，则修约为0.06。</li>
        <li>当不确定度的<strong>第一位 =1,2</strong> 时，保留<strong>两位有效数字</strong>。例如，不确定度为0.0120，则修约为0.012。</li>
        <li>测量结果应<strong>与不确定度保留相同的小数位数</strong>。例如，测量值为3.141，且不确定度为0.06，则最终结果表示为3.14 ± 0.06。</li>
        <li>需要注意的是，如果不确定度修约之后，第一位由2变成了3，则应保留一位有效数字。例如，不确定度为0.291，则修约为0.3。</li>
        <li>类似地，若修约之后，第一位由9变成了1，则应保留两位有效数字。例如，不确定度为0.91，则修约为1.0。</li>
    </ul>

    <h2>2. 不确定度的合成方式</h2>
    <p>在多个测量值的运算中，不确定度的合成遵循以下公式：</p>
    <ul>
        <li>
            <strong>加法或减法：</strong>对于 <span class="formula">y = ax<sub>1</sub> + bx<sub>2</sub></span> 或 <span class="formula">y = ax<sub>1</sub> - bx<sub>2</sub></span>，结果的合成不确定度为：
            <div style="text-align: center;" class="formula">
                u<sub>y</sub> = √<span class="custom-overline">a² u<sub>x<sub>1</sub></sub>² + b² u<sub>x<sub>2</sub></sub>²</span>
            </div>
        </li>
        <li><strong>乘法或除法：</strong>对于 <span class="formula">y = x<sub>1</sub><sup>a</sup> × x<sub>2</sub><sup>b</sup></span> 或 <span class="formula">y = x<sub>1</sub><sup>a</sup> / x<sub>2</sub><sup>b</sup></span>，结果的相对不确定度为：
            <div style="text-align: center;" class="formula">
                u<sub>y</sub>/y = √<span class="custom-overline">a² (u<sub>x<sub>1</sub></sub>/x<sub>1</sub>)² + b² (u<sub>x<sub>2</sub></sub>/x<sub>2</sub>)²</span>
            </div>
        </li>
        <li>总的来说，就是把微分在不同维度叠加。</li>
    </ul>
    <h2>3. 何时使用不确定度方式保留数字</h2>
    <p>不确定度是用来表示测量结果可能的误差的。凡是误差相关的量，都应按照不确定度方式保留数字。具体可见 <strong>参考：各项参数</strong>。</p>
</div>
<!-- 不确定度视图 -->
<div v-show="isPropertyDoc">
    <h2>斑鸠计算的各项参数的参考公式</h2>
    <ul>
        <li>
            平均值（按有效数字方式保留）
            <br>
            <div style="text-align: center;"  class="formula">
                <span class="overline">x</span> = ∑ x<sub>i</sub> /n
            </div>
        </li>
        <li>
            相对误差（按不确定度方式保留）
            <div style="text-align: center;"  class="formula">
                ε<sub>r,x</sub> = |x - x<sub>theory</sub>| / x<sub>theory</sub>
            </div >
        </li>
        <li>
            平均相对误差（按不确定度方式保留）
            <div style="text-align: center;"  class="formula">
                <span class="overline">ε</span><sub>r,x</sub> = ∑ ε<sub>r,x</sub> / n
            </div >
        </li>
        <li>
            平均值与理论值的相对误差（按不确定度方式保留）
            <div style="text-align: center;"  class="formula">
                Δ<sub>r,x</sub> = |<span class="overline">x</span> - x<sub>theory</sub>| / x<sub>theory</sub>
            </div >
        </li>
        <li>
            相对平均偏差（按不确定度方式保留）
            <div style="text-align: center;"  class="formula">
                <span class="overline">δ</span><sub>r,x</sub> = Σ|x<sub>i</sub> - <span class="overline">x</span>| / n
            </div >
        </li>
        <li>
            标准偏差（按不确定度方式保留）
            <div style="text-align: center;"  class="formula">
                s<sub>x</sub> = √<span class="custom-overline">Σ (x<sub>i</sub> - <span class="overline">x</span>)² / (n - 1)</span>
            </div >
        </li>
        <li>
            相对标准偏差（按不确定度方式保留）
            <div style="text-align: center;"  class="formula">
                s<sub>r,x</sub> = s<sub>x</sub> / <span class="overline">x</span>
            </div >
        </li>
        <li>
            A类不确定度（按不确定度方式保留）
            <div style="text-align: center;"  class="formula">
                u<sub>A,x</sub> = s<sub>x</sub> / √<span class="custom-overline">n</span>
            </div >
        </li>
        <li>
            B类不确定度（按不确定度方式保留）
            <div style="text-align: center;"  class="formula">
                u<sub>B,x</sub> = Δ<sub>equip_x</sub> / √<span class="custom-overline">3</span>
            </div >
        </li>
        <li>
            不确定度（按不确定度方式保留）
            <div style="text-align: center;"  class="formula">
                u<sub>x</sub> = √<span class="custom-overline">u<sub>A,x</sub>² + u<sub>B,x</sub>²</span>
            </div >
        </li>
        <li>
            最小二乘直线（按有效数字方式保留）
            <div style="text-align: center;"  class="formula">
                y = ax + b
                <br>
                <br>
                a = (<span class="overline">x y</span> - <span class="overline">x</span> <span class="overline">y</span>) / (<span class="overline">x²</span> - <span class="overline">x</span><sup> ²</sup>)
                <br>
                <br>
                b = <span class="overline">y</span> - a<span class="overline">x</span>
                <br>
                <br>
                R² = ( ∑ (x<sub>i</sub> - <span class="overline">x</span>)(y<sub>i</sub> - <span class="overline">y</span>) )² / ( ∑ (x<sub>i</sub> - <span class="overline">x</span>)² ∑ (y<sub>i</sub> - <span class="overline">y</span>)² )
            </div >
        </li>
    </ul>
 </div>
 <!-- 参数视图 -->
</template>
<style lang="less" scoped>

.theo-data{
    display: flex;
    justify-content: center;
    width: 50%;
    padding:10px;
}
.indirect-theo-data{
    display: flex;
    justify-content: center;
    width: 100%;
    padding:10px;
}
.equipment{
    display: flex;
    justify-content: center;
    width: 100%;
    padding:10px;
}
.new-data{
    display: flex;
    justify-content: center;
    padding: 10px;
    width: 50%;
}
.card-div{
    padding: 10px;
    width: 100%;
}
:deep(.el-input__inner) {
  text-align: center;
}
.deleteicon:hover{
    color: red;
    cursor: pointer;
}
.clear-btn{
    margin-top: 9px;
    margin-left: -34px;
}
input{
    height: 25px;
}
label{
    margin-top: 8px;
    min-width: 4em;
}
.edit-one{
    display: flex;
}
h1{
    font-weight: bolder;
    font-size: 30px;
    line-height: 150%;
}
h2{
    font-weight: bold;
    font-size: 22px;
    line-height: 125%;
    text-indent: 1em;
}
p{
    line-height: 140%;
    font-size: 18px;
    padding: 5px;
    text-indent: 2em;
}
em{
    font-weight: 550;
}
pre{
    tab-size: 2;
    line-height: 2.4ex;
    overflow: auto;
}
ul {
    margin: 20px 0;
    padding-left: 20px;
}
ul li {
    margin-bottom: 10px;
    line-height: 125%;
}
h2 {
    color: #2c3e50;
    border-bottom: 2px solid #3498db;
    padding-bottom: 10px;
    margin-top: 40px;
}
ul {
    margin: 20px 0;
    padding-left: 20px;
}
ul li {
    margin-bottom: 10px;
}
p {
    margin: 10px 0;
}
strong{
    color: #626aef;
}
sub{
    vertical-align: sub;
    font-size: smaller;
    line-height: 0;
}
sup{
    vertical-align:super ;
    font-size: smaller;
    line-height: 0;
}
.custom-overline {
    display: inline-block;
    border-top: 1.2px solid black; /* 设置线的粗细和颜色 */
    padding-top: 1px; /* 调整上划线与文字的距离 */
}
.formula {
    font-family: 'Times New Roman', serif;
    font-size: 1.2em;
    line-height: 1.4;
}
.overline{
    text-decoration: overline;
}
</style>