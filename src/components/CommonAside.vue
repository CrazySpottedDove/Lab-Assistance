<template>
    <div class="common-aside">
        <el-aside width="100%">
            <el-menu background-color="#626aef" :default-openeds="['0-1', '0-2','0-3', '1', '1-1', '1-2', '2', '3']">
                <el-sub-menu index="0">
                    <template #title>
                        <el-icon style="color: gainsboro;">
                            <setting></setting>
                        </el-icon>
                        <span style="color: gainsboro">设置</span>
                    </template>
                    <el-sub-menu index="0-1">
                        <template #title>
                            <span style="color: gainsboro!important;">文件保存策略</span>
                        </template>
                        <el-menu-item :class="{ 'selected': store.userConfig.autoSaveFile }"
                            @click="handleChangeAutoSaveFile(true)">自动保存</el-menu-item>
                        <el-menu-item :class="{ 'selected': !store.userConfig.autoSaveFile }"
                            @click="handleChangeAutoSaveFile(false)">手动保存</el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="0-2">
                        <template #title>
                            <span style="color: gainsboro!important;">输出语言</span>
                        </template>
                        <el-menu-item :class="{ 'selected': store.userConfig.language === 'chinese' }"
                            @click="handleChangeLanguage('chinese')">中文</el-menu-item>
                        <el-menu-item :class="{ 'selected': store.userConfig.language === 'english' }"
                            @click="handleChangeLanguage('english')">英文</el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="0-3">
                        <template #title>
                            <span style="color: gainsboro!important;">直接数据精度规则</span>
                        </template>
                        <el-menu-item :class="{ 'selected': store.userConfig.directDataLevelRule === 'unified' }"
                            @click="handleChangeLevelRule('unified')">统一精度</el-menu-item>
                        <el-menu-item :class="{ 'selected': store.userConfig.directDataLevelRule === 'nonUnified' }"
                            @click="handleChangeLevelRule('nonUnified')">不统一精度</el-menu-item>
                    </el-sub-menu>
                </el-sub-menu>
                <el-sub-menu index="1">
                    <template #title>
                        <span style="color: gainsboro!important;">数据管理</span>
                    </template>
                    <el-sub-menu index="1-1">
                        <template #title>
                            <span style="color: gainsboro!important;">直接数据</span>
                        </template>
                        <el-menu-item v-for="(item, index) of store.state.directDataList" @click="handleDirectDataSelection(index)"
                            :class="{ 'selected': store.state.view.type === 'directData' && store.state.view.index === index }">
                            <span style="width: 120px;">
                                <el-input v-model="item.title"
                                    v-if="store.state.view.type === 'directData' && store.state.view.index === index"></el-input>
                                <vue-latex class="sidetitle" :expression="item.title" v-else></vue-latex>
                            </span>
                            <span>
                                <el-icon @click.stop="handleDeleteDirectData(index)" class="deleteicon el-icon--right">
                                    <circle-close></circle-close>
                                </el-icon>
                            </span>
                        </el-menu-item>
                        <el-menu-item class="mybutton" @click="handleAddDirectData()">
                            添加数据
                        </el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="1-2">
                        <template #title>
                            <span style="color: gainsboro!important;">间接数据</span>
                        </template>
                        <el-menu-item v-for="(item, index) of store.state.indirectDataList"
                            @click="handleIndirectDataSelection(index)"
                            :class="{ 'selected': store.state.view.type === 'indirectData' && store.state.view.index === index}">
                            <span style="width: 120px;">
                                <el-input v-model="item.title"
                                    v-if="store.state.view.type === 'indirectData' && store.state.view.index === index"></el-input>
                                <vue-latex class="sidetitle" :expression="item.title" v-else></vue-latex>
                            </span>
                            <span>
                                <el-icon @click.stop="handleDeleteIndirectData(index)"
                                    class="deleteicon el-icon--right">
                                    <circle-close></circle-close>
                                </el-icon>
                            </span>
                        </el-menu-item>
                        <el-menu-item class="mybutton" @click="handleAddIndirectData()">
                            添加数据
                        </el-menu-item>
                    </el-sub-menu>
                </el-sub-menu>
                <el-sub-menu index="2">
                    <template #title>
                        <span style="color: gainsboro!important;">LaTeX制表</span>
                    </template>
                    <el-menu-item v-for="(table, index) of store.state.tableList" @click="handleTableSelection(index)"
                        :class="{ 'selected': store.state.view.type === 'table' && store.state.view.index === index }">
                        表{{ index + 1 }}
                        <span style="width: 58%;"></span>
                        <span>
                            <el-icon @click="handleDeleteTable(index)" class="deleteicon el-icon--right">
                                <circle-close></circle-close>
                            </el-icon>
                        </span>
                    </el-menu-item>
                    <el-menu-item class="mybutton" @click="handleAddTable()">
                        添加表格
                    </el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="3">
                    <template #title>
                        <span style="color: gainsboro!important;">LaTeX制图</span>
                    </template>
                    <el-menu-item v-for="(graph, index) of store.state.graphList" @click="handleGraphSelection(index)"
                        :class="{ 'selected': store.state.view.type === 'graph' && store.state.view.index === index }">
                        图{{ index + 1 }}
                        <span style="width: 58%;"></span>
                        <span>
                            <el-icon @click="handleDeleteGraph(index)" class="deleteicon el-icon--right">
                                <circle-close></circle-close>
                            </el-icon>
                        </span>
                    </el-menu-item>
                    <el-menu-item class="mybutton" @click="handleAddGraph()">
                        添加图
                    </el-menu-item>
                </el-sub-menu>
                <el-menu-item index="4" @click="handleSelectReadme"
                    :class="{ 'selected': store.state.view.type === 'readme' }">使用指南</el-menu-item>
                <el-sub-menu index="5">
                    <template #title>
                        <span style="color: gainsboro!important;">参考</span>
                    </template>
                    <el-menu-item index="5-1" @click="handleSelectNumberDoc"
                        :class="{ 'selected': store.state.view.type === 'numberDoc' }">参考：有效数字</el-menu-item>
                    <el-menu-item index="5-2" @click="handleSelectUncerDoc"
                        :class="{ 'selected': store.state.view.type === 'uncerDoc' }">参考：不确定度</el-menu-item>
                    <el-menu-item index="5-3" @click="handleSelectPropertyDoc"
                        :class="{ 'selected': store.state.view.type === 'propertyDoc' }">参考：各项参数</el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
    </div>
