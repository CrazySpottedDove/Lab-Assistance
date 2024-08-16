<script setup>
import { useAllDataStore } from '../assets/stores';
import { computed,ref } from 'vue';
import { CircleClose } from '@element-plus/icons-vue';
//import { ElMessage } from 'element-plus';
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
const output = ref('')
const handleOutputAnew = ()=>{
    output.value = ''
}
const rely =
`\\documentclass{ctexart}
\\usepackage{geometry}
\\usepackage{amsmath}
\\usepackage{bm}
\\geometry{left=1cm,right=1cm,top=1cm,bottom=1cm}
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
const result = computed(()=>{
    return output.value.split(/,\s*|\s+/)
})
const graphContent = ref('')
function formatString(input) {
    // 使用正则表达式匹配字母后面直接跟随的数字
    var formatted = input.replace(/([a-zA-Z])(\d+)/g, '$1_{$2}');

    // 在字符串两边添加 $ 符号
    return `$${formatted}$`;
}

const centerContent = computed(()=>{
    let center = '组数 & '
    for(let i = 0; i<result.value.length;i++){
        let theItem = dataList.value.find(item => item.title === result.value[i])
        if(theItem && i === 0){
            for(let i = 1; i<=theItem.dataSet.length;i++){
                if(i!== theItem.dataSet.length){
                    center = center + String(i) + ' & '
                }
                else{
                    center = center + String(i)+' \\\\\n\t\t\t'
                }
            }
        }
        if(theItem){
            center = center+formatString(theItem.title)+' & '
            for(let j=0; j<theItem.dataSet.length;j++){
                if(j!==theItem.dataSet.length-1){
                    center = center + theItem.dataSet[j].rawData+' & '
                }
                else{
                    if(i!== result.length-1){
                        center = center + theItem.dataSet[j].rawData+' \\\\'
                    }
                    else{
                        center = center + theItem.dataSet[j].rawData
                    }
                }
            }
            if(i!==result.value.length-1){
                center = center+'\n\t\t\t'
            }
            else{
                center = center+'\n\t\t'
            }
        }
    }
    return center
})
const code = computed(()=>{
    return '\\begin{table}[H]\n\t\\framed[标题]{\n\t\t\\begin{tblr}{hlines,vlines,cells={c}}\n\t\t\t'+centerContent.value+'\\end{tblr}\n\t}\n\\end{table}'
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
    } else {
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
        graphContent.value = `\\begin{figure}[H]\n\t\\framed[标题]{\n\t\t\\begin{plot}{\\xstyle{${formatString(xData.value)}}\\ystyle{${formatString(yData.value)}}}\n\t\t\t\\datapoint[no markers]{` + center2 +'}[拟合直线]\n\t\t\t\\datapoint[only marks]{'+center1+'}[实验数据]\n\t\t\\end{plot}\n\t}[$y='+formatScientificToLatex(graphData.value.slope)+'x'+(graphData.value.intercept[0]==='-'?'':'+')+formatScientificToLatex(graphData.value.intercept)+'\\qquad R^2='+formatScientificToLatex(graphData.value.rSquared)+'$]'+'\n\\end{figure}'
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
        graphContent.value = `\\begin{figure}[H]\n\t\\framed[标题]{\n\t\t\\begin{plot}{\\xstyle{${formatString(xData.value)}}\\ystyle{${formatString(yData.value)}}}\n\t\t\t\\addplot[no markers,domain=`+String(xMin)+':'+String(xMax)+']{' + center2 +'};\n\t\t\t\\addlegendentry{拟合曲线}\n\t\t\t\\datapoint[only marks]{'+center1+'}[实验数据]\n\t\t\\end{plot}\n\t}[$y='+formatScientificToLatex(graphData.value.a) + 'x^2' + (graphData.value.b[0]==='-'?'':'+')+formatScientificToLatex(graphData.value.b)+'x'+(graphData.value.c[0]==='-'?'':'+')+formatScientificToLatex(graphData.value.c)+'\\qquad R^2='+formatScientificToLatex(graphData.value.rSquared)+'$]'+'\n\\end{figure}'
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
        graphContent.value = `\\begin{figure}[H]\n\t\\framed[标题]{\n\t\t\\begin{plot}{\\xstyle{${formatString(xData.value)}}\\ystyle{${formatString(yData.value)}}}\n\t\t\t`+'\\datapoint{'+center1+'}[图例]\n\t\t\\end{plot}\n\t}'+'\n\\end{figure}'
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
        graphContent.value = `\\begin{figure}[H]\n\t\\framed[标题]{\n\t\t\\begin{plot}{\\xstyle{${formatString(xData.value)}}\\ystyle{${formatString(yData.value)}}}\n\t\t\t`+'\\datapoint[smooth]{'+center1+'}[图例]\n\t\t\\end{plot}\n\t}'+'\n\\end{figure}'
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
<!-- 最小二乘直线视图 -->
<div v-show="isReadme">
    <h1>数据管理</h1>
    <h2>直接数据</h2>
    <p>直接数据默认是精度相同的数据集。因此，输入时<em>允许省略末尾的零</em>（只要有一个数据末尾不为0）</p>
    <p>在新数据处输入数据并回车即可添加数据了，各类信息会随着数据的输入自动更新。</p>
    <h2>间接数据</h2>
    <p>间接数据通过直接数据计算得到。可以在待填处填入计算式，支持+,-,*,/,(),运算符与ln()函数。使用直接数据前，需要在侧栏处为直接数据<em>命名(不接受中文命名与带'号的命名)</em>。如果命名成数字，运算时会<em>识别成数字</em>而非数据集，所以不要这么做。同样地，为避免混淆，<em>不要取名为ln。</em></p>
    <p>示例：有直接数据a，b，c，d，可写计算式(a+b)*c/d/9.8。</p>
    <p>需要注意的是，直接在运算式中输入数字，处理器会默认该数据是<em>精准数据</em>，<em>不会考虑</em>它的有效数字。如果你需要考虑它的有效数字，请把它<em>作为直接数据</em>输入。</p>
    <p>确定计算方式和计算式后，<em>点击刷新</em>，即可获得最新的间接数据。</p>
    <p>处理器会自动根据计算式求出间接数据的不确定度。请确保依赖的直接数据的不确定度正确。</p>
    <h1>LaTeX制表</h1>
    <p>可以通过在输入框输入数据名的方式获得LaTeX表格代码。数据名可以用<em>逗号</em>或<em>空格</em>分隔。</p>
    <p>LaTeX代码的依赖同时包含制表和制图的依赖。因此，<em>只需复制一次</em>即可。</p>
    <p>不要在制表的输入框内<em>写算式</em>！需要计算的内容应在间接数据处计算。</p>
    <h1>LaTeX制图</h1>
    <p>为数据命名后，即可通过选择数据与制图方法获得LaTeX代码。在这里，依赖的内容与LaTeX制表处相同。</p>
    <p>选择好数据后，<em>点击刷新</em>，即可获得最新的代码。</p>
</div>
  <!-- readme视图 -->
<div v-show="isOutput">
    <div class="card-div">
        <el-card shadow="hover">
            <div class="equipment">
                <label style="font-weight: 550;width: 10%;text-align: center;">表格数据</label>
                <span style="width: 1%;"></span>
                <input style="text-align: center;width: 64%;" placeholder="示例: a,b,c 或 a b c" v-model="output">
                <span style="width: 1%;"></span>
                <el-button style="width: 14%;" @click="handleOutputAnew">重置</el-button>
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
<!-- 导出为LaTeX视图 -->
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
    line-height: 175%;
}
h2{
    font-weight: bold;
    font-size: 25px;
    line-height: 150%;
    text-indent: 1em;
}
p{
    line-height: 140%;
    font-size: 20px;
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
</style>