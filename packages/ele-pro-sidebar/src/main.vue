<!-- 侧边栏 license by http://eleadmin.com -->
<template>
  <div class="ele-admin-sidebar ele-scrollbar-hide">
    <slot name="top"/>
    <template v-if="useDeep">
      <a-menu
        mode="inline"
        :inline-indent="16"
        :open-keys="openKeys"
        :selected-keys="selectedKeys"
        :inline-collapsed="isCollapse"
        :theme="['light', 'dark'][sideStyle]"
        @openChange="onOpenChange">
        <template v-for="menu in menus">
          <ele-pro-sidebar-item
            v-if="!menu.meta.hide"
            :key="menu.path"
            :item="menu"/>
        </template>
      </a-menu>
    </template>
    <template v-else>
      <ele-pro-sidebar-menus
        :menus="menus"
        :inline-indent="16"
        :open-keys="openKeys"
        :selected-keys="selectedKeys"
        :inline-collapsed="isCollapse"
        :theme="['light', 'dark'][sideStyle]"
        @openChange="onOpenChange"/>
    </template>
    <slot name="bottom"/>
  </div>
</template>

<script>
import EleProSidebarItem from '../../ele-pro-sidebar-item';
import EleProSidebarMenus from '../../ele-pro-sidebar-menus';

export default {
  name: 'EleProSidebar',
  components: {EleProSidebarItem, EleProSidebarMenus},
  emits: ['update-collapse'],
  props: {
    // 全部菜单数据
    data: Array,
    // 侧边栏风格
    sideStyle: Number,
    // 侧边栏是否只保持一个子菜单展开
    sideUniqueOpen: Boolean,
    // 布局风格
    layoutStyle: Number,
    // 屏幕宽度
    screenWidth: Number,
    // 是否折叠
    collapse: Boolean,
    // 是否使用递归渲染菜单item
    useDeep: Boolean
  },
  data() {
    return {
      // 侧边栏选中的key
      selectedKeys: [],
      // 侧边栏展开的key
      openKeys: [],
      // 侧边栏展开的key备份
      openKeysCopy: []
    };
  },
  computed: {
    /* 左侧菜单数据 */
    menus() {
      let menus = this.data;
      if (!menus || !menus.length) {
        const routes = this.$router.options.routes.filter(d => d.path === '/');
        menus = routes.length ? routes[0].children : [];
      }
      // 混合导航
      if (this.layoutStyle === 2 && this.screenWidth >= 768) {
        const matched = this.$route.matched;
        if (matched.length > 1) {
          const temps = menus.filter(d => d.path === matched[1].path);
          return temps.length ? temps[0].children : [];
        } else {
          return [];
        }
      }
      return menus;
    },
    /* 是否折叠menu */
    isCollapse() {
      return this.screenWidth < 768 ? false : this.collapse;
    }
  },
  mounted() {
    this.onRouteChange();
  },
  methods: {
    /* 处理路由改变 */
    onRouteChange() {
      const current = this.$route;
      // 侧栏展开的key
      const pks = current.matched.filter((d, index) => {
        return index !== 0 && (index !== (current.matched.length - 1));
      }).map(d => d.path);
      if (this.sideUniqueOpen) {
        this.openKeysCopy = pks;
      } else {
        this.openKeysCopy = Array.from(new Set(this.openKeysCopy.concat(pks)));
      }
      if (!this.isCollapse) {
        this.openKeys = this.openKeysCopy;
      }
      // 侧边栏选中的key
      const ck = (current.meta && current.meta.uid) || current.path;
      this.selectedKeys = [ck].concat(this.openKeysCopy);
      // 小屏幕下自动收起侧边栏
      if (this.screenWidth < 768) {
        this.$emit('update-collapse', true);
      }
    },
    /* 菜单展开事件 */
    onOpenChange(keys) {
      if (this.collapse) {
        this.openKeys = keys;
      } else {
        if (keys.length && keys.length > this.openKeysCopy.length && this.sideUniqueOpen) {
          const cks = keys.filter(k => !this.openKeysCopy.some(t => k === t));
          this.openKeysCopy = this.getTreeKeys(this.menus, cks[0]) || [];
        } else {
          this.openKeysCopy = keys;
        }
        this.openKeys = this.openKeysCopy;
      }
    },
    /* 获取key及所有父级key */
    getTreeKeys(data, key, pks) {
      if (!pks) {
        pks = [];
      }
      for (let i = 0; i < data.length; i++) {
        const d = data[i];
        if (d.path === key) {
          return pks.concat([key]);
        } else if (d.children && d.children.length) {
          const ks = this.getTreeKeys(d.children, key, pks.concat([d.path]));
          if (ks) {
            return ks;
          }
        }
      }
    }
  },
  watch: {
    $route() {
      this.onRouteChange();
    },
    isCollapse() {
      if (this.isCollapse) {
        this.openKeys = [];
      } else {
        this.openKeys = this.openKeysCopy;
      }
    }
  }
}
</script>