</template>
<script setup>
import { CircleClose, Setting } from '@element-plus/icons-vue';
import { useAllDataStore } from '../assets/stores';
import 'katex/dist/katex.css'
// 不要引入expression.js，否则会引入mathjs，导致latex无法渲染
// 引入katex下的自动渲染函数
async function saveUserConfig() {
    const { saveUserConfig } = await import('../../supplement/arrangeFile.js')
    saveUserConfig(store.userConfig)
}

const store = useAllDataStore()

//修改配置文件中的保存选项
const handleChangeAutoSaveFile = (flag) => {
    store.userConfig.autoSaveFile = flag
    saveUserConfig()
}

// 修改配置文件中的语言选项
const handleChangeLanguage = (language) => {
    store.userConfig.language = language
    saveUserConfig()
}

/**修改配置文件中的直接数据精度规则 */
const handleChangeLevelRule = (levelRule) => {
    store.userConfig.directDataLevelRule = levelRule
    saveUserConfig()
}
const handleDirectDataSelection = (index) => {
    store.Select.directData(index)
}

const handleIndirectDataSelection = (index) => {
    store.Select.indirectData(index)
}

const handleTableSelection = (index) => {
    store.Select.table(index)
}

const handleGraphSelection = (index) => {
    store.Select.graph(index)
}

const handleDeleteDirectData = (index) => {
    store.Delete.directData(index)
}

const handleDeleteIndirectData = (index) => {
    store.Delete.indirectData(index)
}

const handleDeleteTable = (index) => {
    store.Delete.table(index)
}
const handleDeleteGraph = (index) => {
    store.Delete.graph(index)
}

const handleAddDirectData = () => {
    store.Add.directData()
}
const handleAddIndirectData = () => {
    store.Add.indirectData()
}
const handleAddTable = () => {
    store.Add.table()
}
const handleAddGraph = () => {
    store.Add.graph()
}

const handleSelectReadme = () => {
    store.Select.readme()
}

const handleSelectNumberDoc = () => {
    store.Select.numberDoc()
}

const handleSelectUncerDoc = () => {
    store.Select.uncerDoc()
}

const handleSelectPropertyDoc = () => {
    store.Select.propertyDoc()
}



</script>
<style lang="less" scoped>
.el-menu {
    border-right: none;
    font-weight: bold;

    .el-menu-item {
        line-height: 48px;
        color: gainsboro;
        text-align: center !important;
        width: 100%;
    }
}

.el-aside {
    height: 100%;
    background-color: #626aef;
}

.common-aside {
    width: 13vw;
    min-width: 200px;
    color: gainsboro;
}

.deleteicon:hover {
    color: red;
}

.mybutton:focus {
    background-color: rgba(0, 0, 0, 0);
}

.mybutton:active {
    background-color: gray;
}

.selected {
    background-color: #1520f5 !important;
    color: aliceblue;
}

:deep(.el-input__inner) {
    text-align: center;
}

.copytarget {
    background-color: rgb(52, 11, 78);
}

.sidetitle {
    font-size: small !important;
}
</style>