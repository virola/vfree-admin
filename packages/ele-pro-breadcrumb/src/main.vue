<!-- 面包屑导航 license by http://eleadmin.com -->
<template>
  <a-breadcrumb
    :separator="breadcrumbSeparator"
    class="ele-admin-breadcrumb">
    <a-breadcrumb-item v-for="(d, i) in levels" :key="i">
      <router-link v-if="d.home" to="/">
        <home-outlined/>
      </router-link>
      <span v-else>{{ d.meta.title }}</span>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script>
import {HomeOutlined} from '@ant-design/icons-vue';

export default {
  name: 'EleProBreadcrumb',
  components: {HomeOutlined},
  props: {
    // 面包屑导航分隔符
    breadcrumbSeparator: String
  },
  data() {
    return {
      // 面包屑数据
      levels: []
    };
  },
  mounted() {
    this.onRouteChange();
  },
  methods: {
    /* 处理路由切换 */
    onRouteChange() {
      const current = this.$route,
        path = current.path,
        matched = current.matched;
      let levels = [];
      if (path !== '/' && !(matched.length && matched[0].redirect === path)) {
        levels.push({home: true});
      }
      matched.forEach(d => {
        if (d.meta && d.meta.title && d.meta.breadcrumb !== false) {
          levels.push(d);
        }
      });
      this.levels = levels;
    }
  },
  watch: {
    $route() {
      this.onRouteChange();
    }
  }
}
</script>
