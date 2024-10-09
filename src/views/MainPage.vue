<script setup>
import { useAllDataStore } from '../assets/stores';
import { computed, ref, nextTick} from 'vue';
import { CircleClose,FirstAidKit,DocumentCopy } from '@element-plus/icons-vue';

//Don't import { ElMessage } from 'element-plus'!
const store = useAllDataStore()
const dataList = computed(()=>store.state.dataList)
const tableList = computed(() => store.state.tableList)
const graphList = computed(() => store.state.graphList)
const selectedDataIndex = computed(()=>store.state.selectedDataIndex)
const selectedTableIndex = computed(()=>store.state.selectedTableIndex)
const selectedGraphIndex = computed(()=>store.state.selectedGraphIndex)
const isReadme = computed(()=>store.state.isReadme)
const isNumberDoc = computed(()=>store.state.isNumberDoc)
const isUncerDoc = computed(()=>store.state.isUncerDoc)
const isPropertyDoc = computed(()=>store.state.isPropertyDoc)
// 基本参数
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
const tableOneColumns = computed(()=>{
    return selectedDataIndex.value >= 0 ? (dataList.value[selectedDataIndex.value].theoData === undefined || dataList.value[selectedDataIndex.value].theoData === ''? [{label:dataList.value[selectedDataIndex.value].title , prop:'rawData'}] : [{label:dataList.value[selectedDataIndex.value].title, prop:'rawData'},{label:'相对误差',prop:'relErr'}]) : []
})
const inputRefs = ref([])
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
}
const chinese = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]+/g
const rely =
`\\usepackage{amsmath}
\\usepackage{bm}
\\usepackage{float}
\\usepackage{upgreek}
\\usepackage{tabularray}
\\usepackage{calc}
\\usepackage{etoolbox}
\\providecommand{\\Romannumeral}[1]{\\uppercase\\expandafter{\\romannumeral #1}}
\\NewDocumentCommand{\\cmplen}{mmmO{}}{%
    \\ifdim #1>#2%
        #3%
    \\else%
        #4%
    \\fi%
}
\\newlength{\\labtmplen}
\\NewDocumentCommand{\\framed}{omo}{%
    \\setlength{\\labtmplen}{\\widthof{#2}}%
	\\framebox[\\labtmplen+4em]{
		\\begin{minipage}{\\labtmplen+2em}
			\\quad\\\\[2ex]
			\\centering #2
			\\IfNoValueF{#1}{\\caption{#1}}\\IfNoValueF{#3}{\\IfNoValueTF{#1}{\\quad\\\\[2ex]\\em #3}{\\quad\\\\[-2ex]\\em #3}}
		\\end{minipage}
	}
}
\\NewDocumentCommand{\\notframed}{omo}{%
    \\setlength{\\labtmplen}{\\widthof{#2}}%
    \\begin{center}
        \\cmplen{\\labtmplen}{.94\\textwidth}{\\resizebox{.94\\textwidth}{!}{#2}}[#2]%
        \\IfNoValueF{#1}{\\caption{#1}}\\IfNoValueF{#3}{\\IfNoValueTF{#1}{\\quad\\\\[2ex]\\em #3}{\\quad\\\\[-2ex]\\em #3}}
    \\end{center}
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
\\newcounter{funcstyle}
\\NewDocumentEnvironment{plot}{mos}{
	#1%
	\\begin{tikzpicture}
		\\setcounter{markstyle}{0}
		\\setcounter{funcstyle}{0}
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
		\\addplot[mark=square*,solid,green,#1] coordinates {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{markstyle}
	\\or
		\\addplot[mark=diamond*,solid,red,#1] coordinates {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{markstyle}
	\\or
		\\addplot[mark=triangle*,solid,blue,#1] coordinates {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{markstyle}
	\\or
		\\addplot[mark=cross,solid,yellow,#1] coordinates {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{markstyle}
	\\fi
}
\\NewDocumentCommand{\\functionline}{mmo}{
	\\ifcase\\value{funcstyle}
		\\addplot[solid,black,no markers, domain=#1] {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{funcstyle}
	\\or
		\\addplot[solid,green,no markers, domain=#1] {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{funcstyle}
	\\or
		\\addplot[solid,red,no markers, domain=#1] {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{funcstyle}
	\\or
		\\addplot[solid,blue,no markers, domain=#1] {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{funcstyle}
	\\or
		\\addplot[solid,yellow,no markers,domain=#1] {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{funcstyle}
	\\fi
}`

