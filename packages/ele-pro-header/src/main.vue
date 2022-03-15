<!-- 顶栏 license by http://eleadmin.com -->
<template>
  <div :class="['ele-admin-header', {'ele-bg-primary': headStyle === 2}]">
    <!-- logo -->
    <div class="ele-admin-logo">
      <slot name="logo"/>
      <span v-if="projectName">{{ projectName }}</span>
    </div>
    <!-- 左侧功能区 -->
    <div class="ele-admin-header-tool" v-if="showLeft">
      <div
        v-if="showCollapse"
        class="ele-admin-header-tool-item"
        @click="toggleCollapse">
        <MenuUnfoldOutlined v-if="collapse"/>
        <MenuFoldOutlined v-else/>
      </div>
      <div
        v-if="showRefresh"
        class="ele-admin-header-tool-item"
        @click="reloadPage">
        <ReloadOutlined/>
      </div>
      <slot name="left"/>
    </div>
    <!-- 面包屑导航 -->
    <ele-pro-breadcrumb
      v-if="layoutStyle===0"
      :breadcrumb-separator="breadcrumbSeparator"/>
    <!-- 顶部菜单区 -->
    <a-menu
      mode="horizontal"
      class="ele-admin-header-nav"
      :selected-keys="selectedKeys"
      :theme="['light', 'dark', 'light'][headStyle]">
      <template v-for="menu in menus">
        <ele-pro-sidebar-item
          v-if="!menu.meta.hide"
          :key="menu.path"
          :item="menu"/>
      </template>
    </a-menu>
    <!-- 右侧功能区 -->
    <slot name="right"/>
  </div>
</template>

<script>
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue';
import EleProBreadcrumb from '../../ele-pro-breadcrumb';
import EleProSidebarItem from '../../ele-pro-sidebar-item';

export default {
  name: 'ELeProHeader',
  components: {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ReloadOutlined,
    EleProBreadcrumb,
    EleProSidebarItem
  },
  emits: ['toggle-collapse', 'reload-page'],
  props: {
    // 项目名
    projectName: [String, Boolean],
    // 主页标题
    homeTitle: String,
    // 全部菜单数据
    data: Array,
    // 顶栏风格
    headStyle: Number,
    // 布局风格
    layoutStyle: Number,
    // 屏幕宽度
    screenWidth: Number,
    // 是否折叠
    collapse: Boolean,
    // 是否显示折叠按钮
    showCollapse: Boolean,
    // 是否显示刷新按钮
    showRefresh: Boolean,
    // 面包屑导航分隔符
    breadcrumbSeparator: String
  },
  computed: {
    // 菜单数据
    menus() {
      if (this.layoutStyle === 0 || this.screenWidth < 768) {
        return [];
      }
      let menus = this.data;
      if (!menus || !menus.length) {
        const routes = this.$router.options.routes.filter(d => d.path === '/');
        menus = routes.length ? routes[0].children : [];
      }
      if (this.layoutStyle === 1) {
        return menus;
      }
      return menus.map(d => Object.assign({}, d, {children: null}));
    },
    // 菜单选中
    selectedKeys() {
      return this.$route.matched.map(d => {
        return (d.meta && d.meta.uid) || d.path;
      });
    },
    // 是否显示左侧按钮
    showLeft() {
      return this.layoutStyle !== 1 || this.screenWidth < 768;
    }
  },
  methods: {
    /* 折叠展开侧栏 */
    toggleCollapse() {
      this.$emit('toggle-collapse');
    },
    /* 刷新页面 */
    reloadPage() {
      this.$emit('reload-page');
    }
  }
}
</script>
