/** ele admin pro license by http://eleadmin.com */
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import Antd from 'ant-design-vue';
import EleAvatarList from './ele-avatar-list';
import EleEditTag from './ele-edit-tag';
import EleEmptyLayout from './ele-empty-layout';
import EleIframeLayout from './ele-iframe-layout';
import EleProBreadcrumb from './ele-pro-breadcrumb';
import EleProHeader from './ele-pro-header';
import EleProLayout from './ele-pro-layout';
import EleProSetting from './ele-pro-setting';
import EleProSidebar from './ele-pro-sidebar';
import EleProSidebarItem from './ele-pro-sidebar-item';
import EleProSidebarMenus from './ele-pro-sidebar-menus';
import EleProTable from './ele-pro-table';
import EleProTableTools from './ele-pro-table-tools';
import EleProTabs from './ele-pro-tabs';
import EleTag from './ele-tag';
import EleToolbar from './ele-toolbar';
import util from './util.js';

const install = function (app, opt) {
  NProgress.configure(Object.assign({
    showSpinner: false,
    trickleSpeed: 300
  }, opt ? opt.nProgress : null));
  app.use(Antd);
  // 注册全局组件
  app.component(EleAvatarList.name, EleAvatarList);
  app.component(EleEditTag.name, EleEditTag);
  app.component(EleEmptyLayout.name, EleEmptyLayout);
  app.component(EleIframeLayout.name, EleIframeLayout);
  app.component(EleProBreadcrumb.name, EleProBreadcrumb);
  app.component(EleProHeader.name, EleProHeader);
  app.component(EleProLayout.name, EleProLayout);
  app.component(EleProSetting.name, EleProSetting);
  app.component(EleProSidebar.name, EleProSidebar);
  app.component(EleProSidebarItem.name, EleProSidebarItem);
  app.component(EleProSidebarMenus.name, EleProSidebarMenus);
  app.component(EleProTable.name, EleProTable);
  app.component(EleProTableTools.name, EleProTableTools);
  app.component(EleProTabs.name, EleProTabs);
  app.component(EleTag.name, EleTag);
  app.component(EleToolbar.name, EleToolbar);
  // 添加全局属性
  app.config.globalProperties.$util = util;
  app.config.globalProperties.$ELEADMIN = {
    request: opt ? opt.request : null,
    response: opt ? opt.response : null
  };
};

export {
  EleAvatarList,
  EleEditTag,
  EleEmptyLayout,
  EleIframeLayout,
  EleProBreadcrumb,
  EleProHeader,
  EleProLayout,
  EleProSetting,
  EleProSidebar,
  EleProSidebarItem,
  EleProSidebarMenus,
  EleProTable,
  EleProTableTools,
  EleProTabs,
  EleTag,
  EleToolbar,
  util
}

export default {
  install
}
