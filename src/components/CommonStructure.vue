<script setup>
import CommonHeader from './CommonHeader.vue';
import CommonAside from './CommonAside.vue';
import MainPage from '../views/MainPage.vue'
import { useAllDataStore } from '../assets/stores';
import { computed, watch, ref } from 'vue';
const store = useAllDataStore()
const elmenuBackgroundColor = ref('#626aef')

const theme = computed(() => {
    switch (store.userConfig.theme) {
        case 'light':
            document.documentElement.style.setProperty('--text-color', '#242424')
            document.documentElement.style.setProperty('--background-color', '#f5f5f5')
            document.documentElement.style.setProperty('--header-color', 'dimgrey')
            document.documentElement.style.setProperty('--h2-color', '#2c3e50')
            document.documentElement.style.setProperty('--h2-line-color', '#3498db')
            document.documentElement.style.setProperty('--el-aside-background-color', '#626aef')
            document.documentElement.style.setProperty('--selected-background-color', '#1520f5')
            document.documentElement.style.setProperty('--strong-color', '#626aef')
            document.documentElement.style.setProperty('--elcard-background-color', 'white')
            document.documentElement.style.setProperty('--eltable-hover-color', 'rgb(199, 216, 244)')
            document.documentElement.style.setProperty('--input-background-color', 'white')
            document.documentElement.style.setProperty('--input-color', '#242424')
            document.documentElement.style.setProperty('--placeholder-color', '#606266')
            document.documentElement.style.setProperty('--elselect-hovered-color', '#f5f7fa')
            document.documentElement.style.setProperty('--border-color', '#dcdfe6')
            document.documentElement.style.setProperty('--eltable-border-color', '#dcdfe6')
            elmenuBackgroundColor.value = "#626aef"
            break;
        case 'dark':
            document.documentElement.style.setProperty('--text-color', '#e1e1e1')
            document.documentElement.style.setProperty('--background-color', '#242424')
            document.documentElement.style.setProperty('--header-color', '#e1e1e1')
            document.documentElement.style.setProperty('--h2-color', 'rgb(0, 210, 151)')
            document.documentElement.style.setProperty('--h2-line-color', 'rgb(0,210,151)')
            document.documentElement.style.setProperty('--el-aside-background-color', 'rgb(16,87,90)')
            document.documentElement.style.setProperty('--selected-background-color', 'rgb(7,152,175)')
            document.documentElement.style.setProperty('--strong-color', 'rgb(57, 255, 255)')
            document.documentElement.style.setProperty('--elcard-background-color', 'rgb(34,39,37)')
            document.documentElement.style.setProperty('--eltable-hover-color', 'rgb(60, 86, 80)')
            document.documentElement.style.setProperty('--input-background-color', '#242424')
            document.documentElement.style.setProperty('--input-color', '#e1e1e1')
            document.documentElement.style.setProperty('--placeholder-color', 'rgb(165,165,165)')
            document.documentElement.style.setProperty('--elselect-hovered-color', 'rgb(60,86,80)')
            document.documentElement.style.setProperty('--border-color', 'rgb(80,80,80)')
            document.documentElement.style.setProperty('--eltable-border-color', 'rgb(85,85,85)')
            elmenuBackgroundColor.value = "rgb(16,87,90)"
            break;
    }
})
// 这里的用法比较奇怪，使用computed属性来调整css变量，并使用watch来强制这些调整生效
watch(theme, () => { })



</script>
<template>

    <div class="common-layout">
        <el-container class="lay-container">
            <common-aside :elmenuBackgroundColor="elmenuBackgroundColor" />
            <el-container>
                <el-header class="el-header">
                    <common-header />
                </el-header>
                <el-main class="right-main">
                    <main-page></main-page>
                </el-main>
            </el-container>
        </el-container>
    </div>

</template>
<style lang="less">
.common-layout,
.lay-container {
    height: 100%;
}

.el-header {
    width: 87vw;
    height: 8vh;
}

.common-layout {
    color: rgb(34, 39, 37);
    color: var(--text-color);
    background-color: var(--background-color);

    .header {
        color: var(--header-color);
    }

    h2 {
        color: var(--h2-color);
        border-bottom: 2px solid var(--h2-line-color);
    }

    .el-aside {
        background-color: var(--el-aside-background-color);
    }

    .selected {
        background-color: var(--selected-background-color) !important;
    }

    strong {
        color: var(--strong-color);
    }

    .el-card {
        background-color: var(--elcard-background-color);
        --el-card-border-color:var(--border-color);
    }

    .el-table {
        background-color: var(--elcard-background-color);
        --el-table-row-hover-bg-color: var(--eltable-hover-color);
        --el-table-border:1px solid var(--eltable-border-color);
        thead {
            color: var(--tableheader-color);
        }
    }
    .el-table__inner-wrapper:before{
        background-color: var(--border-color);
    }
    input {
        color: var(--input-color);
        background-color: var(--input-background-color);
    }

    .el-input__wrapper {
        color: var(--input-color);
        background-color: var(--input-background-color);
        box-shadow: 0 0 0 1px var(--border-color) inset;
    }

    .el-select {
        color: var(--input-color);
        background-color: var(--input-background-color);

        .el-select__wrapper {
            background-color: var(--input-background-color);
        }
    }

    .el-button {
        color: var(--input-color);
        background-color: var(--input-background-color);
    }

    .el-switch {
        --el-switch-on-color: var(--strong-color);
    }

    .el-switch__label {
        &--left {
            color: var(--input-color);
        }

        &--right {
            color: var(--strong-color);
        }
    }

    input::input-placeholder {
        color: var(--placeholder-color);
    }

    input::-webkit-input-placeholder {
        color: var(--placeholder-color);
    }

    .el-select__placeholder {
        color: var(--placeholder-color);
    }

    .el-select-dropdown__item {
        color: var(--input-color);
        background-color: var(--input-background-color);
    }

    .el-scrollbar__view {
        color: var(--input-color);
        background-color: var(--input-background-color);
    }
}

.el-select-dropdown__item {
    color: var(--input-color);
    background-color: var(--input-background-color);
}

.el-scrollbar__view {
    color: var(--input-color);
    background-color: var(--input-background-color);
}

.el-select-dropdown__item.is-hovering {
    background-color: var(--elselect-hovered-color);
}

.el-cascader-node:not(.is-disabled):hover {
    background-color: var(--elselect-hovered-color);
}
</style>