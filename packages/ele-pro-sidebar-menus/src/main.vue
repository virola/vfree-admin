<!-- 侧边栏菜单item2 license by http://eleadmin.com -->
<template>
  <a-menu
    mode="inline"
    :inline-indent="inlineIndent"
    :inline-collapsed="inlineCollapsed"
    :theme="theme"
    :selected-keys="selectedKeys"
    :open-keys="openKeys"
    @openChange="onOpenChange">
    <template v-for="menu in menus">
      <template v-if="!menu.meta.hide">
        <template v-if="haveChildren(menu)">
          <a-sub-menu :key="menu.path">
            <template #title>
              <component
                v-if="menu.meta.icon"
                :is="menu.meta.icon"/>
              <span>{{ menu.meta.title }}</span>
            </template>
            <template v-for="child in menu.children">
              <template v-if="!child.meta.hide">
                <template v-if="haveChildren(child)">
                  <a-sub-menu :key="child.path">
                    <template #title>
                      <component
                        v-if="child.meta.icon"
                        :is="child.meta.icon"/>
                      <span>{{ child.meta.title }}</span>
                    </template>
                    <template v-for="last in child.children">
                      <template v-if="!last.meta.hide">
                        <template v-if="haveChildren(last)">
                          <a-sub-menu :key="last.path">
                            <template #title>
                              <component v-if="last.meta.icon" :is="last.meta.icon"/>
                              <span>{{ last.meta.title }}</span>
                            </template>
                            <template v-for="m4 in last.children">
                              <template v-if="!m4.meta.hide">
                                <template v-if="haveChildren(m4)">
                                  <a-sub-menu :key="m4.path">
                                    <template #title>
                                      <component v-if="m4.meta.icon" :is="m4.meta.icon"/>
                                      <span>{{ m4.meta.title }}</span>
                                    </template>
                                    <template v-for="m5 in m4.children">
                                      <template v-if="!m5.meta.hide">
                                        <template v-if="haveChildren(m5)">
                                          <a-sub-menu :key="m5.path">
                                            <template #title>
                                              <component v-if="m5.meta.icon" :is="m5.meta.icon"/>
                                              <span>{{ m5.meta.title }}</span>
                                            </template>
                                            <template v-for="m6 in m5.children">
                                              <template v-if="!m6.meta.hide&&!haveChildren(m6)">
                                                <a-menu-item :key="m6.path">
                                                  <a v-if="isUrl(m6)" :href="m6.path" target="_blank">
                                                    <component v-if="m6.meta.icon" :is="m6.meta.icon"/>
                                                    <span>{{ m6.meta.title }}</span>
                                                  </a>
                                                  <router-link v-else :to="m6.path">
                                                    <component v-if="m6.meta.icon" :is="m6.meta.icon"/>
                                                    <span>{{ m6.meta.title }}</span>
                                                  </router-link>
                                                </a-menu-item>
                                              </template>
                                            </template>
                                          </a-sub-menu>
                                        </template>
                                        <template v-else>
                                          <a-menu-item :key="m5.path">
                                            <a v-if="isUrl(m5)" :href="m5.path" target="_blank">
                                              <component v-if="m5.meta.icon" :is="m5.meta.icon"/>
                                              <span>{{ m5.meta.title }}</span>
                                            </a>
                                            <router-link v-else :to="m5.path">
                                              <component v-if="m5.meta.icon" :is="m5.meta.icon"/>
                                              <span>{{ m5.meta.title }}</span>
                                            </router-link>
                                          </a-menu-item>
                                        </template>
                                      </template>
                                    </template>
                                  </a-sub-menu>
                                </template>
                                <template v-else>
                                  <a-menu-item :key="m4.path">
                                    <a v-if="isUrl(m4)" :href="m4.path" target="_blank">
                                      <component v-if="m4.meta.icon" :is="m4.meta.icon"/>
                                      <span>{{ m4.meta.title }}</span>
                                    </a>
                                    <router-link v-else :to="m4.path">
                                      <component v-if="m4.meta.icon" :is="m4.meta.icon"/>
                                      <span>{{ m4.meta.title }}</span>
                                    </router-link>
                                  </a-menu-item>
                                </template>
                              </template>
                            </template>
                          </a-sub-menu>
                        </template>
                        <template v-else>
                          <a-menu-item :key="last.path">
                            <a
                              v-if="isUrl(last)"
                              :href="last.path"
                              target="_blank">
                              <component
                                v-if="last.meta.icon"
                                :is="last.meta.icon"/>
                              <span>{{ last.meta.title }}</span>
                            </a>
                            <router-link v-else :to="last.path">
                              <component
                                v-if="last.meta.icon"
                                :is="last.meta.icon"/>
                              <span>{{ last.meta.title }}</span>
                            </router-link>
                          </a-menu-item>
                        </template>
                      </template>
                    </template>
                  </a-sub-menu>
                </template>
                <template v-else>
                  <a-menu-item :key="child.path">
                    <a
                      v-if="isUrl(child)"
                      :href="child.path"
                      target="_blank">
                      <component
                        v-if="child.meta.icon"
                        :is="child.meta.icon"/>
                      <span>{{ child.meta.title }}</span>
                    </a>
                    <router-link v-else :to="child.path">
                      <component
                        v-if="child.meta.icon"
                        :is="child.meta.icon"/>
                      <span>{{ child.meta.title }}</span>
                    </router-link>
                  </a-menu-item>
                </template>
              </template>
            </template>
          </a-sub-menu>
        </template>
        <template v-else>
          <a-menu-item :key="menu.path">
            <a
              v-if="isUrl(menu)"
              :href="menu.path"
              target="_blank">
              <component
                v-if="menu.meta.icon"
                :is="menu.meta.icon"/>
              <span>{{ menu.meta.title }}</span>
            </a>
            <router-link v-else :to="menu.path">
              <component
                v-if="menu.meta.icon"
                :is="menu.meta.icon"/>
              <span>{{ menu.meta.title }}</span>
            </router-link>
          </a-menu-item>
        </template>
      </template>
    </template>
  </a-menu>
</template>

<script>
import * as antIcons from '@ant-design/icons-vue';

export default {
  name: 'EleProSidebarMenus',
  components: {...antIcons},
  emits: ['openChange'],
  props: {
    inlineIndent: Number,
    inlineCollapsed: Boolean,
    theme: String,
    selectedKeys: Array,
    openKeys: Array,
    menus: Array
  },
  methods: {
    onOpenChange(e) {
      this.$emit('openChange', e);
    },
    /* 是否有子级 */
    haveChildren(item) {
      if (!item.children) {
        return false;
      }
      return item.children.filter(d => !d.meta.hide).length > 0;
    },
    /* 是否是网址 */
    isUrl(item) {
      const url = item.path;
      return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');
    }
  }
}
</script>
