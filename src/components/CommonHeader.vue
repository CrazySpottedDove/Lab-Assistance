<template>
    <div class="header">
        <div style="text-align: center; width: 100%; font-weight: bold; font-size: larger;">
            <a href="https://github.com/CrazySpottedDove/Lab-Assistance" style="position: relative; top: 12px;"><img src="../assets/images/favicon.ico" alt="GitHub"
                    style="width: 40px;"></a>
            Lab-Assistance {{
            currentVersion }}
            <el-icon class="saveicon el-icon--right" @click="handleFileSave">
                <folder-checked></folder-checked>
            </el-icon>
            <el-icon class="saveicon el-icon--right" @click="handleFileLoad">
                <folder-opened></folder-opened>
            </el-icon>
            <el-icon class="saveicon el-icon--right" v-show="store.userConfig.theme === 'light'"
                @click="handleThemeChange('dark')">
                <sunny></sunny>
            </el-icon>
            <el-icon class="saveicon el-icon--right" v-show="store.userConfig.theme === 'dark'"
                @click="handleThemeChange('light')">
                <moon></moon>
            </el-icon>
            <span v-show="updateUrl !== null">
                <a :href="updateUrl" target="_blank" @click="handleUpdateVersion">
                    &nbsp;<img src="../assets/images/logo.jpg" alt="" style="width: 20pt; height: auto;"><sup>!</sup>
                </a>
                <sup style="font-size: small;">&nbsp;落后{{ behind }}个版本</sup>
            </span>
        </div>

    </div>
</template>
<script setup>
import { FolderChecked, FolderOpened, Sunny, Moon } from '@element-plus/icons-vue';
import { useAllDataStore } from '../assets/stores';
import { ref, watch } from 'vue'
import { fetchLatestVersionUrl, currentVersion } from '../assets/versionTips.js';
import { ElMessage } from 'element-plus';

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

async function saveUserConfig(userConfig) {
    const { saveUserConfig } = await import('../../supplement/arrangeFile.js')
    saveUserConfig(userConfig)
}

async function updateVersion() {
    const { updateVersion } = await import('../../supplement/arrangeUpdate.js')
    updateVersion()
}

async function handleUpdateVersion() {
    try {
        await updateVersion()
        ElMessage.success({ message: '检测到新版本，正在为您拉取更新─=≡Σ((( つ•̀ω•́)つ', duration: 10000 })
    }
    catch (error) {
        ElMessage.error('更新失败，请检查网络连接(◞‸◟)')
        console.error("Error handling update:", error);
    }
}

const store = useAllDataStore()

const updateUrl = ref(null)
const behind = ref(0)

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
            .then((obj) => {
                if (obj !== null) {
                    updateUrl.value = obj.url
                    behind.value = obj.behind
                    if (store.userConfig.autoUpdate) {
                        handleUpdateVersion()
                    }
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

const handleThemeChange = (theme) => {
    store.userConfig.theme = theme
    saveUserConfig(store.userConfig)
}
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