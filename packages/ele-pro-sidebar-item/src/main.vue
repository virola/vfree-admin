<!-- 侧边栏菜单item license by http://eleadmin.com -->
<template>
  <template v-if="haveChildren">
    <a-sub-menu :key="item.path">
      <template #title>
        <component
          v-if="item.meta.icon"
          :is="item.meta.icon"/>
        <span>{{ item.meta.title }}</span>
      </template>
      <template v-for="child in item.children">
        <ele-pro-sidebar-item
          v-if="!child.meta.hide"
          :key="child.path"
          :item="child"/>
      </template>
    </a-sub-menu>
  </template>
  <template v-else>
    <a-menu-item :key="item.path">
      <a v-if="isUrl" :href="item.path" target="_blank">
        <component
          v-if="item.meta.icon"
          :is="item.meta.icon"/>
        <span>{{ item.meta.title }}</span>
      </a>
      <router-link v-else :to="item.path">
        <component
          v-if="item.meta.icon"
          :is="item.meta.icon"/>
        <span>{{ item.meta.title }}</span>
      </router-link>
    </a-menu-item>
  </template>
</template>

<script>
import * as antIcons from '@ant-design/icons-vue';

export default {
  name: 'EleProSidebarItem',
  components: {
    ...antIcons
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    /* 是否有子级 */
    haveChildren() {
      if (!this.item.children) {
        return false;
      }
      return this.item.children.filter(d => !d.meta.hide).length > 0;
    },
    /* 是否是网址 */
    isUrl() {
      const url = this.item.path;
      return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');
    }
  }
}
</script>
