<template>
  <el-aside class="sidebar-container">
      <div class="logo">
          <img :src="logo" alt="平台logo">
          <img :src="shortLogo" alt="" class="short-logo">
      </div>
      <el-scrollbar class="scrollbar-wrapper">
          <el-menu :default-active="matchPath" class="el-menu-vertical-demo sidebar-menu"
                   background-color="#2d303e"
                   text-color="#cccccc"
                   active-text-color="#ffffff"
                   unique-opened
                   @select="selectItem"
                   :collapse="isCollapsed">
              <sidebar-item v-for="route in sideMenuData" :menuItem='route' :key="route.path" :isLimitLevel="isLimitLevel" :base-path="basePath"></sidebar-item>
          </el-menu>
      </el-scrollbar>
  </el-aside>
</template>

<script>
import sidebarItem from './sidebarItem';

export default {
    props: {
        theme: {
            type: Object
        },
        isCollapsed: {
            type: Boolean
        },
        menuData: {
            type: Array
        },
        logo: {
            type: String
        },
        shortLogo: String,
        name: {
            type: String
        },
        isLimitLevel: {
            type: Boolean,
            default: false
        },
        basePath: {
            type: String,
            default: '/'
        },
        matchPath: {
            type: String,
            default: ''
        }
    },
    components: {sidebarItem},
    data () {
        return {};
    },
    computed: {
        sideMenuData() {
            return this.filterMenuData(this.menuData);
        }
    },
    methods: {
        // 对菜单数据做过滤，去掉隐藏菜单
        filterMenuData (data) {
            const menu = [];
            data.forEach(item => {
                if(!item.hidden){
                    const cache = { ...item };
                    menu.push(cache);
                    if(item.children) {
                        cache.children = this.filterMenuData(item.children);
                    }
                }
            });
            return menu.length ? menu : null;
        },
        selectItem (index) {
            this.$emit('select', index);
        }
    }
};
</script>
