<script setup>
import { useAllDataStore } from '../assets/stores';
const store = useAllDataStore()

</script>
<template>
    <div v-show="store.state.view.type === 'readme'">
        <h2>直接数据</h2>
        <p>直接数据拥有三个精度选项：统一精度，不统一精度和确数。</p>
        <p><em>统一精度</em>：所有输入数据精度相同。因此，输入时<em>允许省略末尾的零</em>（只要有一个数据末尾不为0）。</p>
        <p><em>不统一精度</em>：输入数据可能精度不同，需要准确输入。</p>
        <p><em>确数</em>：用于储存一些常作为字母出现的准确数，如各种给定的常数，就可以用确数保存。</p>
        <p>在新数据处输入数据并回车即可添加数据，各类信息会随着数据的输入自动更新。</p>
        <p>单位（如 <span class="formula">kg*m/s2</span> ）只会影响 <span class="formula">LaTeX</span> 制作图表，不参与计算。处理器会自动处理 <span
                class="formula">*，/</span> 和数字上标，也包括 <span class="formula">μ，°，℃</span> 这几个不常见字符。</p>
        <h2>间接数据</h2>
        <p>间接数据通过直接数据计算得到。可以在待填处填入计算式，目前支持 <span class="formula">+，-, *, /, ^, ()</span> 运算符与 <span
                class="formula">ln(),
                lg(), sqrt(), abs()</span>
            函数。</p>
        <p>使用直接数据前，需要在侧栏处为直接数据<em>命名</em>。数据名支持 <span class="formula">LaTeX</span> 渲染。一般来说，建议把中文部分放在数据的<em>含义</em>内容中。
        </p>
        <p>tips: 如果想偷懒，<span class="formula">a1，b1,2</span> 都是合法的命名，因为字母后的数字会<em>自动识别成下标。</em></p>
        <p>示例：有直接数据 <span class="formula">a, b, c, d</span>，可写计算式 <span class="formula">(a+b)*c/d/9.8</span>。</p>
        <p>运算式中的所有数字会被处理器当作确数，它会按照<em>存疑数字原则</em>保留计算结果的有效数字。</p>
        <p>确定计算方式和计算式后，<em>点击刷新</em>，即可获得最新的间接数据。</p>
        <p>处理器会自动根据计算式求出间接数据的不确定度。请确保依赖的直接数据的不确定度正确。</p>
        <h2>设置</h2>
        <ul>
            <li><em>文件保存策略</em>： 无论手动还是自动，数据的保存路径都是 package.nw（mac 用户为 app.nw）同级目录 user 下的 data
                目录。<em>自动保存</em>时，数据实时保存；<em>手动保存</em>时，只有 Ctrl + S
                或者点击保存图标才会保存。<em>按日期保存</em>时，会额外生成对应日期的保存目录，<em>不按日期保存</em>则反之。</li>
            <li><em>输出语言</em>： 决定了制表和制图时一些默认注释的语言。</li>
            <li><em>直接数据精度规则</em>：决定了直接数据默认的精度规则。</li>
            <li><em>图表边框</em>： 决定了制作图表时默认 带/不带 边框。</li>
            <li>所有设置被保存在 package.nw（mac 用户为 app.nw）同级目录 user 下的 config 目录中。</li>
        </ul>
        <h2><span class="formula">LaTeX</span> 制表</h2>
        <p>选择表格数据，即生成对应表格的 <span class="formula">LaTeX</span> 代码。点击全选，可以选中当前的所有数据。点击清空，可以删除当前表格的数据。</p>
        <p>如果表格内容与数据无法对应，可以尝试点击刷新键。</p>
        <p><span class="formula">LaTeX</span> 代码的依赖同时包含制表和制图的依赖。因此，<em>只需复制一次</em>即可。</p>
        <p>间接数据的计算公式会自动出现在图表注释中。</p>
        <h2><span class="formula">LaTeX</span> 制图</h2>
        <p>为数据命名后，即可通过选择数据与制图方法获得 <span class="formula">LaTeX</span> 代码。在这里，依赖的内容与 <span class="formula">LaTeX</span>
            制表处相同。
        </p>
        <p>在最小二乘直线斜率的有效数字方面，使用 x 数据集中最大的有效位数、 y 数据集中最大的有效位数中的最小者。</p>
        <p>如果代码没有成功生成，可以尝试点击刷新键。</p>
        <h2>保存与读取</h2>
        <p>点击标题右侧的第一个图标，可以保存当前内容为一个 json 文件。之后打开时，可以点击标题右侧的第二个图标，打开对应的 json 文件。</p>
        <p>边栏的设置内有文件保存策略，默认为自动，此时你的全部数据会自动保存在 package.nw（mac 用户为 app.nw）同级目录 user 下的 data 目录中。</p>
        <p>手动保存只是停止了自动保存，保存路径不变。</p>
        <h2>参考</h2>
        <p>时有忘记各种计算方法的时候，所以留了三个参考，方便查阅。</p>
        <h2>快捷键</h2>
        <ul>
            <li>Ctrl + ↑: 选择已有数据或图表中往上一个</li>
            <li>Ctrl + ↓: 选择已有数据或图表中往下一个</li>
            <li>Ctrl + D: 创建一个新的直接数据</li>
            <li>Ctrl + I: 创建一个新的间接数据</li>
            <li>Ctrl + T: 创建一个新的表格</li>
            <li>Ctrl + G: 创建一个新的图</li>
            <li>Ctrl + S: 保存当前数据</li>
            <li>Ctrl + O: 打开已有数据</li>
            <li>Ctrl + N: 创建与当前数据类型相同的数据</li>
            <li>Ctrl + Shift + C: 在应用内复制当前数据(直接数据或间接数据)；复制代码(图表)</li>
            <li>Ctrl + Shift + V: 黏贴并覆盖当前数据(直接数据或间接数据)</li>
            <li>Ctrl + Shift + D: 删除当前数据</li>
            <li>Tab : 页面中选择下一选项</li>
            <li>Shift + Tab : 页面中选择上一选项</li>
        </ul>
        <h2>更新</h2>
        <p>当仓库出现新的更新时，页面头部会出现咕咕提醒，点击即可跳转至最新仓库。</p>
    </div>
</template>
<style lang="less" scoped>
@import (css) './mainPageStyle.css';
</style>