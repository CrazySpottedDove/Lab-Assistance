<template>
    <div class="common-aside">
        <el-aside width="100%">
            <el-menu :background-color="props.elmenuBackgroundColor"
                :default-openeds="['0-1', '0-2', '0-3', '0-4', '0-5', '0-6', '1', '2', '3', '4', '6']">
                <!-- 用户配置 -->
                <el-sub-menu index="0">
                    <template #title>
                        <el-icon style="color: gainsboro;">
                            <setting></setting>
                        </el-icon>
                        <span style="color: gainsboro">设置</span>
                    </template>
                    <el-sub-menu index="0-1" class="sideheader">
                        <template #title>
                            <span style="color: gainsboro!important;">文件保存策略</span>
                        </template>
                        <el-menu-item :class="{ 'selected': store.userConfig.autoSaveFile === true, 'item': true }"
                            @click="handleChangeUserConfig('autoSaveFile', true)">自动保存</el-menu-item>
                        <el-menu-item :class="{ 'selected': store.userConfig.autoSaveFile === false }"
                            @click="handleChangeUserConfig('autoSaveFile', false)">手动保存</el-menu-item>
                        <el-menu-item :class="{ 'selected': store.userConfig.saveByDate === true }"
                            @click="handleChangeUserConfig('saveByDate', true)">按日期保存</el-menu-item>
                        <el-menu-item :class="{ 'selected': store.userConfig.saveByDate === false }"
                            @click="handleChangeUserConfig('saveByDate', false)">不按日期保存</el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="0-2" class="sideheader">
                        <template #title>
                            <span style="color: gainsboro!important;">更新策略</span>
                        </template>
                        <el-menu-item :class="{ 'selected': store.userConfig.newVersionTips === true }"
                            @click="handleChangeUserConfig('newVersionTips', true)">推送新版本</el-menu-item>
                        <el-menu-item :class="{ 'selected': store.userConfig.newVersionTips === false }"
                            @click="handleChangeUserConfig('newVersionTips', false), handleChangeUserConfig('autoUpdate', false)">不推送新版本</el-menu-item>
                        <el-menu-item :class="{ 'selected': store.userConfig.autoUpdate === true }"
                            @click="handleChangeUserConfig('autoUpdate', true), handleChangeUserConfig('newVersionTips', true)">自动拉取更新</el-menu-item>
                        <el-menu-item :class="{ 'selected': store.userConfig.autoUpdate === false }"
                            @click="handleChangeUserConfig('autoUpdate', false)">不自动拉取更新</el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="0-3" class="sideheader">
                        <template #title>
                            <span style="color: gainsboro!important;">直接数据精度规则</span>
                        </template>
                        <el-menu-item :class="{ 'selected': store.userConfig.directDataLevelRule === 'unified' }"
                            @click="handleChangeUserConfig('directDataLevelRule', 'unified')">统一精度</el-menu-item>
                        <el-menu-item :class="{ 'selected': store.userConfig.directDataLevelRule === 'nonUnified' }"
                            @click="handleChangeUserConfig('directDataLevelRule', 'nonUnified')">不统一精度</el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="0-4" class="sideheader">
                        <template #title>
                            <span style="color: gainsboro!important;">间接数据单位</span>
                        </template>
                        <el-menu-item :class="{ 'selected': store.userConfig.autoCalcUnit === true }"
                            @click="handleChangeUserConfig('autoCalcUnit', true)">自动计算</el-menu-item>
                        <el-menu-item :class="{ 'selected': store.userConfig.autoCalcUnit === false }"
                            @click="handleChangeUserConfig('autoCalcUnit', false)">不自动计算</el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="0-5" class="sideheader">
                        <template #title>
                            <span style="color: gainsboro!important;">图表输出语言</span>
                        </template>
                        <el-menu-item :class="{ 'selected': store.userConfig.language === 'chinese' }"
                            @click="handleChangeUserConfig('language', 'chinese')">中文</el-menu-item>
                        <el-menu-item :class="{ 'selected': store.userConfig.language === 'english' }"
                            @click="handleChangeUserConfig('language', 'english')">英文</el-menu-item>
                    </el-sub-menu>
                    <el-sub-menu index="0-6" class="sideheader">
                        <template #title>
                            <span style="color: gainsboro!important;">图表边框</span>
                        </template>
                        <el-menu-item :class="{ 'selected': store.userConfig.framed === true }"
                            @click="handleChangeUserConfig('framed', true)">有</el-menu-item>
                        <el-menu-item :class="{ 'selected': store.userConfig.framed === false }"
                            @click="handleChangeUserConfig('framed', false)">无</el-menu-item>
                    </el-sub-menu>
                </el-sub-menu>
                <!--  直接数据与间接数据-->

                <el-sub-menu index="1" class="sideheader">
                    <template #title>
                        <span style="color: gainsboro!important;">直接数据</span>
                    </template>
                    <el-menu-item v-for="(item, index) of store.state.directDataList"
                        @click="handleSelect('directData', index)"
                        :class="{ 'selected': store.state.view.type === 'directData' && store.state.view.index === index }">
                        <span style="width: 140px;">
                            <el-input v-model="item.title"
                                v-if="store.state.view.type === 'directData' && store.state.view.index === index"></el-input>
                            <vue-latex class="sidetitle" :expression="titleFormat(item.title)" v-else></vue-latex>
                        </span>
                        <span>
                            <el-icon @click.stop="handleDelete('directData', index)" class="deleteicon el-icon--right">
                                <circle-close></circle-close>
                            </el-icon>
                        </span>
                    </el-menu-item>
                    <el-menu-item class="mybutton" @click="handleAdd('directData')">
                        添加数据
                    </el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="2" class="sideheader">
                    <template #title>
                        <span style="color: gainsboro!important;">间接数据</span>
                    </template>
                    <el-menu-item v-for="(item, index) of store.state.indirectDataList"
                        @click="handleSelect('indirectData', index)"
                        :class="{ 'selected': store.state.view.type === 'indirectData' && store.state.view.index === index }">
                        <span style="width: 140px;">
                            <el-input v-model="item.title"
                                v-if="store.state.view.type === 'indirectData' && store.state.view.index === index"></el-input>
                            <vue-latex class="sidetitle" :expression="titleFormat(item.title)" v-else></vue-latex>
                        </span>
                        <span>
                            <el-icon @click.stop="handleDelete('indirectData', index)"
                                class="deleteicon el-icon--right">
                                <circle-close></circle-close>
                            </el-icon>
                        </span>
                    </el-menu-item>
                    <el-menu-item class="mybutton" @click="handleAdd('indirectData')">
                        添加数据
                    </el-menu-item>
                </el-sub-menu>
                <!-- 制表 -->
                <el-sub-menu index="3" class="sideheader">
                    <template #title>
                        <span style="color: gainsboro!important;">LaTeX 制表</span>
                    </template>
                    <el-menu-item v-for="(table, index) of store.state.tableList" @click="handleSelect('table', index)"
                        :class="{ 'selected': store.state.view.type === 'table' && store.state.view.index === index }">
                        表{{ index + 1 }}
                        <span style="width: 90pt;"></span>
                        <span>
                            <el-icon @click="handleDelete('table', index)" class="deleteicon el-icon--right">
                                <circle-close></circle-close>
                            </el-icon>
                        </span>
                    </el-menu-item>
                    <el-menu-item class="mybutton" @click="handleAdd('table')">
                        添加表格
                    </el-menu-item>
                </el-sub-menu>
                <!-- 制图 -->
                <el-sub-menu index="4" class="sideheader">
                    <template #title>
                        <span style="color: gainsboro!important;">LaTeX 制图</span>
                    </template>
                    <el-menu-item v-for="(graph, index) of store.state.graphList" @click="handleSelect('graph', index)"
                        :class="{ 'selected': store.state.view.type === 'graph' && store.state.view.index === index }">
                        图{{ index + 1 }}
                        <span style="width: 90pt;"></span>
                        <span>
                            <el-icon @click="handleDelete('graph', index)" class="deleteicon el-icon--right">
                                <circle-close></circle-close>
                            </el-icon>
                        </span>
                    </el-menu-item>
                    <el-menu-item class="mybutton" @click="handleAdd('graph')">
                        添加图
                    </el-menu-item>
                </el-sub-menu>
                <!-- readme -->
                <el-menu-item index="5" @click="handleSelect('readme')"
                    :class="{ 'selected': store.state.view.type === 'readme' }">使用指南
                </el-menu-item>
                <!-- 参考 -->
                <el-sub-menu index="6" class="sideheader">
                    <template #title>
                        <span style="color: gainsboro!important;">参考</span>
                    </template>
                    <el-menu-item index="6-1" @click="handleSelect('numberDoc')"
                        :class="{ 'selected': store.state.view.type === 'numberDoc' }">参考：有效数字</el-menu-item>
                    <el-menu-item index="6-2" @click="handleSelect('uncerDoc')"
                        :class="{ 'selected': store.state.view.type === 'uncerDoc' }">参考：不确定度</el-menu-item>
                    <el-menu-item index="6-3" @click="handleSelect('propertyDoc')"
                        :class="{ 'selected': store.state.view.type === 'propertyDoc' }">参考：各项参数</el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
    </div>
</template>
<script setup>
import { CircleClose, Setting } from '@element-plus/icons-vue';
import { useAllDataStore } from '../assets/stores';
import { titleFormat } from '../assets/format.js';
// 不要引入expression.js，否则会引入mathjs，导致latex无法渲染
const props = defineProps({
    elmenuBackgroundColor: String
})
async function saveUserConfig() {
    const { saveUserConfig } = await import('../../supplement/arrangeFile.js')
    saveUserConfig(store.userConfig)
}

const store = useAllDataStore()

/**修改用户配置 */
const handleChangeUserConfig = (key, value) => {
    store.userConfig[key] = value
    saveUserConfig()
}

/**处理选择事件 */
const handleSelect = (key, index) => {
    if (index === undefined) {
        store.Select[key]()
    } else {
        store.Select[key](index)
    }
}

/**处理删除事件 */
const handleDelete = (key, index) => {
    store.Delete[key](index)
}

/**处理添加事件 */
const handleAdd = (key) => {
    store.Add[key]()
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
    color: aliceblue;
}

:deep(.el-input__inner) {
    text-align: center;
}

.sidetitle {
    font-size: small !important;
}
</style>