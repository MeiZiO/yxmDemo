<template>
    <Link :to="path">
        <el-menu-item :index="path">
            <Icon :type="meta.icon || 'icon-dian'"></Icon>
            <span slot="title">{{meta.title}}</span>
        </el-menu-item>
    </Link>
</template>

<script>
import Link from './Link';
export default {
    components: {
        Link
    },
    props: {
        path: {
            type: String
        },
        meta: {
            type: Object
        }
    },
    methods: {
    }
};
</script>
