<script setup>
import CommonHeader from './CommonHeader.vue';
import CommonAside from './CommonAside.vue';
import MainPage from '../views/MainPage.vue'
import { useAllDataStore } from '../assets/stores';
import { computed, ref } from 'vue';
const store = useAllDataStore()
const theme = computed(() => {
    switch (store.userConfig.theme) {
        case 'light':
            elmenuBackgroundColor.value = "#626aef"
            return {
                textColor: '#242424',
                backgroundColor: '#f5f5f5',
                headerColor: 'dimgrey',
                h2Color: '#2c3e50',
                h2LineColor: '#3498db',
                elasideBackgroundColor: '#626aef',
                selectedBackgroundColor: '#1520f5',
                strongColor: '#626aef',
                elcardBackgroundColor: 'white',
                eltableHoverColor: 'rgb(199, 216, 244)',
                inputBackgroundColor: 'white',
                inputColor: '#242424'
            }
        case 'dark':
            elmenuBackgroundColor.value = "rgb(16,87,90)"
            return {
                textColor: '#e1e1e1',
                backgroundColor: '#242424',
                headerColor: '#e1e1e1',
                h2Color: 'rgb(0, 210, 151)',
                h2LineColor: 'rgb(0,210,151)',
                elasideBackgroundColor: 'rgb(16,87,90)',
                selectedBackgroundColor: 'rgb(7,152,175)',
                strongColor: 'rgb(57, 255, 255)',
                elcardBackgroundColor: 'rgb(47,62,59)',
                eltableHoverColor: 'rgb(60, 86, 80)',
                inputBackgroundColor: '#242424',
                inputColor: '#e1e1e1'
            }
    }
})
const elmenuBackgroundColor = ref('#626aef')
</script>
<template>

    <div class="common-layout"
        :style="{ '--text-color': theme.textColor, '--background-color': theme.backgroundColor, '--header-color': theme.headerColor, '--h2-color': theme.h2Color, '--h2-line-color': theme.h2LineColor, '--el-aside-background-color': theme.elasideBackgroundColor, '--selected-background-color': theme.selectedBackgroundColor, '--strong-color': theme.strongColor, '--elcard-background-color': theme.elcardBackgroundColor, '--eltable-hover-color': theme.eltableHoverColor, '--input-background-color': theme.inputBackgroundColor, '--input-color': theme.inputColor }">
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
    --text-color: #242424;
    --background-color: #f7f7f7;
    --header-color: dimgrey;
    --h2-color: #2c3e50;
    --h2-line-color: #3498db;
    --el-aside-background-color: #626aef;
    --selected-background-color: #1520f5;
    --strong-color: #626aef;
    --elcard-background-color: white;
    --eltable-hover-color: rgb(199, 216, 244);
    --input-background-color: white;
    --input-color: #242424;
    color: lightskyblue;
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
        color: var(--strong-color)
    }

    .el-card {
        background-color: var(--elcard-background-color);
    }

    .el-table {
        background-color: var(--elcard-background-color);
        --el-table-row-hover-bg-color: var(--eltable-hover-color);
    }

    input {
        color: var(--input-color);
        background-color: var(--input-background-color);
    }

    .el-input {
        color: var(--input-color);
        background-color: var(--input-background-color);
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

    .el-switch{
        --el-switch-on-color:var(--strong-color)

    }
    .el-switch__label{
        &--left{
            color: var(--input-color);
        }
        &--right{
            color:var(--strong-color)
        }

    }

}
</style>