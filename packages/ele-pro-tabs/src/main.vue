<!-- 标签页 license by http://eleadmin.com -->
<template>
  <a-tabs
    class="ele-admin-tabs"
    :active-key="active"
    type="editable-card"
    :animated="false"
    :hide-add="true"
    @tabClick="onTabClick"
    @edit="onTabEdit">
    <a-tab-pane
      key="/"
      :tab="homeTitle"
      :closable="false"/>
    <a-tab-pane
      v-for="d in tabs"
      :key="d.path"
      :tab="d.title"
      :closable="true"/>
    <template #tabBarExtraContent>
      <a-dropdown
        :overlay-style="{paddingRight: '5px'}"
        placement="bottomRight">
        <div class="ele-admin-tabs-drop">
          <down-outlined/>
        </div>
        <template #overlay>
          <a-menu @click="onDropClick">
            <a-menu-item key="reload" v-if="showRefresh">
              <span><reload-outlined/>刷新当前</span>
            </a-menu-item>
            <a-menu-item key="left">
              <span><arrow-left-outlined/>关闭左侧</span>
            </a-menu-item>
            <a-menu-item key="right">
              <span><arrow-right-outlined/>关闭右侧</span>
            </a-menu-item>
            <a-menu-item key="other">
              <span><close-outlined/>关闭其它</span>
            </a-menu-item>
            <a-menu-item key="all">
              <span><close-circle-outlined/>关闭全部</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </template>
  </a-tabs>
</template>

<script>
import {
  DownOutlined,
  ReloadOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseOutlined,
  CloseCircleOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'EleProTabs',
  components: {
    DownOutlined,
    ReloadOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    CloseOutlined,
    CloseCircleOutlined
  },
  props: {
    // 主页标题
    homeTitle: String,
    // 标签页数据
    tabs: Array,
    // 右侧下拉是否显示刷新按钮
    showRefresh: Boolean
  },
  emits: [
    'tab-add',
    'tab-remove',
    'tab-remove-left',
    'tab-remove-right',
    'tab-remove-other',
    'tab-remove-all',
    'reload-page'
  ],
  data() {
    return {
      // 当前选中页签
      active: '/'
    }
  },
  mounted() {
    this.onRouteChange();
  },
  methods: {
    /* 处理路由切换 */
    onRouteChange() {
      const current = this.$route,
        path = current.fullPath;
      if (this.isHome(path)) {
        this.active = '/';
      } else {
        this.active = path;
        const title = current.meta ? current.meta.title : '';
        this.$emit('tab-add', {
          path: path,
          title: title
        });
      }
    },
    /* 是否是主页 */
    isHome(path) {
      if (path === '/') {
        return true;
      }
      const matched = this.$route.matched;
      return matched.length && matched[0].redirect === path;
    },
    /* 处理tab点击 */
    onTabClick(key) {
      const path = this.$route.fullPath;
      if (path === key) {
        this.reloadPage();
      } else if (key === '/' && this.isHome(path)) {
        this.reloadPage();
      } else {
        this.$router.push(key);
      }
    },
    /* 处理tab编辑 */
    onTabEdit(key, action) {
      if (action !== 'remove') {
        return;
      }
      this.$emit('tab-remove', {
        name: key,
        active: this.active
      });
    },
    /* 下拉菜单点击 */
    onDropClick(obj) {
      if (obj.key === 'left') {  // 关闭左侧
        this.$emit('tab-remove-left', this.active);
      } else if (obj.key === 'right') {  // 关闭右侧
        if (this.active === '/') {
          this.removeAllTab();
        } else {
          this.$emit('tab-remove-right', this.active);
        }
      } else if (obj.key === 'other') {  // 关闭其他
        this.$emit('tab-remove-other', this.active);
      } else if (obj.key === 'all') {  // 关闭全部
        this.removeAllTab();
        if (this.active !== '/') {
          this.$router.push('/');
        }
      } else if (obj.key === 'reload') {  // 刷新当前
        this.reloadPage();
      }
    },
    /* 关闭全部Tab */
    removeAllTab() {
      this.$emit('tab-remove-all');
    },
    /* 刷新页面 */
    reloadPage() {
      this.$emit('reload-page');
    }
  },
  unmounted() {
    this.removeAllTab();
  },
  watch: {
    $route() {
      this.onRouteChange();
    }
  }
}
</script>
