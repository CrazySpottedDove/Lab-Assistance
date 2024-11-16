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
        <p>单位（如 <vue-latex expression="\mathrm{kg*m/s2}"></vue-latex> ）只会影响 <vue-latex expression='\LaTeX'></vue-latex>
            制作图表，不参与计算。处理器会自动处理 <vue-latex expression="*,\ /"></vue-latex> 和数字上标，也包括 μ，°，℃ 这几个不常见字符。</p>
        <h2>间接数据</h2>
        <p>间接数据通过计算式得到。算式中支持的算符如下：</p>
        <ul>
            <li>基本运算符号 <vue-latex expression="+,\ -,\ *,\ /,\ ()"></vue-latex> </li>
            <li>对数与指数函数 <vue-latex expression="\ln(),\ \lg(),\ \^{}"></vue-latex> </li>
            <li>采用弧度制的三角函数 <vue-latex expression="\sin(),\ \cos(),\ \tan()"></vue-latex> 与反三角函数 <vue-latex
                    expression="\mathrm{asin(),\ acos(),\ atan()}"></vue-latex> </li>
            <li>其它函数 <vue-latex expression="\mathrm{sqrt(),\ abs()}"></vue-latex> </li>
        </ul>
        <p>数据参与构成计算式前，需要先在侧栏处为数据<em>命名</em>。数据名支持 <vue-latex expression="\LaTeX"></vue-latex>
            渲染。一般来说，建议把中文部分放在数据的<em>含义</em>内容中。
        </p>
        <p>tips: 如果想偷懒， <vue-latex expression="a1,\ b1,2"></vue-latex>
            都是合法的命名，因为字母后的数字会<em>自动识别成下标。</em></p>
        <p>示例：有直接数据 <vue-latex expression="a,\ b,\ c,\ d"></vue-latex> ，可写计算式 <vue-latex
                expression="(a+b)*c/d/9.8"></vue-latex> 。</p>
        <p>运算式中的所有数字会被处理器当作确数，它会按照<em>存疑数字原则</em>保留计算结果的有效数字。</p>
        <p>确定计算方式和计算式后，<em>点击刷新</em>，即可获得最新的间接数据。</p>
        <p>处理器会自动根据计算式求出间接数据的不确定度。请确保依赖的直接数据的不确定度正确。</p>
        <h2>设置</h2>
        <ul>
            <li><em>文件保存策略</em>： 无论手动还是自动，数据的保存路径都是 <vue-latex
                    expression="\text{package.nw}"></vue-latex>(<vue-latex expression="\text{mac}"></vue-latex>
                用户为 <vue-latex expression="\text{app.nw}"></vue-latex>)
                同级目录
                <vue-latex expression="\text{user}"></vue-latex> 下的 <vue-latex
                    expression="\text{data}"></vue-latex>
                目录。<em>自动保存</em>时，数据实时保存；<em>手动保存</em>时，只有 Ctrl + S
                或者点击保存图标才会保存。<em>按日期保存</em>时，会额外生成对应日期的保存目录，<em>不按日期保存</em>则反之。
            </li>
            <li><em>输出语言</em>： 决定了制表和制图时一些默认注释的语言。</li>
            <li><em>直接数据精度规则</em>：决定了直接数据默认的精度规则。</li>
            <li><em>图表边框</em>： 决定了制作图表时默认 带/不带 边框。</li>
            <li><em>推送新版本</em>：如果为“是”，当仓库出现新的更新时，页面头部会出现咕咕提醒，点击即可跳转至最新仓库。</li>
            <li><em>自动计算单位</em>：如果为“是”，当刷新间接数据且倍率为 1 时，将会根据直接数据的单位推断间接数据的单位。</li>
            <li><em>主题</em>用于切换亮暗模式（也可在头栏处切换）。</li>
            <li><em>自动更新</em>在推送新版本为“是”且自动更新为“是”时生效，启动时自动检验版本并拉取更新。</li>
            <li>所有设置被保存在 <vue-latex expression="\text{package.nw}"></vue-latex>(<vue-latex
                    expression="\text{mac}"></vue-latex> 用户为 <vue-latex expression="\text{app.nw}"></vue-latex>)
                同级目录 <vue-latex expression="\text{user}"></vue-latex> 下的 <vue-latex
                    expression="\text{config}"></vue-latex>
                目录中。</li>
        </ul>
        <h2> <vue-latex expression="\LaTeX"></vue-latex> 制表</h2>
        <p>选择表格数据，即生成对应表格的 <vue-latex expression="\LaTeX"></vue-latex> 代码。点击全选，可以选中当前的所有数据。点击清空，可以删除当前表格的数据。</p>
        <p>如果表格内容与数据无法对应，可以尝试点击刷新键。</p>
        <p> <vue-latex expression="\LaTeX"></vue-latex> 代码的依赖同时包含制表和制图的依赖。因此，<em>只需复制一次</em>即可。</p>
        <p>间接数据的计算公式会自动出现在图表注释中。</p>
        <h2> <vue-latex expression="\LaTeX"></vue-latex> 制图</h2>
        <p>为数据命名后，即可通过选择数据与制图方法获得 <vue-latex expression="\LaTeX"></vue-latex> 代码。在这里，依赖的内容与 <vue-latex
                expression="\LaTeX"></vue-latex>
            制表处相同。
        </p>
        <p>在最小二乘直线斜率的有效数字方面，使用 x 数据集中最大的有效位数、 y 数据集中最大的有效位数中的最小者。</p>
        <p>如果代码没有成功生成，可以尝试点击刷新键。</p>
        <h2>保存与读取</h2>
        <p>点击标题右侧的第一个图标，可以保存当前内容为一个 <vue-latex expression="\mathrm{json}"></vue-latex> 文件。之后打开时，可以点击标题右侧的第二个图标，打开对应的
            <vue-latex expression="\mathrm{json}"></vue-latex> 文件。
        </p>
        <h2>参考</h2>
        <p>时有忘记各种计算方法的时候，所以留了三个参考，方便查阅。</p>
        <h2>快捷键</h2>
        <ul>
            <li> <vue-latex expression="\mathrm{Alt/Option + W}"></vue-latex> :选择已有数据或图表中往上一个</li>
            <li> <vue-latex expression="\mathrm{Alt/Option + S}"></vue-latex> : 选择已有数据或图表中往下一个</li>
            <li> <vue-latex expression="\mathrm{Ctrl + D}"></vue-latex> : 创建一个新的直接数据</li>
            <li> <vue-latex expression="\mathrm{Ctrl + I}"></vue-latex> : 创建一个新的间接数据</li>
            <li> <vue-latex expression="\mathrm{Ctrl + T}"></vue-latex> : 创建一个新的表格</li>
            <li> <vue-latex expression="\mathrm{Ctrl + G}"></vue-latex> : 创建一个新的图</li>
            <li> <vue-latex expression="\mathrm{Ctrl + S}"></vue-latex> : 保存当前数据</li>
            <li> <vue-latex expression="\mathrm{Ctrl + O}"></vue-latex> : 打开已有数据</li>
            <li> <vue-latex expression="\mathrm{Ctrl + N}"></vue-latex> : 创建与当前数据类型相同的数据</li>
            <li> <vue-latex expression="\mathrm{Ctrl + Shift + C}"></vue-latex> : 在应用内复制当前数据(直接数据或间接数据)；复制代码(图表)
            </li>
            <li> <vue-latex expression="\mathrm{Ctrl + Shift + V}"></vue-latex> : 黏贴并覆盖当前数据(直接数据或间接数据)</li>
            <li> <vue-latex expression="\mathrm{Ctrl + Shift + D}"></vue-latex> : 删除当前数据</li>
            <li> <vue-latex expression="\mathrm{Tab}"></vue-latex> : 页面中选择下一选项</li>
            <li> <vue-latex expression="\mathrm{Shift + Tab}"></vue-latex> : 页面中选择上一选项</li>
        </ul>
    </div>
</template>
<style lang="less" scoped>
@import (css) './mainPageStyle.css';
</style>