<script setup>
import CommonHeader from './CommonHeader.vue';
import CommonAside from './CommonAside.vue';
import MainPage from '../views/MainPage.vue'
import { useAllDataStore } from '../assets/stores';
import { computed, watch, ref } from 'vue';
const store = useAllDataStore()
const elmenuBackgroundColor = ref('#626aef')

/**
 * 颜色主题
 */
const themes = {
    light: {
        '--text-color': '#242424',
        '--background-color': '#f5f5f5',
        '--header-color': 'dimgrey',
        '--h2-color': '#2c3e50',
        '--h2-line-color': '#3498db',
        '--el-aside-background-color': '#626aef',
        '--selected-background-color': '#1520f5',
        '--strong-color': '#626aef',
        '--elcard-background-color': 'white',
        '--eltable-hover-color': 'rgb(199, 216, 244)',
        '--input-background-color': 'white',
        '--input-color': '#242424',
        '--placeholder-color': '#606266',
        '--elselect-hovered-color': '#f5f7fa',
        '--border-color': '#dcdfe6',
        '--eltable-border-color': '#dcdfe6',
        '--suggestion-hovered-color':'white',
        '--sideheader-background-color':'rgb(117, 102, 199)',
    },
    dark: {
        '--text-color': '#e1e1e1',
        '--background-color': '#242424',
        '--header-color': '#e1e1e1',
        '--h2-color': 'rgb(0, 210, 151)',
        '--h2-line-color': 'rgb(0,210,151)',
        '--el-aside-background-color': 'rgb(16,87,90)',
        '--selected-background-color': 'rgb(7,152,175)',
        '--strong-color': 'rgb(57, 255, 255)',
        '--elcard-background-color': 'rgb(34,39,37)',
        '--eltable-hover-color': 'rgb(60, 86, 80)',
        '--input-background-color': '#242424',
        '--input-color': '#e1e1e1',
        '--placeholder-color': 'rgb(165,165,165)',
        '--elselect-hovered-color': 'rgb(60,86,80)',
        '--border-color': 'rgb(90,90,90)',
        '--eltable-border-color': 'rgb(85,85,85)',
        '--suggestion-hovered-color': 'rgb(60,86,80)',
        '--sideheader-background-color': 'rgb(6, 121, 50)',
    }
};

/**
 * 更新主题
 */
const theme = computed(() => {
    switch (store.userConfig.theme) {
        case 'light':
            elmenuBackgroundColor.value = "#626aef"
            break;
        case 'dark':
            elmenuBackgroundColor.value = "rgb(16,87,90)"
            break;
    }
    Object.entries(themes[store.userConfig.theme]).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value)
    })
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
    color: rgb(6, 121, 50);
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
        --el-card-border-color: var(--border-color);
    }

    .el-table {
        background-color: var(--elcard-background-color);
        --el-table-row-hover-bg-color: var(--eltable-hover-color);
        --el-table-border: 1px solid var(--eltable-border-color);

        thead {
            color: var(--tableheader-color);
        }
    }

    .el-table__inner-wrapper:before {
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

    .is-disabled .el-input__wrapper {
        color: var(--input-color);
        background-color: var(--input-background-color);
        box-shadow: 0 0 0 1px var(--border-color) inset;
    }

    .el-select {
        color: var(--input-color);
        background-color: var(--input-background-color);

        .el-select__wrapper {
            background-color: var(--input-background-color);
            box-shadow: 0 0 0 1px var(--border-color) inset;
        }
    }

    .el-button {
        color: var(--input-color);
        background-color: var(--input-background-color);
        border: 1px solid var(--border-color);
        border-radius: 3px;
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

    .fake-input {
        border: 1px solid var(--border-color);
        border-radius: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .el-cascader__tags .el-tag{
        background-color: var(--border-color);
        color:var(--text-color)
    }
    .sideheader {
        background-color:var(--sideheader-background-color);
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

.el-autocomplete-suggestion__wrap{
    background-color: var(--background-color);
}

.el-autocomplete-suggestion li{
    background-color: var(--background-color)!important;
    color: var(--text-color)!important;
}

.el-autocomplete-suggestion li.highlighted{
    background-color: var(--suggestion-hovered-color)!important;
}
</style>