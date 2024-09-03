<script setup>
import { useAllDataStore } from '../assets/stores';
import { computed,ref} from 'vue';
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
// const result = computed(()=>{
//     return output.value.split(/,\s*|\s+/)
// })
const graphContent = ref('')
function formatString(input) {
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

    // 处理希腊字母替换
    input = input.replace(/α|β|γ|δ|ε|ζ|η|θ|ι|κ|λ|μ|ν|ξ|ο|π|ρ|σ|τ|υ|φ|χ|ψ|ω|Δ|Θ|Λ|Ξ|Π|Σ|Φ|Ψ|Ω/g, match => greekLetters[match]);

    // 使用正则表达式匹配字母后面直接跟随的数字或逗号隔开的数字
    return input.replace(/([a-zA-Z\\])(\d+(,\d+)*)/g, '$1_{$2}');
}
// 把表格数据的头按LaTeX格式化
const headContent = ref('')
// 表格的选项区
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
const centerContent = computed(()=>{
    let center = ''
    let hlength = 1
    let vlength = 0
    let flag = true
    headContent.value = ''
    for(let i = 0; i<result.value.length;i++){
        let theItem = dataList.value.find(item => item.title === result.value[i] && !(item.type==='indirect'&& item.computeOption === 'forAvg' ) )
        if(theItem && theItem.dataSet.length !== 1){
            if(theItem && flag){
                headContent.value = ''
                flag = false
                center = center+'编号 &'
                hlength = theItem.dataSet.length
                for(let j = 1; j<=theItem.dataSet.length;j++){
                    if(j!== theItem.dataSet.length){
                        center = center + '$'+ String(j) + '$ & '
                    }
                    else{
                        center = center + '$'+ String(j) + '$ \\\\\n\t\t\t'
                    }
                }
                vlength++
            }
            if(theItem){
                center = center+'$'+ formatString(theItem.title) + unitFormat(theItem.unit) + '$ & '
                for(let j=0; j<theItem.dataSet.length;j++){
                    if(j!==theItem.dataSet.length-1){
                        center = center + '$'+formatScientificToLatex(theItem.dataSet[j].rawData)+ '$ & '
                    }
                    else{
                        if(i!== result.value.length-1){
                            center = center + '$'+formatScientificToLatex(theItem.dataSet[j].rawData)+'$ \\\\'
                        }
                        else{
                            center = center + '$'+formatScientificToLatex(theItem.dataSet[j].rawData)+'$'
                            if(dataValues.value && dataValues.value.length >0){
                                center = center + ' \\\\'
                            }
                        }
                    }
                }
                if(i!==result.value.length-1 || (dataValues.value && dataValues.value.length >0)){
                    center = center+'\n\t\t\t'
                }
                vlength++
            }
        }
    }
    if(dataValues.value && dataValues.value.length >0){
        if(!(dataValues.value.length ===1 && typeof dataValues.value[0].data === 'object')){
            headContent.value = ',cell{'
        }
    }
    for(let i = 0; i < dataValues.value.length; i++){
        let datavalue = dataValues.value[i]
        vlength++
        if(typeof datavalue.data === 'object'){
            hlength = datavalue.data.length
            center = center + datavalue.title
            datavalue.data.forEach(metadata =>{
                center = center + ' & '+ metadata
            })
            if(i !== dataValues.value.length -1){
                center = center + ' \\\\\n\t\t\t'
                if(i !== 0){
                    headContent.value = headContent.value + ','
                }
            }
            else{
                if(!(dataValues.value.length ===1 && typeof dataValues.value[0].data === 'object')){
                    headContent.value = headContent.value + `}{2}={r=1,c=${hlength}}{c}`
                }
            }
        }
        else{
            headContent.value = headContent.value + String(vlength)
            if(i !== dataValues.value.length - 1){
                center = center + datavalue.title +' & '+ datavalue.data + ' \\\\' + '\n\t\t\t'
                if(typeof dataValues.value[i+1].data !== 'object'){
                    headContent.value = headContent.value + ','
                }
            }
            else{
                center = center + datavalue.title +' & '+ datavalue.data
                headContent.value = headContent.value + `}{2}={r=1,c=${hlength}}{c}`
            }
        }
    }
    center = center+'\n\t\t'
    return center
})
// 表格的中心内容
const props={
    multiple:true,
    checkStrictly: true,
    emitPath: false, // 如果只希望返回最后一级选项的值
    label:'label',
    value:'value'
}
const optionMap = (name , title, unit)=>{
    let tmpunit = unitFormat(unit)
    if(name === '平均值'){
        return `$\\overline{${formatString(title)}}`+tmpunit+'$'
    }
    if(name === '实验值'){
        return `$${formatString(title)}`+tmpunit+'$'
    }
    if(name === '相对平均偏差'){
        return `$\\overline{\\delta}_{r,${formatString(title)}}$`
    }
    if(name === '标准偏差'){
        return `$s_{${formatString(title)}}`+tmpunit+'$'
    }
    if(name === '相对标准偏差'){
        return `$s_{r,${formatString(title)}}$`
    }
    if(name === 'A类不确定度'){
        return `$u_{A,${formatString(title)}}`+tmpunit+'$'
    }
    if(name === `B类不确定度`){
        return `$u_{B,${formatString(title)}}`+tmpunit+'$'
    }
    if(name === `不确定度`){
        return `$u_{${formatString(title)}}`+tmpunit+'$'
    }
    if(name === '平均相对误差'){
        return `$\\overline{\\varepsilon}_{r,${formatString(title)}}$`
    }
    if(name === '平均值与理论值的相对误差'){
        return `$\\Delta_{r,${formatString(title)}}$`
    }
    if(name === '理论值'){
        return `$${formatString(title)}_{\\text{theory}}`+tmpunit+'$'
    }
    if(name === '相对误差'){
        return `$\\varepsilon_{r,${formatString(title)}}$`
    }
}
// 表格中的非运算数据
const dataOptions = computed(()=>{
    let tmpDataOptions = []
    for(let i = 0; i<dataList.value.length; i++){
        let theItem = dataList.value[i]
        let unit = theItem.unit
        let tmp = {}
        tmp.label = theItem.title
        if(theItem.dataSet.length === 1){
            tmp.value = {
                title:`$${formatString(theItem.title)}`+unitFormat(unit)+'$',
                data:'$'+formatScientificToLatex(theItem.dataSet[0].rawData)+'$'
            }
        }
        else{
            tmp.value = theItem.title
        }
        tmp.children=[]
        if(theItem.theoData && theItem.theoData !== '0'){
            tmp.children.push({
                value:{title:optionMap('理论值',theItem.title,unit),data:'$'+formatScientificToLatex(theItem.theoData)+'$'},
                label:'理论值'
            })
            let tmpdata = []
            theItem.dataSet.forEach(item=>{
                if(item.relErr){
                    tmpdata.push('$'+item.relErr.replace(/%/g, '\\%')+'$')
                }
            })
            tmp.children.push({
                value:{title:optionMap('相对误差',theItem.title,unit),data:tmpdata},
                label:'相对误差'
            })
        }
        theItem.analysis.forEach(ana => {
            if(ana.propertyValue !== '' && ana.propertyValue !== '0'){
                let tmpChild = {
                    value:{
                        title:optionMap(ana.propertyName,theItem.title,unit)
                    },
                    label:ana.propertyName
                }
                if(ana.propertyName === '相对平均偏差' || ana.propertyName === '相对标准偏差' || ana.propertyName === '平均相对误差' || ana.propertyName === '平均值与理论值的相对误差'){
                    tmpChild.value.data = ana.propertyValue.replace(/%/g, '\\%')
                }
                else{
                    tmpChild.value.data = ana.propertyValue
                }
                tmpChild.value.data = '$'+formatScientificToLatex(tmpChild.value.data)+'$'
                tmp.children.push(tmpChild)
            }
        })
        if(theItem.moreUncer.bUncer && theItem.moreUncer.bUncer !== '0'){
            tmp.children.push({
                value:{title:optionMap('B类不确定度',theItem.title,unit),data:'$'+formatScientificToLatex(theItem.moreUncer.bUncer)+'$'},
                label:'B类不确定度'
            })
        }
        if(theItem.moreUncer.wholeUncer && theItem.moreUncer.wholeUncer !== '0'){
            tmp.children.push({
                value:{title:optionMap('不确定度',theItem.title,unit),data:'$'+formatScientificToLatex(theItem.moreUncer.wholeUncer)+'$'},
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
                tmp.push(item)
            }
        })
    }
    return tmp
})
const code = computed(()=>{
    return '\\begin{table}[H]\n\t\\framed[标题]{\n\t\t\\begin{tblr}{hlines,vlines,cells={c}'+headContent.value+'}\n\t\t\t'+centerContent.value+'\\end{tblr}\n\t}\n\\end{table}'
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
        graphContent.value = `\\begin{figure}[H]\n\t\\framed[标题]{\n\t\t\\begin{plot}{\\xstyle{$${formatString(xData.value)}`+unitFormat(x.unit)+`$}\\ystyle{$${formatString(yData.value)}`+unitFormat(y.unit)+`$}}\n\t\t\t\\datapoint[no markers]{` + center2 +'}[拟合直线]\n\t\t\t\\datapoint[only marks]{'+center1+'}[实验数据]\n\t\t\\end{plot}\n\t}[$y='+formatScientificToLatex(graphData.value.slope)+'x'+(graphData.value.intercept[0]==='-'?'':'+')+formatScientificToLatex(graphData.value.intercept)+'\\qquad R^2='+formatScientificToLatex(graphData.value.rSquared)+'$]'+'\n\\end{figure}'
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
        graphContent.value = `\\begin{figure}[H]\n\t\\framed[标题]{\n\t\t\\begin{plot}{\\xstyle{$${formatString(xData.value)}`+unitFormat(x.unit)+`$}\\ystyle{$${formatString(yData.value)}`+unitFormat(y.unit)+`$}}\n\t\t\t\\addplot[no markers,domain=`+String(xMin)+':'+String(xMax)+']{' + center2 +'};\n\t\t\t\\addlegendentry{拟合曲线}\n\t\t\t\\datapoint[only marks]{'+center1+'}[实验数据]\n\t\t\\end{plot}\n\t}[$y='+formatScientificToLatex(graphData.value.a) + 'x^2' + (graphData.value.b[0]==='-'?'':'+')+formatScientificToLatex(graphData.value.b)+'x'+(graphData.value.c[0]==='-'?'':'+')+formatScientificToLatex(graphData.value.c)+'\\qquad R^2='+formatScientificToLatex(graphData.value.rSquared)+'$]'+'\n\\end{figure}'
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
        graphContent.value = `\\begin{figure}[H]\n\t\\framed[标题]{\n\t\t\\begin{plot}{\\xstyle{$${formatString(xData.value)}`+unitFormat(x.unit)+`$}\\ystyle{$${formatString(yData.value)}`+unitFormat(y.unit)+`$}}\n\t\t\t`+'\\datapoint{'+center1+'}[图例]\n\t\t\\end{plot}\n\t}'+'\n\\end{figure}'
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
        graphContent.value = `\\begin{figure}[H]\n\t\\framed[标题]{\n\t\t\\begin{plot}{\\xstyle{$${formatString(xData.value)}`+unitFormat(x.unit)+`$}\\ystyle{$${formatString(yData.value)}`+unitFormat(y.unit)+`$}}\n\t\t\t`+'\\datapoint[smooth]{'+center1+'}[图例]\n\t\t\\end{plot}\n\t}'+'\n\\end{figure}'
    }
}
const handleUncerEdit = ()=>{
    store.refresh()
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
        </el-card>
    </div>
</div>
<!-- 直接数据的编辑卡片 -->
<div class="card-div" v-if="selectedDataIndex >= 0 ? dataList[selectedDataIndex].type === 'indirect' : false">
    <el-card shadow="hover">
        <div class="equipment">
            <label style="font-weight: 550;width: 10%;text-align: center;">计算方式</label>
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
    </el-card>
</div>
<!-- 间接数据的编辑卡片 -->
<div class="card-div" v-if="selectedDataIndex >= 0">
    <el-card shadow="hover">
        <div class="equipment">
            <label style="font-weight: 550;width: 20%;text-align: left;">单位</label>
            <input style="text-align: center;width: 80%;" placeholder="选填，仅对LaTeX制表/图有影响" v-model="dataList[selectedDataIndex].unit">
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
            :data="selectedDataIndex >= 0 ? dataList[selectedDataIndex].analysis : []"
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
        <div class="equipment" v-show="dataList[selectedDataIndex].moreUncer.equipUncer !== ''">
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
                <el-select
                    style="width: 10%;text-align: center;min-width: 5.5em"
                    v-model="xData"
                >
                    <el-option v-for="title in titleList" :key="title.value" :label="title.label" :value="title.value"></el-option>
                </el-select>
                <span style="width: 5%;"></span>
                <label style="font-weight: 550;width: 10%;text-align: center;">y轴数据</label>
                <el-select
                    style="width: 10%;text-align: center;min-width: 5.5em"
                    v-model="yData"
                >
                    <el-option v-for="title in titleList" :key="title.value" :label="title.label" :value="title.value"></el-option>
                </el-select>
                <span style="width: 5%;"></span>
                <label style="font-weight: 550;width: 10%;text-align: center;">制图方法</label>
                <el-select
                    style="width: 10%;text-align: center;min-width: 5.5em"
                    v-model="graphOption"
                >
                    <el-option v-for="option in graphOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
                </el-select>
                <span style="width: 5%;"></span>
                <el-button @click="handleGraphUpdate" style="width: 10%;">刷新</el-button>
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
    <p>直接数据默认是精度相同的数据集。因此，输入时<em>允许省略末尾的零</em>（只要有一个数据末尾不为0）</p>
    <p>在新数据处输入数据并回车即可添加数据了，各类信息会随着数据的输入自动更新。</p>
    <p>单位只会影响LaTeX制作图表，不参与计算。斑鸠会自动处理 *，/ 和数字上标，也包括 μ，°，℃ 这几个不常见字符。</p>
    <p>单位示例：kg*m/s2</p>
    <h2>间接数据</h2>
    <p>间接数据通过直接数据计算得到。可以在待填处填入计算式，支持 +，-，*，/，() 运算符与 ln() 函数，sqrt() 函数。使用直接数据前，需要在侧栏处为直接数据<em>命名(不接受中文命名与带 ; 号的命名)</em>。如果命名成数字，运算时会<em>识别成数字</em>而非数据集，所以不要这么做。同样地，为避免混淆，<em>不要取名为 ln 或 sqrt。</em></p>
    <p><em>tips:字母后的数字会自动识别成下标，所以 a1，甚至 b1,2 都是合法的命名。</em></p>
    <p>示例：有直接数据a，b，c，d，可写计算式(a+b)*c/d/9.8。</p>
    <p>需要注意的是，直接在运算式中输入数字，处理器会默认该数据是<em>精准数据</em>，<em>不会考虑</em>它的有效数字。如果你需要考虑它的有效数字，请把它<em>作为直接数据</em>输入。一般情况下，还是建议在直接数据处取一个合适的等价数据，毕竟“不考虑有效数字”的效果并不保证合理。</p>
    <p>确定计算方式和计算式后，<em>点击刷新</em>，即可获得最新的间接数据。</p>
    <p>斑鸠会自动根据计算式求出间接数据的不确定度。请确保依赖的直接数据的不确定度正确。</p>
    <h2>LaTeX制表</h2>
    <p>选择表格数据，会自动生成对应表格的LaTeX代码。</p>
    <p>LaTeX代码的依赖同时包含制表和制图的依赖。因此，<em>只需复制一次</em>即可。</p>
    <h2>LaTeX制图</h2>
    <p>为数据命名后，即可通过选择数据与制图方法获得LaTeX代码。在这里，依赖的内容与LaTeX制表处相同。</p>
    <p>选择好数据后，<em>点击刷新</em>，即可获得最新的代码。</p>
    <h2>参考</h2>
    <p>时有忘记各种计算方法的时候，所以留了三个参考，方便查阅。</p>
</div>
  <!-- readme视图 -->
<div v-show="isOutput">
    <div class="card-div">
        <el-card shadow="hover">
            <div class="equipment">
                <label style="font-weight: 550;width: 11%;text-align: center;">表格数据</label>
                <span style="width: 4%;"></span>
                <el-cascader
                    :options="dataOptions"
                    :props="props"
                    placeholder="选择数据"
                    v-model="dataValuesSource"
                    style="width: 85%;"
                >
                </el-cascader>
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
            <center class="formula">
                u<sub>y</sub> = √<span class="custom-overline">a² u<sub>x<sub>1</sub></sub>² + b² u<sub>x<sub>2</sub></sub>²</span>
            </center>
        </li>
        <li><strong>乘法或除法：</strong>对于 <span class="formula">y = x<sub>1</sub><sup>a</sup> × x<sub>2</sub><sup>b</sup></span> 或 <span class="formula">y = x<sub>1</sub><sup>a</sup> / x<sub>2</sub><sup>b</sup></span>，结果的相对不确定度为：
            <center class="formula">
                u<sub>y</sub>/y = √<span class="custom-overline">a² (u<sub>x<sub>1</sub></sub>/x<sub>1</sub>)² + b² (u<sub>x<sub>2</sub></sub>/x<sub>2</sub>)²</span>
            </center>
        </li>
        <li>总的来说，就是把微分在不同维度叠加。</li>
    </ul>
</div>
<!-- 不确定度视图 -->
<div v-show="isPropertyDoc">
    <h2>斑鸠计算的各项参数的参考公式</h2>
    <ul>
        <li>
            平均值（按有效数字方式保留）
            <br>
            <center class="formula">
                <span class="overline">x</span> = ∑ x<sub>i</sub> /n
            </center>
        </li>
        <li>
            相对误差（按不确定度方式保留）
            <center class="formula">
                ε<sub>r,x</sub> = |x - x<sub>theory</sub>| / x<sub>theory</sub>
            </center>
        </li>
        <li>
            平均相对误差（按不确定度方式保留）
            <center class="formula">
                <span class="overline">ε</span><sub>r,x</sub> = ∑ ε<sub>r,x</sub> / n
            </center>
        </li>
        <li>
            平均值与理论值的相对误差（按不确定度方式保留）
            <center class="formula">
                Δ<sub>r,x</sub> = |<span class="overline">x</span> - x<sub>theory</sub>| / x<sub>theory</sub>
            </center>
        </li>
        <li>
            相对平均偏差（按不确定度方式保留）
            <center class="formula">
                <span class="overline">δ</span><sub>r,x</sub> = Σ|x<sub>i</sub> - <span class="overline">x</span>| / n
            </center>
        </li>
        <li>
            标准偏差（按不确定度方式保留）
            <center class="formula">
                s<sub>x</sub> = √<span class="custom-overline">Σ (x<sub>i</sub> - <span class="overline">x</span>)² / (n - 1)</span>
            </center>
        </li>
        <li>
            相对标准偏差（按不确定度方式保留）
            <center class="formula">
                s<sub>r,x</sub> = s<sub>x</sub> / <span class="overline">x</span>
            </center>
        </li>
        <li>
            A类不确定度（按不确定度方式保留）
            <center class="formula">
                u<sub>A,x</sub> = s<sub>x</sub> / √<span class="custom-overline">n</span>
            </center>
        </li>
        <li>
            B类不确定度（按不确定度方式保留）
            <center class="formula">
                u<sub>B,x</sub> = Δ<sub>equip_x</sub> / √<span class="custom-overline">3</span>
            </center>
        </li>
        <li>
            不确定度（按不确定度方式保留）
            <center class="formula">
                u<sub>x</sub> = √<span class="custom-overline">u<sub>A,x</sub>² + u<sub>B,x</sub>²</span>
            </center>
        </li>
        <li>
            最小二乘直线（按有效数字方式保留）
            <center class="formula">
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
            </center>
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