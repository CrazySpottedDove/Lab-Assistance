<script setup>
import {useAllDataStore} from '../assets/stores'

const store = useAllDataStore()

</script>
<template>
    <!-- 有效数字视图 -->
    <div v-show="store.state.view.type === 'numberDoc'">
        <h2>1. 有效数字的修约原则</h2>
        <p>有效数字的修约遵循<em>四舍六入五凑偶</em>的原则：</p>
        <ul>
            <li>当修约的保留位后首位数字<strong>小于 5 </strong>时，舍去保留位之后的所有数字，保留位不变。例如：3.141 保留到 0.01 位，则修约到 3.14。</li>
            <li>当修约的保留位后首位数字<strong>大于 5</strong>，或<strong>等于 5 且后面还有非零数字</strong>时，舍去修约位置之后的所有数字，并将保留位的最后一位数加 1。例如：3.146 或 3.1451 保留到 0.01 位，则修约到 3.15。</li>
            <li>当修约的保留位后首位数字<strong>等于 5，且后面数字均为 0</strong>时，若保留位为偶数，则直接舍去保留位之后的所有数字；若保留位为奇数，则在舍去的基础上，保留位进一。例如：2.550
                保留到 0.1 位，则修约到 2.6；换成 2.650，则也修约到 2.6。</li>
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
            <li>乘、除法运算：结果的有效位数由所有参与运算的数中<strong>有效数字最少</strong>的决定，即取<strong>最少的位数</strong>。例如：4.56 × 2.4 = 11
                (保留2位有效数字)。
            </li>
            <li>混合运算：应按顺序逐步运算，并遵循每一步的运算规则。例如：(2.1 + 3.55) × 2.10 = 12 (在加法中，有效数字为2位)。</li>
            <li>在实际操作中，<strong>中间运算可不进行修约</strong>，只需保证最后结果的有效位数正确。</li>
            <li>关于<strong>精确数字</strong>，一般认为它的有效数字有<strong>无穷多位</strong>。但存在一个特殊情况：取 93.1 和 92.9 的平均值时，如果直接按无穷多位来算，结果应当是
                (93.1 + 92.9) / 2 = 186.0 / 2 =
                93.00。然而，可以发现，平均值的精度居然比原始数据的精度还高了，这显然是不合理的。此时，我们应考虑<strong>存疑数字</strong>，原始数据的存疑数字是 0.1 ，所以除以 2 后仍是 0.1
                ，因此结果是 93.0。 这个点比较隐蔽，不排除批改报告的老师没有注意到的情况。因此，<strong>保留时可以注明“依照存疑数字保留有效位数”</strong>。</li>
        </ul>
    </div>

    <!-- 不确定度视图 -->
    <div v-show="store.state.view.type === 'uncerDoc'">
        <h2>1. 不确定度的保留位数法则</h2>
        <p>不确定度的保留位数通常与测量结果的有效位数相对应，具体法则如下：</p>
        <ul>
            <li>修约法则：保留位后一位若不为 0，则进位。保留位后的数字一律舍去。</li>
            <li>当不确定度的<strong>第一位 ≥3 </strong>时，保留<strong>一位有效数字</strong>。例如，不确定度为 0.056，则修约为 0.06。</li>
            <li>当不确定度的<strong>第一位 =1,2</strong> 时，保留<strong>两位有效数字</strong>。例如，不确定度为 0.0120，则修约为 0.012。</li>
            <li>测量结果应<strong>与不确定度保留相同的小数位数</strong>。例如，测量值为 3.141，且不确定度为 0.06，则最终结果表示为 3.14 ± 0.06。</li>
            <li>需要注意的是，如果不确定度修约之后，第一位由 2变成了 3，则应保留一位有效数字。例如，不确定度为 0.291，则修约为 0.3。</li>
            <li>类似地，若修约之后，第一位由 9 变成了 1，则应保留两位有效数字。例如，不确定度为 0.91，则修约为 1.0。</li>
        </ul>

        <h2>2. 不确定度的合成方式</h2>
        <p>在多个测量值的运算中，不确定度的合成遵循以下公式：</p>
        <ul>
            <li>
                <strong>加法或减法：</strong>对于 <vue-latex expression="y = ax_1 + bx_2"></vue-latex> 或 <vue-latex
                    expression="y = ax_1 - bx_2"></vue-latex>，结果的合成不确定度为：
                <vue-latex expression="u_y=\sqrt{a^2u_{x_1}{}^2+b^2u_{x_2}{}^2}" display-mode></vue-latex>
            </li>
            <li><strong>乘法或除法：</strong>对于 <vue-latex expression="y = x_1{}^ax_2{}^b"></vue-latex> 或 <vue-latex
                    expression="y = \dfrac{x_1{}^a}{x_2{}^b}"></vue-latex>，结果的相对不确定度为：
                <vue-latex
                    expression="\frac{u_y}{y}=\sqrt{a^2\left(\frac{u_{x_1}}{x_1}\right)^2+b^2\left(\frac{u_{x_2}}{x_2}\right)^2}"
                    display-mode></vue-latex>
            </li>
            <li>总的来说，就是把微分在不同维度叠加。</li>
        </ul>
        <h2>3. 何时使用不确定度方式保留数字</h2>
        <p>不确定度是用来表示测量结果可能的误差的。凡是误差相关的量，都应按照不确定度方式保留数字。具体可见 <strong>参考：各项参数</strong>。</p>
    </div>

    <!-- 参数视图 -->
    <div v-show="store.state.view.type === 'propertyDoc'">
        <h2>斑鸠计算的各项参数的参考公式</h2>
        <ul>
            <li>
                平均值（按有效数字方式保留）
                <vue-latex expression="\bar{x}=\sum \frac{x_i}{n}" display-mode></vue-latex>
            </li>
            <li>
                相对误差（按不确定度方式保留）
                <vue-latex expression="\varepsilon_{r,x}=\left|\frac{x-x_{theory}}{x_{theory}}\right|"
                    display-mode></vue-latex>
            </li>
            <li>
                平均相对误差（按不确定度方式保留）
                <vue-latex expression="\overline{\varepsilon_{r,x}}=\sum\frac{\varepsilon_{r,x}}{n}"
                    display-mode></vue-latex>
            </li>
            <li>
                平均值与理论值的相对误差（按不确定度方式保留）
                <vue-latex expression="\Delta_{r,x}=\left|\frac{\bar{x}-x_{theory}}{x_{theory}}\right|"
                    display-mode></vue-latex>
            </li>
            <li>
                相对平均偏差（按不确定度方式保留）
                <vue-latex expression="\overline{\delta_{r,x}}=\sum\frac{|x_i-\bar{x}|}{n}" display-mode></vue-latex>
            </li>
            <li>
                标准偏差（按不确定度方式保留）
                <vue-latex expression="s_x=\sqrt{\sum\frac{(x_i-\bar{x})^2}{n-1}}" display-mode></vue-latex>
            </li>
            <li>
                相对标准偏差（按不确定度方式保留）
                <vue-latex expression="s_{r,x}=\frac{s_x}{\bar{x}}" display-mode></vue-latex>
            </li>
            <li>
                A类不确定度（按不确定度方式保留）
                <vue-latex expression="u_{A,x}=\frac{s_x}{\sqrt{n}}" display-mode></vue-latex>
            </li>
            <li>
                B类不确定度（按不确定度方式保留）
                <vue-latex expression="u_{B,x}=\frac{Δ_{equip_x}}{\sqrt{3}}" display-mode></vue-latex>
            </li>
            <li>
                不确定度（按不确定度方式保留）
                <vue-latex expression="u_x=\sqrt{u_{A,x}{}^2+u_{B,x}{}^2}" display-mode></vue-latex>
            </li>
            <li>
                最小二乘直线（按有效数字方式保留）
                <vue-latex expression="y=ax+b" display-mode></vue-latex>
                <vue-latex expression="a=\frac{\sum x_i y_i - n\bar{x} \bar{y}}{\sum x_i{}^2 - n \bar{x}^2}"
                    display-mode></vue-latex>
                <vue-latex expression="b=\bar{y} - a\bar{x}" display-mode></vue-latex>
                <vue-latex expression="R^2=\frac{\left(\sum (x_i - \bar{x})(y_i - \bar{y})\right)^2}{\sum (x_i - \bar{x})^2\sum (y_i - \bar{y})^2}"
                    display-mode></vue-latex>
            </li>
        </ul>
    </div>
</template>
<style lang="less" scoped>
@import (css) './mainPageStyle.css';
</style>