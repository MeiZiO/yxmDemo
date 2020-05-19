<template>
    <el-header class="common-header">
        <div class="toggle-class" @click.prevent="toggleSideBar">
            <i v-if="isCollapsed" class="iconfont icon-indent"></i>
            <i v-else class="iconfont icon-dedent"></i>
        </div>
        <slot></slot>
    </el-header>
</template>
<script>
export default {
    props: {
        isCollapsed: {
            type: Boolean,
        },
    },
    data () {
        return {}
    },
    created () {
    },
    methods: {
        toggleSideBar () {
            this.$emit('toggleSidebar')
        },
    },
}
</script>
<style lang="scss" scoped>
    .common-header {
        background: #fff;
        color: #666;
        -webkit-box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
        box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
        box-sizing: border-box;
        border-bottom: 1px solid #ebebeb;
        width: 100%;
        height: 50px !important;
        font-size: 22px;
        line-height: 50px;
        padding: 0 0 0 10px;
        .toggle-class {
            float: left;
            height: 50px;
            line-height: 43px;
            cursor: pointer;
            margin-left: 15px
        }
        .el-dropdown {
            color: #666;
        }
    }
</style>