const handleChange = () => {
    store.refresh()
}
const dataInput = ref('')
const handleAddRawData = ()=>{
    dataList.value[selectedDataIndex.value].dataSet.push({rawData:dataInput.value})
    dataInput.value = ''
    store.refresh()
}
const handleInsertRawData = (index) => {
    dataList.value[selectedDataIndex.value].dataSet.splice(index,0,{rawData:'',})
    nextTick(() => {
        // 在下一次 DOM 更新后，聚焦到新插入的输入框
        const inputToFocus = inputRefs.value[index]
        if (inputToFocus && inputToFocus.$el) {
            inputToFocus.$el.querySelector('input').focus()
        }
    })
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
const titleFormat = (input) => {
    if (!input) {
        return ''
    }
    let tmplen = input.length

    // 处理希腊字母替换
    input = input.replace(/α|β|γ|δ|ε|ζ|η|θ|ι|κ|λ|μ|ν|ξ|ο|π|ρ|σ|τ|υ|φ|χ|ψ|ω|Δ|Θ|Λ|Ξ|Π|Σ|Φ|Ψ|Ω/g, match => greekLetters[match])

    if(tmplen >= 4 && input.indexOf('\\') === -1){
        return `\\text{${input}}`
    }

    input = input.replace(chinese, (match) => `\\text{${match}} `)

    // 使用正则表达式匹配字母后面直接跟随的数字或逗号隔开的数字
    return input.replace(/([a-zA-Z\\]+)\s*(\d+(,\d+)*)/g, '$1_{$2}')
}
const unitFormat = ((str) => {
    if (str === '') {
        return str
    }
    // 替换常见符号
    str = str.replace(/μ/g, '\\upmu ')
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
const commentFormat = (str) => {
    if (str === '') {
        return str
    }

    // 使用titleFormat处理所有变量名
    dataList.value.forEach(item => {
        const regex = new RegExp(`${item.title}`,'g')
        str = str.replace(regex, `${titleFormat(item.title)}`)
    })

    function processAbs(str) {
        // 定义一个正则表达式来查找 'sqrt', 'ln', 'lg', 'abs'
        const functionRegex = /abs/g;
        let result = '';
        let lastIndex = 0;
        let match
        // 查找所有的 'sqrt', 'ln', 'lg', 'abs'
        while ((match = functionRegex.exec(str)) !== null) {
            result += str.slice(lastIndex, match.index); // 不添加 'abs'
            lastIndex = match.index + match[0].length; // 更新 lastIndex 跳过当前匹配

            // 找到函数名后面必须是括号，检查括号匹配
            if (str[lastIndex] === '(') {
                let stack = [];
                let firstParenIndex = lastIndex;
                let lastParenIndex = null;

                // 用来追踪括号匹配
                for (let i = lastIndex; i < str.length; i++) {
                    if (str[i] === '(') {
                        stack.push(i);
                    } else if (str[i] === ')') {
                        lastParenIndex = i;
                        stack.pop();
                        if (stack.length === 0) {
                            // 匹配到完整的括号
                            lastIndex = i + 1;
                            break;
                        }
                    }
                }

                // 替换最开始的 '(' 和最后的 ')'，根据不同函数做不同的替换
                if (lastParenIndex !== null) {
                    result += '\\left|@' + str.slice(firstParenIndex + 1, lastParenIndex) + '#\\right|';
                }
                else {
                    // 如果没有匹配到完整的括号，直接添加剩下的内容
                    result += str.slice(firstParenIndex);
                }
            }
        }

        // 把剩下的字符串部分加到 result 中
        result += str.slice(lastIndex);
        return result;
    }
    function processMathFunctions(str,target, left, right) {
        const functionRegex = new RegExp(target, 'g');
        let result = '';
        let lastIndex = 0;
        let match
        while ((match = functionRegex.exec(str)) !== null) {
            result += str.slice(lastIndex, match.index) + '\\' + match[0];
            lastIndex = match.index + match[0].length; // 更新 lastIndex 跳过当前匹配
            // 找到函数名后面必须是括号，检查括号匹配
            if (str[lastIndex] === '(') {
                let stack = [];
                let firstParenIndex = lastIndex;
                let lastParenIndex = null;

                // 用来追踪括号匹配
                for (let i = lastIndex; i < str.length; i++) {
                    if (str[i] === '(') {
                        stack.push(i);
                    } else if (str[i] === ')') {
                        lastParenIndex = i;
                        stack.pop();
                        if (stack.length === 0) {
                            // 匹配到完整的括号
                            lastIndex = i + 1;
                            break;
                        }
                    }
                }

                // 替换最开始的 '(' 和最后的 ')'
                if (lastParenIndex !== null) {
                    result += left + str.slice(firstParenIndex + 1, lastParenIndex) + right
                }
                else {
                    // 如果没有匹配到完整的括号，直接添加剩下的内容
                    result += str.slice(firstParenIndex);
                }
            }
        }

        // 把剩下的字符串部分加到 result 中
        result += str.slice(lastIndex);
        return result;
    }
    function processPow(str) {
        let result = '';
        let lastIndex = 0;
        const operatorstr = '+-*/^'
        // 扫描字符串
        for (let i = 0; i < str.length; i++) {
            if (str[i] === '^') {
                let currentIndex = i
                let leftScanIndex = currentIndex - 1;
                let leftInsertStart = currentIndex - 1; // 记录插入位置
                let leftParenStack = [];
                let leftOperatorStack = []
                // 查找左侧的匹配
                let leftFlag1 = false
                // 确定了匹配方式
                let leftFlag2 = false
                // 确定了哪种匹配方式
                while (leftScanIndex >= 0) {
                    const char = str[leftScanIndex]
                    if (!leftFlag1) {
                        if (char === ' ') {
                            leftInsertStart--
                            leftScanIndex--
                        }
                        else if (char === '(') {
                            leftParenStack.push(leftScanIndex)
                            leftFlag1 = true
                            leftFlag2 = true
                            leftScanIndex--
                        }
                        else {
                            leftFlag1 = true
                            leftFlag2 = false
                            leftScanIndex--
                        }
                    }
                    else {
                        if (leftFlag2) {
                            if (char === ')') {
                                leftParenStack.push(leftScanIndex)
                            }
                            else if (char === '(') {
                                if (leftParenStack.length > 1) {
                                    leftParenStack.pop()
                                }
                                else {
                                    // 找到最左边的 '('，替换
                                    result += str.slice(lastIndex, leftScanIndex)
                                    result += '{@'
                                    result += str.slice(leftScanIndex + 1, leftInsertStart)
                                    result += '#}'
                                    break;
                                }
                            }
                            leftScanIndex--
                        }
                        else {
                            if(char === '#'){
                                leftOperatorStack.push('#')
                                leftScanIndex--
                            }
                            else if(char === '@'){
                                if(leftOperatorStack.length === 0){
                                    result += str.slice(lastIndex, leftScanIndex + 1)
                                    result += '{@'
                                    result += str.slice(leftScanIndex + 1, leftInsertStart + 1)
                                    result += '#}'
                                    break
                                }
                                else{
                                    leftOperatorStack.pop()
                                    leftScanIndex--
                                }
                            }
                            else if(char === ')'){
                                leftParenStack.push(')')
                                leftScanIndex--
                            }
                            else if(char === '('){
                                if(leftParenStack.length === 0){
                                    result += str.slice(lastIndex, leftScanIndex + 1)
                                    result += '{@'
                                    result += str.slice(leftScanIndex + 1, leftInsertStart + 1)
                                    result += '#}'
                                    break
                                }
                                else{
                                    leftParenStack.pop()
                                    leftScanIndex--
                                }
                            }
                            else if (operatorstr.indexOf(char) === -1) {
                                leftScanIndex--
                                if (leftScanIndex === -1) {
                                    result += '{@'
                                    result += str.slice(0, leftInsertStart + 1)
                                    result += '#}'
                                    break
                                }
                            }
                            else {
                                result += str.slice(lastIndex, leftScanIndex + 1)
                                result += '{@'
                                result += str.slice(leftScanIndex + 1, leftInsertStart + 1)
                                result += '#}'
                                break
                            }
                        }
                    }
                }

                // 添加 POW
                result += 'POW';

                // 向右扫描
                let rightScanIndex = currentIndex + 1;
                let rightInsertStart = currentIndex + 1; // 记录插入位置
                let rightFlag1 = false
                let rightFlag2 = false
                let rightParenStack = [];
                let rightOperatorStack = []
                // 查找右侧的匹配
                while (rightScanIndex < str.length) {
                    const char = str[rightScanIndex];
                    if (!rightFlag1) {
                        if (char === ' ') {
                            rightScanIndex++
                            rightInsertStart++
                        }
                        else if (char === '(') {
                            rightParenStack.push(rightScanIndex)
                            rightScanIndex++
                            rightFlag1 = true
                            rightFlag2 = true
                        }
                        else {
                            rightScanIndex++
                            rightFlag1 = true
                            rightFlag2 = false
                        }
                    }
                    else {
                        if (rightFlag2) {
                            if (char === '(') {
                                rightParenStack.push(rightScanIndex);
                            }
                            else if (char === ')') {
                                if (rightParenStack.length > 1) {
                                    rightParenStack.pop();
                                }
                                else {
                                    // 找到最右边的 ')'
                                    result += '{@' + str.slice(rightInsertStart + 1, rightScanIndex) + '#}';
                                    lastIndex = rightScanIndex + 1; // 更新 lastIndex
                                    break;
                                }
                            }
                            rightScanIndex++
                        }
                        else {
                            if(char === '@'){
                                rightOperatorStack.push('@')
                                rightScanIndex++
                            }
                            else if(char === '#'){
                                if(rightOperatorStack.length === 0){
                                    result += '{@' + str.slice(rightInsertStart, rightScanIndex) + '#}';
                                    lastIndex = rightScanIndex  // 更新 lastIndex
                                    break
                                }
                                else{
                                    rightScanIndex++
                                    rightOperatorStack.pop()
                                }
                            }
                            else if (char === '(') {
                                leftParenStack.push('(')
                                leftScanIndex--
                            }
                            else if (char === ')') {
                                if (leftParenStack.length === 0) {
                                    result += '{@' + str.slice(rightInsertStart, rightScanIndex) + '#}';
                                    lastIndex = rightScanIndex  // 更新 lastIndex
                                    break
                                }
                                else {
                                    rightScanIndex++
                                    rightOperatorStack.pop()
                                }
                            }
                            else if (operatorstr.indexOf(char) === -1) {
                                rightScanIndex++
                                if (rightScanIndex === str.length) {
                                    result += '{@' + str.slice(rightInsertStart, str.length) + '#}'
                                    break
                                }
                            }
                            else {
                                result += '{@' + str.slice(rightInsertStart, rightScanIndex) + '#}';
                                lastIndex = rightScanIndex  // 更新 lastIndex
                                break
                            }
                        }

                    }
                }
            }
        }
        // 添加剩余字符串
        result += str.slice(lastIndex)
        return result; // 去除多余空格
    }
    function processDivide(str) {
        let result = '';
        let lastIndex = 0;
        const operatorstr = '+-*/'
        // 扫描字符串
        for (let i = 0; i < str.length; i++) {
            if (str[i] === '/') {
                let currentIndex = i
                let leftScanIndex = currentIndex - 1;
                let leftInsertStart = currentIndex - 1; // 记录插入位置
                let leftParenStack = [];
                let leftOperatorStack = []

                // 查找左侧的匹配
                let leftFlag1 = false
                // 确定了匹配方式
                let leftFlag2 = false
                // 确定了哪种匹配方式
                while (leftScanIndex >= 0) {
                    const char = str[leftScanIndex]
                    if (!leftFlag1) {
                        if (char === ' ') {
                            leftInsertStart--
                            leftScanIndex--
                        }
                        else if (char === '(') {
                            leftParenStack.push(leftScanIndex)
                            leftFlag1 = true
                            leftFlag2 = true
                            leftScanIndex--
                        }
                        else {
                            leftFlag1 = true
                            leftFlag2 = false
                            leftScanIndex--
                        }
                    }
                    else {
                        if (leftFlag2) {
                            if (char === ')') {
                                leftParenStack.push(leftScanIndex)
                            }
                            else if (char === '(') {
                                if (leftParenStack.length > 1) {
                                    leftParenStack.pop()
                                }
                                else {
                                    // 找到最左边的 '('，替换
                                    result += str.slice(lastIndex, leftScanIndex)
                                    result += '\\frac{@'
                                    result += str.slice(leftScanIndex + 1, leftInsertStart)
                                    result += '#}'
                                    break;
                                }
                            }
                            leftScanIndex--
                        }
                        else {
                            if (char === '#') {
                                leftOperatorStack.push('#')
                                leftScanIndex--
                            }
                            else if (char === '@') {
                                if (leftOperatorStack.length === 0) {
                                    result += str.slice(lastIndex, leftScanIndex + 1)
                                    result += '{@'
                                    result += str.slice(leftScanIndex + 1, leftInsertStart + 1)
                                    result += '#}'
                                    break
                                }
                                else {
                                    leftOperatorStack.pop()
                                    leftScanIndex--
                                }
                            }
                            else if (char === ')') {
                                leftParenStack.push(')')
                                leftScanIndex--
                            }
                            else if (char === '(') {
                                if (leftParenStack.length === 0) {
                                    result += str.slice(lastIndex, leftScanIndex + 1)
                                    result += '{@'
                                    result += str.slice(leftScanIndex + 1, leftInsertStart + 1)
                                    result += '#}'
                                    break
                                }
                                else {
                                    leftParenStack.pop()
                                    leftScanIndex--
                                }
                            }
                            else if (operatorstr.indexOf(char) === -1) {
                                leftScanIndex--
                                if (leftScanIndex === -1) {
                                    result += '\\frac{@'
                                    result += str.slice(0, leftInsertStart + 1)
                                    result += '#}'
                                    break
                                }
                            }
                            else {
                                result += str.slice(lastIndex, leftScanIndex + 1)
                                result += '\\frac{@'
                                result += str.slice(leftScanIndex + 1, leftInsertStart + 1)
                                result += '#}'
                                break
                            }
                        }
                    }
                }

                // 向右扫描
                let rightScanIndex = currentIndex + 1;
                let rightInsertStart = currentIndex + 1; // 记录插入位置
                let rightFlag1 = false
                let rightFlag2 = false
                let rightParenStack = [];
                let rightOperatorStack = []

                // 查找右侧的匹配
                while (rightScanIndex < str.length) {
                    const char = str[rightScanIndex];
                    if (!rightFlag1) {
                        if (char === ' ') {
                            rightScanIndex++
                            rightInsertStart++
                        }
                        else if (char === '(') {
                            rightParenStack.push(rightScanIndex)
                            rightScanIndex++
                            rightFlag1 = true
                            rightFlag2 = true
                        }
                        else {
                            rightScanIndex++
                            rightFlag1 = true
                            rightFlag2 = false
                        }
                    }
                    else {
                        if (char === '@') {
                            rightOperatorStack.push('@')
                            rightScanIndex++
                        }
                        else if (char === '#') {
                            if (rightOperatorStack.length === 0) {
                                result += '{@' + str.slice(rightInsertStart, rightScanIndex) + '#}';
                                lastIndex = rightScanIndex  // 更新 lastIndex
                                break
                            }
                            else {
                                rightScanIndex++
                                rightOperatorStack.pop()
                            }
                        }
                        else if (rightFlag2) {
                            if (char === '(') {
                                rightParenStack.push(rightScanIndex);
                            }
                            else if (char === ')') {
                                if (rightParenStack.length > 1) {
                                    rightParenStack.pop();
                                }
                                else {
                                    // 找到最右边的 ')'
                                    result += '{@' + str.slice(rightInsertStart + 1, rightScanIndex) + '#}';
                                    lastIndex = rightScanIndex + 1; // 更新 lastIndex
                                    break;
                                }
                            }
                            rightScanIndex++
                        }
                        else {
                            if (char === '@') {
                                rightOperatorStack.push('@')
                                rightScanIndex++
                            }
                            else if (char === '#') {
                                if (rightOperatorStack.length === 0) {
                                    result += '{@' + str.slice(rightInsertStart, rightScanIndex) + '#}';
                                    lastIndex = rightScanIndex  // 更新 lastIndex
                                    break
                                }
                                else {
                                    rightScanIndex++
                                    rightOperatorStack.pop()
                                }
                            }
                            else if (char === '(') {
                                leftParenStack.push('(')
                                leftScanIndex--
                            }
                            else if (char === ')') {
                                if (leftParenStack.length === 0) {
                                    result += '{@' + str.slice(rightInsertStart, rightScanIndex) + '#}';
                                    lastIndex = rightScanIndex  // 更新 lastIndex
                                    break
                                }
                                else {
                                    rightScanIndex++
                                    rightOperatorStack.pop()
                                }
                            }
                            else if (operatorstr.indexOf(char) === -1) {
                                rightScanIndex++
                                if (rightScanIndex === str.length) {
                                    result += '{@' + str.slice(rightInsertStart, str.length) + '#}'
                                    break
                                }
                            }
                            else {
                                result += '{@' + str.slice(rightInsertStart, rightScanIndex) + '#}';
                                lastIndex = rightScanIndex  // 更新 lastIndex
                                break
                            }
                        }

                    }
                }
            }
        }
        // 添加剩余字符串
        result += str.slice(lastIndex)
        return result; // 去除多余空格
    }
    str = processAbs(str)
    str = processMathFunctions(str, 'sqrt', '{@', '#}')
    str = processMathFunctions(str, 'ln', 'LEFTPAREN@', '#RIGHTPAREN')
    str = processMathFunctions(str, 'lg', 'LEFTPAREN@', '#RIGHTPAREN')
    str = processPow(str)
    str = processDivide(str)
    str = str.replace(/\*/g, ' ')
    function replaceBracesAndPow(str) {
        return str
            .replace(/LEFTPAREN/g, '(')    // 替换 LEFTBRACE 为 (
            .replace(/RIGHTPAREN/g, ')')   // 替换 RIGHTBRACE 为 )
            .replace(/POW/g, '^')        // 替换 POW 为 ^
            .replace(/\(/g, '\\left(')   // 替换 ( 为 \left(
            .replace(/\)/g, '\\right)')  // 替换 ) 为 \right)
            .replace(/@/g,'')
            .replace(/#/g,'');
    }
    str = replaceBracesAndPow(str)
    return str
}
const docFormat = (str) => {
    if(str === ''){
        return ''
    }
    else{
        return `(\\text{${str}})`
    }
}
const dataFormat = ((str) =>{
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
    if(typeof str === 'string'){
        return formatScientificToLatex(str.replace(/%/g, '\\%'))
    }
    else{
        return ''
    }
})
// 格式化函数

const props={
    multiple:true,
    checkStrictly: true,
    emitPath: false, // 如果只希望返回最后一级选项的值
    label:'label',
    value:'value',
}
const dataOptions = computed(()=>{
    let tmpDataOptions = []
    function generateDataOption(item){
        function childrenValueMap(name, title, unit, doc, data){
            let fmtUnit = unitFormat(unit)
            let fmtDoc = docFormat(doc)
            let fmtTitle = titleFormat(title)
            if(name === '平均值'){
                return {
                    center: `$ \\overline{${fmtTitle}} ${fmtDoc} ${fmtUnit} $ & $ ${dataFormat(data)} $`,
                    dataLength: 1,
                }
            }
            if(name === '相对平均偏差'){
                return {
                    center: `$ \\overline{\\delta}_{r,${fmtTitle}} $ & $ ${dataFormat(data)} $`,
                    dataLength: 1,
                }
            }
            if(name === '标准偏差'){
                return {
                    center: `$ s_{${fmtTitle}} $ & $ ${dataFormat(data)} $`,
                    dataLength: 1,
                }
            }
            if(name === '相对标准偏差'){
                return {
                    center: `$ s_{r,${fmtTitle}} $ & $ ${dataFormat(data)} $`,
                    dataLength: 1,
                }
            }
            if(name === 'A类不确定度'){
                return {
                    center: `$ u_{A,${fmtTitle}} ${fmtUnit} $ & $ ${dataFormat(data)} $`,
                    dataLength: 1,
                }
            }
            if(name === 'B类不确定度'){
                return {
                    center: `$ u_{B,${fmtTitle}} ${fmtUnit} $ & $ ${dataFormat(data)} $`,
                    dataLength: 1,
                }
            }
            if(name === '平均相对误差'){
                return {
                    center: `$ \\overline{\\varepsilon}_{r,${fmtTitle}} $ & $ ${dataFormat(data)} $`,
                    dataLength: 1,
                }
            }
            if(name === '平均值与理论值的相对误差'){
                return {
                    center: `$ \\Delta_{r,${fmtTitle}} $ & $ ${dataFormat(data)} $`,
                    dataLength: 1,
                }
            }
            if(name === '理论值'){
                return {
                    center: `$ ${fmtTitle}_{\\text{theory}} ${fmtDoc} ${fmtUnit} $ & $ ${dataFormat(data)} $`,
                    dataLength: 1,
                }
            }
            if(name === '相对误差'){
                let valData = ''
                let len = data.length
                for(let i = 0; i < len; i++){
                    valData += `$ ${dataFormat(data[i].relErr)} $`
                    if(i !== len-1){
                        valData += ' & '
                    }
                }
                return {
                    center: `$ \\varepsilon_{r,${fmtTitle}} $ & ${valData}`,
                    dataLength: len,
                }
            }
        }
        let unit = item.unit
        let doc = item.doc
        let len = item.dataSet.length
        let title = item.title
        let tmp = {}
        tmp.label = title
        let valTitle = `$ ${titleFormat(title)} ${docFormat(doc)} ${unitFormat(unit)} $`
        let valData = []
        let valDataLength = len
        function draftValData(head, tail, index){
            valData[index] = ''
            for(let i = head; i < tail; i++){
                valData[index] += `$ ${dataFormat(item.dataSet[i].rawData)} $`
                if(i !== tail - 1){
                    valData[index] += ' & '
                }
            }
        }
        if(len < 10){
            draftValData(0, len, 0)
        }
        else if(len % 2 === 0 && len / 2 <= 10){
            draftValData(0, len/2, 0)
            draftValData(len/2, len, 1)
            valDataLength = len/2
        }
        else if(len % 3 === 0 && len / 3 <= 10){
            draftValData(0, len/3, 0)
            draftValData(len/3, 2*len/3, 1)
            draftValData(2*len/3, len, 2)
            valDataLength = len/3
        }
        else if(len % 4 === 0 && len / 4 <= 10){
            draftValData(0, len/4, 0)
            draftValData(len/4, len/2, 1)
            draftValData(len/2, 3*len/4, 2)
            draftValData(3*len/4, len, 3)
            valDataLength = len/4
        }
        else if(len % 5 === 0 && len / 5 <= 10){
            draftValData(0, len/5, 0)
            draftValData(len/5, 2*len/5, 1)
            draftValData(2*len/5, 3*len/5, 2)
            draftValData(3*len/5, 4*len/5, 3)
            draftValData(4*len/5, len, 4)
            valDataLength = len/5
        }
        else{
            draftValData(0, len, 0)
        }
        let tmpCenter = []
        for(let i = 0; i < valData.length; i++){
            tmpCenter[i] = `${valTitle} & ${valData[i]}`
        }
        tmp.value = {
            center: tmpCenter,
            dataLength: valDataLength,
            dataHeight: tmpCenter.length
        }
        // center的末尾没有换行符，统一解决
        if(item.computeMethod){
            tmp.value.comment = `$ \\displaystyle ${titleFormat(title)} = ${commentFormat(item.computeMethod)} $\\qquad `
        }
        // 可能的注释区内容
        tmp.children = []
        if(item.theoData && item.theoData !== ''){
            tmp.children.push({
                label: '理论值',
                value: childrenValueMap('理论值', title, unit, doc, item.theoData)
            })
            if(item.dataSet[0] && item.dataSet[0].relErr){
                tmp.children.push({
                    label:'相对误差',
                    value: childrenValueMap('相对误差', title, unit, doc, item.dataSet)
                })
            }
        }
        for(let key in item.analysis){
            let ana = item.analysis[key]
            if(ana.propertyValue !== '' && ana.propertyValue !== '0'){
                tmp.children.push({
                    label: ana.propertyName,
                    value: childrenValueMap(ana.propertyName, title, unit, doc, ana.propertyValue)
                })
            }
        }
        if(item.moreUncer.bUncer && item.moreUncer.bUncer !== '0'){
            tmp.children.push({
                label: 'B类不确定度',
                value: childrenValueMap('B类不确定度', title, unit, doc, item.moreUncer.bUncer)
            })
        }
        if(item.moreUncer.wholeUncer && item.moreUncer.wholeUncer !== '0'){
            tmp.children.push({
                label: '不确定度',
                value: childrenValueMap('不确定度', title, unit, doc, item.moreUncer.wholeUncer)
            })
        }
        return tmp
    }
    dataList.value.forEach(item => {
        tmpDataOptions.push(generateDataOption(item))
    })
    return tmpDataOptions
})
const handleTableUpdate = (()=>{
    let selectedTable = tableList.value[selectedTableIndex.value]
    let tableFramed = selectedTable.tableFramed
    function updateDataValue1(){
        let tmp = []
        if(selectedTable.dataValuesSource && selectedTable.dataValuesSource.length){
            selectedTable.dataValuesSource.forEach(item => {
                if(item.dataLength === 1){
                    tmp.push(item)
                }
            })
        }
        selectedTable.dataValue1 = tmp
    }
    function updateDataValueN(){
        let tmp = []
        if(selectedTable.dataValuesSource && selectedTable.dataValuesSource.length){
            selectedTable.dataValuesSource.forEach(item => {
                if(item.dataLength !== 1){
                    tmp.push(item)
                }
            })
        }
        selectedTable.dataValueN = tmp
    }
    function updateCenterContent(){
        let center = ''
        let len1 = selectedTable.dataValue1.length
        let lenN = selectedTable.dataValueN.length
        if(lenN){
            try{
                let maxLen = selectedTable.dataValueN.reduce((max, data) => {
                    if(max === data.dataLength || (max > data.dataLength && data.dataLength === 1)){
                        return max
                    }
                    else if(max === 1){
                        return data.dataLength
                    }
                    else{
                        ElMessage.error('数组的长度不一致！')
                        throw new Error('数组的长度不一致！')
                    }
                }, selectedTable.dataValueN[0].dataLength)
                let maxHeight = selectedTable.dataValueN.reduce((max, data) => {
                    if(max === data.dataHeight || (max > data.dataHeight && data.dataHeight === 1)){
                        return max
                    }
                    else if(max === 1){
                        return data.dataHeight
                    }
                    else{
                        ElMessage.error('数组的长度不一致！')
                        throw new Error('数组的长度不一致！')
                    }
                }, selectedTable.dataValueN[0].dataHeight)
                function draftCenterNumber(length, index){
                    center += '编号 & '
                    for(let i = index * length + 1; i < (index+1) * length + 1; i++){
                        center += `$ ${i} $`
                        if(i !== (index+1) * length){
                            center += ' & '
                        }
                    }
                    center += ' \\\\\n\t\t\t'
                }
                for(let i = 0; i < maxHeight; i++){
                    draftCenterNumber(maxLen, i)
                    if(len1){
                        for(let j = 0; j < lenN; j++){
                            center += selectedTable.dataValueN[j].center[i]
                            center += ' \\\\\n\t\t\t'
                        }
                    }
                    else{
                        for(let j = 0; j < lenN; j++){
                            center += selectedTable.dataValueN[j].center[i]
                            if(!(j === lenN - 1 && i === maxHeight - 1)){
                                center += ' \\\\\n\t\t\t'
                            }
                        }
                        if(i === maxHeight - 1){
                            center += '\n\t\t'
                        }
                    }
                }
            }
            catch(error){
                ElMessage.error('制表过程中出错！')
                console.error("Error creating table:", error);
            }

        }
        if(len1){
            for(let i = 0; i < len1; i++){
                center += selectedTable.dataValue1[i].center
                if(i !== len1 - 1){
                    center += ' \\\\\n\t\t\t'
                }
            }
            center += '\n\t\t'
        }
        selectedTable.centerContent = center
    }
    function updateHeadContent(){
        let head = ''
        let len1 = selectedTable.dataValue1.length
        let lenN = 0
        let lenNum = 0
        if(selectedTable.dataValueN.length){
            for(let i = 0 ; i < selectedTable.dataValueN.length; i++){
                lenN += selectedTable.dataValueN[i].center.length
                lenNum = Math.max(lenNum, selectedTable.dataValueN[i].center.length)
            }
        }
        if(lenN && len1){
            head += ',cell{'
            for(let i = lenN + lenNum + 1; i <= lenN + len1 + lenNum; i++){
                head += `${i}`
                if(i !== lenN + len1 + lenNum){
                    head += ','
                }
            }
            let maxDataLength = 0
            selectedTable.dataValueN.forEach(item => {
                maxDataLength = Math.max(maxDataLength, item.dataLength)
            })
            head += `}{2}={r=1,c=${maxDataLength}}{c}`
        }
        selectedTable.headContent = head
    }
    function updateCommentContent(){
        let comment = ''
        selectedTable.dataValueN.forEach(item => {
            if(item.comment){
                comment += item.comment
            }
        })
        selectedTable.dataValue1.forEach(item => {
            if(item.comment){
                comment += item.comment
            }
        })
        selectedTable.commentContent = comment
    }
    updateDataValue1()
    updateDataValueN()
    updateHeadContent()
    updateCenterContent()
    updateCommentContent()
    if(tableFramed){
        selectedTable.tableContent = `\\begin{table}[H]\n\t\\framed[${selectedTable.tableTitleContent}]{\n\t\t\\begin{tblr}{hlines,vlines,cells={c}` + selectedTable.headContent + '}\n\t\t\t'+ selectedTable.centerContent + '\\end{tblr}\n\t}[' + selectedTable.commentContent + ']\n\\end{table}'
    }
    else{
        selectedTable.tableContent = `\\begin{table}[H]\n\t\\notframed[${selectedTable.tableTitleContent}]{\n\t\t\\begin{tblr}{hlines,vlines,cells={c}`+ selectedTable.headContent + '}\n\t\t\t' + selectedTable.centerContent + '\\end{tblr}\n\t}[' + selectedTable.commentContent +']\n\\end{table}'
    }
    ElMessage.success('刷新成功！')
})
const handleTableSelectAll =()=>{
    let tmpValueSource = []
    dataOptions.value.forEach(item => {
        tmpValueSource.push(item.value)
    })
    tableList.value[selectedTableIndex.value].dataValuesSource = tmpValueSource
    handleTableUpdate()
}
const handleTableClearAll = ()=>{
    tableList.value[selectedTableIndex.value].dataValuesSource = []
    tableList.value[selectedTableIndex.value].tableTitleContent = ''
    handleTableUpdate()
}
// 表格逻辑

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
const handleTableCopy = ()=>{
    copyToClipboard(tableList.value[selectedTableIndex.value].tableContent,'tableContent')
}
const handleGraphCopy = ()=>{
    copyToClipboard(graphList.value[selectedGraphIndex.value].graphContent,'graphContent')
}
// 黏贴逻辑

const xTitleList = computed(()=>{
    let tmp = dataList.value.map(data => ({value:data.title,label:data.title}))
    tmp.push({value:'序号', label: '序号'})
    return tmp
})
const yTitleList = computed(() => {
    return dataList.value.map(data => ({value:data.title,label:data.title}))
})
const levelRules = [
    {
        value:'unified',
        label:'统一精度'
    },
    {
        value:'nonUnified',
        label:'不统一精度'
    },
    {
        value:'precise',
        label:'确数'
    }
]
const handleAddSingleGraph = () =>{
    store.addSingleGraph()
}
const handleDeleteSingleGraph = (index) => {
    store.deleteSingleGraph(index)
}
const handleGraphUpdate = () => {
    function getDomain(dataSet){
        let minData = dataSet.reduce((min, data) => {
            return min < Number(data.rawData) ? min : Number(data.rawData)
        }, Number(dataSet[0].rawData))
        let maxData = dataSet.reduce((max, data) => {
            return max > Number(data.rawData) ? max : Number(data.rawData)
        }, Number(dataSet[0].rawData))
        return `${minData} : ${maxData}`
    }
    // 获取一组数据的最小，最大值
    let xDataSet = []
    let yDataSet = []
    let xUnit = ''
    let yUnit = ''
    let selectedGraph = graphList.value[selectedGraphIndex.value]
    function initXYDataSetsAndUnits(index){
        const yItem = dataList.value.find(item => item.title === selectedGraph.singleGraphs[index].yData)
        if(!yItem){
            ElMessage.error('变量 y 不存在！')
            throw new Error('变量 y 不存在！')
        }
        yDataSet = yItem.dataSet
        yUnit = yItem.unit
        if(selectedGraph.singleGraphs[index].xData === '序号'){
            xDataSet = []
            for(let i = 1; i <= yDataSet.length; i++){
                xDataSet.push({rawData: i, bit: 100})
            }
            xUnit = ''
        }
        else{
            const xItem = dataList.value.find(item => item.title === selectedGraph.singleGraphs[index].xData)
            if(!xItem){
                ElMessage.error('变量 x 不存在！')
                throw new Error('变量 x 不存在！')
            }
            xDataSet = xItem.dataSet
            xUnit = xItem.unit
        }
    }
    // 初始化作图所需的两个dataSet
    let xstyleContent = ''
    let ystyleContent = ''
    let graphCenterContent = ''
    let graphCommentContent = ''
    let graphs = selectedGraph.singleGraphs
    let graphLength = selectedGraph.singleGraphs.length
    try{
        for(let i = 0; i < graphLength; i++){
            initXYDataSetsAndUnits(i)

            if(i === 0){
                xstyleContent += `${titleFormat(graphs[i].xData)}`
                ystyleContent += `${titleFormat(graphs[i].yData)}`
            }
            else{
                if(xstyleContent.indexOf(titleFormat(graphs[i].xData)) === -1){
                    xstyleContent += `, ${titleFormat(graphs[i].xData)}`
                }
                if(ystyleContent.indexOf(titleFormat(graphs[i].yData)) === -1){
                    ystyleContent += `, ${titleFormat(graphs[i].yData)}`
                }
            }
            if(i === graphLength - 1){
                xstyleContent += ` ${unitFormat(xUnit)}`
                ystyleContent += ` ${unitFormat(yUnit)}`
            }
            // 处理xstyleContent, ystyleContent

            if(xDataSet.length !== yDataSet.length){
                ElMessage.error('数组长度不一致！')
                throw new Error('数组长度不一致！')
            }
            // 检测

            let datapointContent = ''
            for(let i = 0; i < xDataSet.length; i++){
                datapointContent += `(${xDataSet[i].rawData} , ${yDataSet[i].rawData}) `
            }
            let xDomain = ''
            switch(graphs[i].graphOption){
                case 'line':
                    xDomain = getDomain(xDataSet)
                    graphs[i].graphData = store.evaluateLine(xDataSet, yDataSet)
                    if(i !== 0){
                        graphCenterContent += `\n\t\t\t`
                        if(graphCommentContent !== ''){
                            graphCommentContent += ` \\\\ `
                        }
                    }
                    graphCenterContent += `\\functionline{${xDomain}}{${graphs[i].graphData.slope}*x${graphs[i].graphData.intercept[0] === '-' ? '' : '+'}${graphs[i].graphData.intercept}}[拟合直线：$${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)}$]\n\t\t\t\\datapoint[only marks]{${datapointContent}}[实验数据：$${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)}$]`
                    graphCommentContent += `$ ${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)} : y=${dataFormat(graphs[i].graphData.slope)}x${graphs[i].graphData.intercept[0] === '-' ? '' : '+'}${dataFormat(graphs[i].graphData.intercept)} \\qquad R^2 = ${dataFormat(graphs[i].graphData.rSquared)} $`
                    break
                case 'square':
                    xDomain = getDomain(xDataSet)
                    graphs[i].graphData = store.evaluateSquare(xDataSet, yDataSet)
                    if(i !== 0){
                        graphCenterContent += `\n\t\t\t`
                        if(graphCommentContent !== ''){
                            graphCommentContent += ` \\\\ `
                        }
                    }
                    graphCenterContent += `\\functionline{${xDomain}}{${graphs[i].graphData.a}*x*x${graphs[i].graphData.b[0] === '-' ? '' : '+'}${graphs[i].graphData.b}*x${graphs[i].graphData.c[0] === '-' ? '' : '+'}${graphs[i].graphData.c}}[拟合曲线：$${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)}$]\n\t\t\t\\datapoint[only marks]{${datapointContent}}[实验数据：$${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)}$]`
                    graphCommentContent += `$ ${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)} : y=${dataFormat(graphs[i].graphData.a)}x^2${graphs[i].graphData.b[0] === '-' ? '' : '+'}${dataFormat(graphs[i].graphData.b)}x${graphs[i].graphData.c[0] === '-' ? '' : '+'}${dataFormat(graphs[i].graphData.c)} \\qquad R^2 = ${dataFormat(graphs[i].graphData.rSquared)} $`
                    break
                case 'simple':
                    if(i !== 0){
                        graphCenterContent += `\n\t\t\t`
                    }
                    graphCenterContent += `\\datapoint{${datapointContent}}[$${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)}$]`
                    break
                case 'smooth':
                    if(i !== 0){
                        graphCenterContent += `\n\t\t\t`
                    }
                    graphCenterContent += `\\datapoint[smooth]{${datapointContent}}[$${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)}$]`
                    break
            }
        }
        if(selectedGraph.graphFramed){
            selectedGraph.graphContent = `\\begin{figure}[H]\n\t\\framed[${selectedGraph.graphTitleContent}]{\n\t\t\\begin{plot}{\\xstyle{$ ${xstyleContent} $} \\ystyle{$ ${ystyleContent} $}}\n\t\t\t${graphCenterContent}\n\t\t\\end{plot}\n\t}[ ${graphCommentContent}]\n\\end{figure}`
        }
        else{
            selectedGraph.graphContent = `\\begin{figure}[H]\n\t\\notframed[${selectedGraph.graphTitleContent}]{\n\t\t\\begin{plot}{\\xstyle{$ ${xstyleContent} $} \\ystyle{$ ${ystyleContent} $}}\n\t\t\t${graphCenterContent}\n\t\t\\end{plot}\n\t}[ ${graphCommentContent}]\n\\end{figure}`
        }
        ElMessage.success('作图成功！')
    }
    catch(error){
        ElMessage.error('作图失败！')
        console.error('Error during plotting', error)
    }
}
// 制图逻辑
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
// 间接数据逻辑


</script>
<template>

<div v-if="selectedDataIndex >= 0 && dataList[selectedDataIndex] ? dataList[selectedDataIndex].type === 'direct' : false">
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
                            :ref="el => inputRefs[scope.$index] = el"
                        >
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" width="60px">
                    <template #="scope">
                        <el-icon
                            @click="handleInsertRawData(scope.$index)"
                            class="deleteicon el-icon--right"
                        >
                            <first-aid-kit></first-aid-kit>
                        </el-icon>
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
                <el-select
                    style="width: 39%;text-align: center;min-width: 5.5em"
                    v-model="dataList[selectedDataIndex].levelRule"
                >
                    <el-option v-for="levelRule in levelRules" :key="levelRule.value" :label="levelRule.label" :value="levelRule.value"></el-option>
                </el-select>
                <span style="width: 1%;"></span>
                <label style="font-weight: 550;width: 9%;text-align: left;min-width: 5em;" >符号含义</label>
                <input v-model="dataList[selectedDataIndex].doc" style="text-align: center;width: 40%;" placeholder="选填，仅对 LaTeX 制表/图有影响">
            </div>
        </el-card>
    </div>
</div>
<!-- 直接数据的编辑卡片 -->
<div class="card-div" v-if="selectedDataIndex >= 0 && dataList[selectedDataIndex] ? dataList[selectedDataIndex].type === 'indirect' : false">
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
<div class="card-div" v-if="selectedDataIndex >= 0 && dataList[selectedDataIndex]">
    <el-card shadow="hover">
        <div class="equipment">
            <label style="font-weight: 550;width: 16%;text-align: left;">单位</label>
            <input style="text-align: center;width: 84%;" placeholder="选填，仅对LaTeX制表/图有影响" v-model="dataList[selectedDataIndex].unit">
        </div>
    </el-card>
</div>
<!-- 公用的单位卡片 -->
<div class="card-div" v-if="selectedDataIndex >= 0 && dataList[selectedDataIndex] ? dataList[selectedDataIndex].type === 'indirect' && dataList[selectedDataIndex].computeOption === 'forAll' : false">
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
<div class="card-div" v-if="selectedDataIndex >= 0 && dataList[selectedDataIndex] ? dataList[selectedDataIndex].type === 'indirect' && dataList[selectedDataIndex].computeOption === 'forAvg' : false">
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
<div class="card-div" v-if="selectedDataIndex >= 0 && dataList[selectedDataIndex]">
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
<div class="card-div" v-if="selectedDataIndex >= 0 && dataList[selectedDataIndex]? dataList[selectedDataIndex].type === 'direct' : false">
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
 <div class="card-div" v-if="selectedDataIndex >= 0 && dataList[selectedDataIndex]? dataList[selectedDataIndex].type === 'indirect' : false">
    <el-card shadow="hover">
        <div class="equipment">
            <label style="font-weight: 550;width: 20%;text-align: left;">不确定度</label>
            <input style="text-align: center;width: 80%;" disabled v-model="dataList[selectedDataIndex].moreUncer.wholeUncer">
        </div>
    </el-card>
</div>
<!-- 间接数据的不确定度卡片 -->

<div v-if="selectedGraphIndex >= 0 && graphList[selectedGraphIndex]">
    <div v-for="(singleGraph, index) in graphList[selectedGraphIndex].singleGraphs">
        <div class="card-div">
            <el-card shadow="hover">
                <div class="equipment" style="font-weight: bold; font-size: large;">
                    图线 {{ index+1 }}
                    <el-icon class="el-icon--right deleteicon" @click="handleDeleteSingleGraph(index)">
                        <circle-close></circle-close>
                    </el-icon>
                </div>
                <div class="equipment">
                    <div class="equipment" style="width: 60%;">
                        <label style="font-weight: 550;width: 16%;text-align: center;">x轴数据</label>
                        <span style="width: 1%;"></span>
                        <el-select
                            style="width: 32%;text-align: center;min-width: 5.5em"
                            v-model="singleGraph.xData"
                        >
                            <el-option v-for="title in xTitleList" :key="title.value" :label="title.label" :value="title.value"></el-option>
                        </el-select>
                        <span style="width: 1%;"></span>
                        <label style="font-weight: 550;width: 16%;text-align: center;">y轴数据</label>
                        <span style="width: 1%;"></span>
                        <el-select
                            style="width: 32%;text-align: center;min-width: 5.5em"
                            v-model="singleGraph.yData"
                        >
                            <el-option v-for="title in yTitleList" :key="title.value" :label="title.label" :value="title.value"></el-option>
                        </el-select>
                        <span style="width: 1%;"></span>
                    </div>
                    <div class="equipment" style="width: 40%;">
                        <label style="font-weight: 550;width: 10%;text-align: center;">制图方法</label>
                        <span style="width: 5%;"></span>
                        <el-select
                            style="width: 45%;text-align: center;min-width: 5.5em"
                            v-model="singleGraph.graphOption"
                        >
                            <el-option v-for="option in graphOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
                        </el-select>
                    </div>
                </div>
            </el-card>
        </div>
        <div class="card-div" v-if="singleGraph.graphData !== ''">
            <el-card shadow="hover">
                <div class="equipment" style="font-size: 15pt;font-weight: bold;" v-if="singleGraph.graphOption === 'line'">
                    拟合结果：{{'y = '+singleGraph.graphData.slope+' x '+ (singleGraph.graphData.intercept[0]==='-'?'':'+ ') + singleGraph.graphData.intercept+' ' + ',' + ' R² = '+ singleGraph.graphData.rSquared}}
                </div>
                <div class="equipment" style="font-size: 15pt;font-weight: bold;" v-if="graphList[selectedGraphIndex].graphOption === 'square'">
                    拟合结果：{{'y = '+ singleGraph.graphData.a + ' x² ' + (singleGraph.graphData.b[0]==='-'?'':'+ ') + singleGraph.graphData.b+' x '+ (singleGraph.graphData.c[0]==='-'?'':'+ ') + singleGraph.graphData.c + ' , R² = ' + singleGraph.graphData.rSquared}}
                </div>
            </el-card>
        </div>
    </div>
    <div class="card-div">
        <el-card shadow="hover">
            <div class="equipment">
                <label style="font-weight: 550;width: 10%;text-align: center;">标题</label>
                <span style="width: 1%;"></span>
                <input placeholder="标题" v-model="graphList[selectedGraphIndex].graphTitleContent" style="width: 22%; text-align: center;">
                <span style="width: 5%;"></span>
                <el-button @click="handleAddSingleGraph" style="width: 35%; text-align: center;">添加图线</el-button>
                <span style="width: 5%;"></span>
                <el-button @click="handleGraphUpdate" style="width: 35%; text-align: center;">刷新</el-button>
            </div>
        </el-card>
    </div>
    <div class="card-div">
        <el-card shadow="hover" style="height: 100px; overflow: auto;">
            <div>
                <div style="text-align: center;">
                    <span style="font-weight: bold; font-size: large;">依赖 </span>
                    <el-icon class="copy el-icon--right" @click="handleRelyCopy">
                        <document-copy></document-copy>
                    </el-icon>
                </div>
                <pre>{{rely}}</pre>
            </div>
        </el-card>
    </div>
    <div class="card-div">
        <el-card shadow="hover">
            <div>
                <div style="text-align: center;">
                    <el-switch
                        v-model="graphList[selectedGraphIndex].graphFramed"
                        size="large"
                        inactive-text="不带边框"
                        active-text="带边框"
                        style="font-size: large;width: 20%;--el-switch-on-color: #626aef;"
                    />
                    <span style="font-weight: bold; font-size: large;"> 内容 </span>
                    <el-icon class="copy el-icon--right" @click="handleGraphCopy">
                        <document-copy></document-copy>
                    </el-icon>
                </div>
                <pre>{{graphList[selectedGraphIndex].graphContent}}</pre>
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
    <p>间接数据通过直接数据计算得到。可以在待填处填入计算式，目前支持 <span class="formula">+，-, *, /, ^, ()</span>  运算符与 <span class="formula">ln(), lg(), sqrt(), abs()</span> 函数。使用直接数据前，需要在侧栏处为直接数据<em>命名</em>。现在对变量的命名没有严格要求，一般建议把中文部分放在数据的<em>含义</em>内容中。点击命名框可以直接复制数据名。</p>
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
    <h2>保存与读取</h2>
    <p>点击标题右侧的第一个图标，可以保存当前内容为一个 json 文件。之后打开时，可以点击标题右侧的第二个图标，打开对应的 json 文件。</p>
    <h2>参考</h2>
    <p>时有忘记各种计算方法的时候，所以留了三个参考，方便查阅。</p>
    <h2>快捷键</h2>
    <p>上，下键可以控制选择直接数据、间接数据、表格、图，前提是当前你选中了它们其中的一种。</p>
    <p>Ctrl + d 可以创建一个新的直接数据；Ctrl + i 可以创建一个新的间接数据；Ctrl + t 可以创建一个新的表格； Ctrl + f 可以创建一个新的图；Ctrl + s 可以保存当前数据； Ctrl + o 可以打开已有数据。</p>
</div>
  <!-- readme视图 -->
<div v-if="selectedTableIndex >= 0 && tableList[selectedTableIndex]">
    <div class="card-div">
        <el-card shadow="hover">
            <div class="equipment">
                <label style="font-weight: 550;width: 10%;text-align: center;">表格数据</label>
                <span style="width: 1%;"></span>
                <el-cascader
                    :options="dataOptions"
                    :props="props"
                    placeholder="选择数据"
                    v-model="tableList[selectedTableIndex].dataValuesSource"
                    style="width: 38.5%;"
                >
                </el-cascader>
                <span style="width: 1%;"></span>
                <label style="font-weight: 550;width: 10%;text-align: center;">标题</label>
                <span style="width: 1%;"></span>
                <input placeholder="标题" v-model="tableList[selectedTableIndex].tableTitleContent" style="width: 38.5%; text-align: center;">

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
                <div style="text-align: center;">
                    <span style="font-weight: bold; font-size: large;"> 依赖 </span>
                    <el-icon class="copy el-icon--right" @click="handleRelyCopy">
                        <document-copy></document-copy>
                    </el-icon>
                </div>
                <pre>{{rely}}</pre>
            </div>
        </el-card>
        <br>
        <el-card shadow="hover">
            <div>
                <div style="text-align: center;">
                    <el-switch
                        v-model="tableList[selectedTableIndex].tableFramed"
                        size="large"
                        inactive-text="不带边框"
                        active-text="带边框"
                        style="font-size: large;width: 20%;--el-switch-on-color: #626aef;"
                    />
                    <span style="font-weight: bold; font-size: large;"> 内容 </span>
                    <el-icon class="copy el-icon--right" @click="handleTableCopy">
                        <document-copy></document-copy>
                    </el-icon>
                </div>
                <pre>{{tableList[selectedTableIndex].tableContent}}</pre>
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
.copy{
    cursor: pointer;
    :hover{
        color:#3498db
    }
}
</style>