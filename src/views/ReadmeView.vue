<script setup>
import { useAllDataStore } from '../assets/stores';
import { computed } from 'vue';
const store = useAllDataStore()
const isReadme = computed(() => store.state.isReadme)
</script>
<template>
    <div v-show="isReadme">
        <h2>直接数据</h2>
        <p>直接数据默认是精度相同的数据集。因此，输入时<em>允许省略末尾的零</em>（只要有一个数据末尾不为0）。如果直接数据的精度确实不同，可以通过<em>精度规则-不统一精度</em>调整。</p>
        <p>在新数据处输入数据并回车即可添加数据，各类信息会随着数据的输入自动更新。</p>
        <p>单位只会影响 <span class="formula">LaTeX</span> 制作图表，不参与计算。斑鸠会自动处理 <span class="formula">*，/</span> 和数字上标，也包括 <span
                class="formula">μ，°，℃</span> 这几个不常见字符。</p>
        <p>单位示例：<span class="formula">kg*m/s2</span> 。</p>
        <h2>间接数据</h2>
        <p>间接数据通过直接数据计算得到。可以在待填处填入计算式，目前支持 <span class="formula">+，-, *, /, ^, ()</span> 运算符与 <span
                class="formula">ln(),
                lg(), sqrt(), abs()</span>
            函数。使用直接数据前，需要在侧栏处为直接数据<em>命名</em>。现在对变量的命名没有严格要求，一般建议把中文部分放在数据的<em>含义</em>内容中。点击命名框可以直接复制数据名。</p>
        <p>tips:字母后的数字会<em>自动识别成下标</em>， <span class="formula">a1，b1,2</span> 都是合法的命名。</p>
        <p>示例：有直接数据 <span class="formula">a, b, c, d</span>，可写计算式 <span class="formula">(a+b)*c/d/9.8</span>。</p>
        <p>需要注意的是，直接在运算式中输入数字，处理器会默认该数据是<em>精准数据</em>，会按照<em>存疑数字原则</em>保留计算结果的有效数字。如果数字拥有有效数字，请把它<em>作为直接数据</em>输入。</p>
        <p>确定计算方式和计算式后，<em>点击刷新</em>，即可获得最新的间接数据。</p>
        <p>斑鸠会自动根据计算式求出间接数据的不确定度。请确保依赖的直接数据的不确定度正确。</p>
        <h2>设置</h2>
        <p>在边栏的设置中可以选择文件保存策略和输出语言。输出语言决定了制表和制图时一些默认注释的语言。这些设置将被保存在 package.nw（mac 用户为 app.nw）同级目录 user 下的 config 目录中。
        </p>
        <h2><span class="formula">LaTeX</span> 制表</h2>
        <p>选择表格数据，即生成对应表格的 <span class="formula">LaTeX</span> 代码。点击全选，可以选中当前的所有数据。点击清空，可以删除当前表格的数据。</p>
        <p>如果内容无法对应，可以尝试点击刷新键。</p>
        <p><span class="formula">LaTeX</span> 代码的依赖同时包含制表和制图的依赖。因此，<em>只需复制一次</em>即可。</p>
        <p>间接数据的计算公式也会出现在图表中。</p>
        <h2><span class="formula">LaTeX</span> 制图</h2>
        <p>为数据命名后，即可通过选择数据与制图方法获得 <span class="formula">LaTeX</span> 代码。在这里，依赖的内容与 <span class="formula">LaTeX</span>
            制表处相同。
        </p>
        <p>在最小二乘直线斜率的有效数字方面，使用 x 数据集中最大的有效位数、 y 数据集中最大的有效位数中的最小者。</p>
        <p>选择好数据后，<em>点击刷新</em>，即可获得最新的代码。</p>
        <h2>保存与读取</h2>
        <p>点击标题右侧的第一个图标，可以保存当前内容为一个 json 文件。之后打开时，可以点击标题右侧的第二个图标，打开对应的 json 文件。</p>
        <p>边栏的设置内有文件保存策略，默认为自动，此时你的全部数据会自动保存在 package.nw（mac 用户为 app.nw）同级目录 user 下的 data 目录中。</p>
        <p>手动保存只是停止了自动保存，保存路径不变。</p>
        <h2>参考</h2>
        <p>时有忘记各种计算方法的时候，所以留了三个参考，方便查阅。</p>
        <h2>快捷键</h2>
        <p>上，下键可以控制选择直接数据、间接数据、表格、图，前提是当前你选中了它们其中的一种。</p>
        <p>Ctrl + d 可以创建一个新的直接数据；Ctrl + i 可以创建一个新的间接数据；Ctrl + t 可以创建一个新的表格； Ctrl + f 可以创建一个新的图；Ctrl + s 可以保存当前数据； Ctrl + o 可以打开已有数据。</p>
    </div>
</template>
<style lang="less" scoped>
@import (css) './mainPageStyle.css';
</style>