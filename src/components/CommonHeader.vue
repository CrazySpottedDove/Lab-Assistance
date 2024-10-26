<template>
    <div class="header">
        <span style="text-align: center; width: 100%; font-weight: bold; font-size: larger;">普物实验数据处理小助手
            <el-icon class="saveicon el-icon--right" @click="handleFileSave">
                <folder-checked></folder-checked>
            </el-icon>
            <el-icon class="saveicon el-icon--right" @click="handleFileLoad">
                <folder-opened></folder-opened>
            </el-icon>
            <span v-show="updateUrl !== null">
                <a :href="updateUrl" target="_blank">
                    &nbsp;<img src="../assets/logo.jpg" alt="" style="width: 20pt; height: auto;"><sup>!</sup>
                </a>
            </span>
        </span>
    </div>
</template>
<script setup>
import { FolderChecked, FolderOpened } from '@element-plus/icons-vue';
import { useAllDataStore } from '../assets/stores';
import { ref, watch } from 'vue'
import { fetchLatestVersionUrl } from '../assets/versionTips.js';

async function readUserConfig() {
    const { readUserConfig } = await import('../../supplement/arrangeFile.js')
    store.userConfig = readUserConfig()
}

async function saveStateOnExit(state, userConfig) {
    const { saveStateOnExit } = await import('../../supplement/arrangeFile.js')
    saveStateOnExit(state, userConfig)
}

async function openFile(state) {
    const { openFile } = await import('../../supplement/arrangeFile.js')
    openFile(state)
}

const store = useAllDataStore()

const updateUrl = ref(null)


/**读取用户配置 */
readUserConfig()
    .then(() => {
        console.log('read user config')
        console.log(store.userConfig)
    })
    .catch((error) => {
        console.error("Error reading user config:", error);
    })
    .finally(() => {
        /**如有最新版本，获取最新版本的url */
        fetchLatestVersionUrl(store.userConfig.newVersionTips)
            .then((url) => {
                if (url !== null) {
                    updateUrl.value = url
                }
            })
            .catch((error) => {
                console.error("Error handling result:", error);
            });
    })

/**显式保存文件 */
const handleFileSave = () => {
    saveStateOnExit(store.state, store.userConfig)
    ElMessage.success("文件已保存")
}

/**处理文件加载 */
const handleFileLoad = () => {
    openFile(store.state)
}

watch(store.state, (newState) => {
    console.log('detect change, save file')
    console.log(newState)
    if (store.userConfig.autoSaveFile) {
        saveStateOnExit(newState, store.userConfig)
    }
}, { deep: true })

</script>
<style lang="less" scoped>
.header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    color: dimgrey;
}

.r-content {
    .user {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
}

.l-content {
    display: flex;
    align-items: center;
}

.saveicon:hover {
    color: lawngreen
}

.saveicon {
    cursor: pointer;
}

sup {
    vertical-align: top;
    font-size: smaller;
    line-height: 0;
}
</style>