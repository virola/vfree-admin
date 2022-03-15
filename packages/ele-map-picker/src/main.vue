<!-- 地图位置选择组件 license by http://eleadmin.com -->
<template>
  <a-modal
    :visible="visible"
    :title="title"
    :width="width"
    :centered="centered"
    :closable="closable"
    :destroy-on-close="destroyOnClose"
    :force-render="forceRender"
    :keyboard="keyboard"
    :mask="mask"
    :mask-closable="maskClosable"
    :mask-style="maskStyle"
    :wrap-class-name="wrapClassName"
    :z-index="zIndex"
    :dialog-style="dialogStyle"
    :dialog-class="dialogClass"
    :footer="null"
    :body-style="{padding: 0}"
    class="ele-map-picker-dialog"
    @update:visible="updateVisible">
    <template #title>
      <slot name="title"/>
    </template>
    <a-spin v-if="show" :spinning="loading">
      <div class="ele-map-picker-header">
        <div class="ele-map-picker-header-search">
          <a-auto-complete
            v-model:value="suggestionKeywords"
            :placeholder="searchPlaceholder"
            :options="suggestionData"
            @search="onSearch"
            @select="onSelect">
            <a-input>
              <template #suffix>
                <search-outlined class="ele-text-secondary"/>
              </template>
            </a-input>
          </a-auto-complete>
        </div>
        <a-button
          :loading="doneLoading"
          type="primary"
          @click="onDone">确定
        </a-button>
      </div>
      <div class="ele-map-picker-body">
        <div class="ele-map-picker-main">
          <div ref="eleMapPickerMap" :style="{height: height}"></div>
          <plus-outlined v-if="searchType===0" class="ele-map-picker-main-plus"/>
          <img v-if="searchType===0" :class="iconClass" :src="markerSrc" alt=""/>
        </div>
        <a-spin :spinning="poiLoading">
          <div class="ele-map-picker-poi-list" :style="{height: height}">
            <div
              v-for="(poi,index) in poiData"
              :key="index"
              :class="['ele-map-picker-poi-item', {'active': index===chooseIndex}]"
              @click="onChoose(index)">
              <environment-outlined class="ele-map-picker-poi-item-icon"/>
              <div class="ele-map-picker-poi-item-title">{{ poi.name }}</div>
              <div v-if="poi.address" class="ele-map-picker-poi-item-address">{{ poi.address }}</div>
              <check-circle-outlined class="ele-map-picker-poi-item-check"/>
            </div>
          </div>
        </a-spin>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import AMapLoader from '@amap/amap-jsapi-loader';
import {
  PlusOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined
} from '@ant-design/icons-vue';

export default {
  name: 'EleMapPicker',
  components: {
    PlusOutlined,
    SearchOutlined,
    EnvironmentOutlined,
    CheckCircleOutlined
  },
  emits: ['done', 'open', 'closed', 'update:visible'],
  props: {
    // 是否显示
    visible: Boolean,
    // 地图的高度
    height: {
      type: String,
      default: '450px'
    },
    // 地图默认中心点
    center: Array,
    // 地图初始缩放级别
    zoom: {
      type: Number,
      default: 11
    },
    // 地图选中后缩放级别
    chooseZoom: {
      type: Number,
      default: 17
    },
    // poi检索每页数量
    poiSize: {
      type: Number,
      default: 30
    },
    // poi检索兴趣点类别
    poiType: {
      type: String,
      default: ''
    },
    // poi检索关键字
    poiKeywords: {
      type: String,
      default: ''
    },
    // poi检索半径
    poiRadius: {
      type: Number,
      default: 1000
    },
    // 是否返回行政区
    needCity: Boolean,
    // 是否强制选择
    forceChoose: {
      type: Boolean,
      default: true
    },
    // 搜索建议的城市范围
    suggestionCity: {
      type: String,
      default: '全国'
    },
    // 地点检索类型, 0: POI检索, 1: 关键字检索
    searchType: {
      type: Number,
      default: 0
    },
    // 搜索框提示文本
    searchPlaceholder: {
      type: String,
      default: '输入关键字搜索'
    },
    // marker图标地址
    markerSrc: {
      type: String,
      default: 'https://3gimg.qq.com/lightmap/components/locationPicker2/image/marker.png'
    },
    // 地图默认的key
    mapKey: {
      type: String,
      default: '006d995d433058322319fa797f2876f5'
    },
    // 地图默认版本号
    mapVersion: {
      type: String,
      default: '2.0'
    },
    // 地图风格
    mapStyle: String,
    // 弹窗属性
    centered: Boolean,
    closable: {
      type: Boolean,
      default: true
    },
    destroyOnClose: Boolean,
    forceRender: Boolean,
    keyboard: {
      type: Boolean,
      default: true
    },
    mask: {
      type: Boolean,
      default: true
    },
    maskClosable: {
      type: Boolean,
      default: true
    },
    maskStyle: Object,
    title: {
      type: String,
      default: '选择位置'
    },
    width: {
      type: String,
      default: '780px'
    },
    wrapClassName: String,
    zIndex: {
      type: Number,
      default: 1000
    },
    dialogStyle: Object,
    dialogClass: String
  },
  data() {
    return {
      // 是否加载
      show: false,
      // 地图实例
      map: null,
      // 地图中心标记点
      centerMarker: null,
      // poi检索实例
      placeSearch: null,
      // 输入建议实例
      autoComplete: null,
      // poi检索的数据
      poiData: [],
      // 选中的数据索引
      chooseIndex: null,
      // 是否是点击poi列表移动地图
      isSelMove: false,
      // 图标是否显示跳动动画
      showIconAnim: false,
      // 搜索输入内容
      suggestionKeywords: '',
      // 上次搜索输入内容
      lastSuggestion: '',
      // 搜索建议列表
      suggestionData: [],
      // 选中的建议
      chooseSuggestion: null,
      // 初始化loading
      loading: true,
      // poi检索loading
      poiLoading: false,
      // 确定按钮loading
      doneLoading: false
    };
  },
  computed: {
    // 跳动图标的class
    iconClass() {
      return [
        'ele-map-picker-main-icon',
        {'ele-map-picker-anim-bounce': this.showIconAnim}
      ];
    },
    // 是否是暗黑模式
    darkMode() {
      try {
        return this.$store.state.theme.darkMode;
      } catch (e) {
        return null;
      }
    }
  },
  watch: {
    visible() {
      if (this.visible) {
        this.onOpen();
      } else {
        this.onClosed();
      }
    },
    darkMode() {
      if (this.map && !this.mapStyle) {
        if (this.darkMode) {
          this.map.setMapStyle('amap://styles/dark');
        } else {
          this.map.setMapStyle('amap://styles/normal');
        }
      }
    }
  },
  mounted() {
    if (this.visible) {
      this.onOpen();
    }
  },
  methods: {
    /* 渲染地图 */
    render() {
      AMapLoader.load({
        'key': this.mapKey,
        'version': this.mapVersion,
        'plugins': ['AMap.PlaceSearch', 'AMap.AutoComplete']
      }).then((AMap) => {
        this.loading = false;
        this.poiLoading = true;
        // 渲染地图
        let option = {
          resizeEnable: true, // 监控地图容器尺寸变化
          zoom: this.zoom,  // 初缩放级别
          center: this.center  // 初始中心点
        };
        if (this.mapStyle) {
          option.mapStyle = this.mapStyle;
        } else if (this.darkMode) {
          option.mapStyle = 'amap://styles/dark';
        }
        this.map = new AMap.Map(this.$refs.eleMapPickerMap, option);
        // 获取poi检索实例
        this.placeSearch = new AMap.PlaceSearch({
          type: this.poiType,
          pageSize: this.poiSize,
          pageIndex: 1
        });
        // 获取输入建议实例
        this.autoComplete = new AMap.AutoComplete({
          city: this.suggestionCity
        });
        // 地图加载完成事件
        this.map.on('complete', () => {
          this.chooseIndex = null;
          let center = this.map.getCenter();
          this.searchNearBy(center.lat, center.lng, true);
        });
        // 地图移动结束事件
        this.map.on('moveend', () => {
          // 是否是poi列表点击的移动
          if (this.isSelMove) {
            this.isSelMove = false;
          } else {
            this.showIconAnim = false;
            this.$nextTick(() => {
              setTimeout(() => {
                this.showIconAnim = true;
              }, 0);
            });
            let center = this.map.getCenter();
            this.searchNearBy(center.lat, center.lng);
          }
        });
        // 地图中心marker
        this.centerMarker = new AMap.Marker({
          icon: new AMap.Icon({
            image: this.markerSrc,
            size: new AMap.Size(26, 36.5),
            imageSize: new AMap.Size(26, 36.5)
          }),
          offset: new AMap.Pixel(-13, -36.5)
        });
      }).catch(e => {
        this.loading = false;
        console.error(e);
      });
    },
    /* poi检索 */
    searchNearBy(lat, lng, force) {
      if (!this.placeSearch) {
        return;
      }
      // 非POI检索模式
      if (!force && this.searchType !== 0) {
        this.poiLoading = false;
        return;
      }
      this.poiLoading = true;
      this.placeSearch.searchNearBy(this.poiKeywords, [lng, lat], this.poiRadius, (status, result) => {
        this.poiLoading = false;
        if (status === 'complete') {
          let data = result.poiList.pois.filter(p => p.location !== undefined);
          // 如果选中的搜索建议不在poi列表中则添加
          if (this.chooseSuggestion) {
            if (data.length === 0 || data[0].name !== this.chooseSuggestion.name) {
              data.unshift(Object.assign({}, this.chooseSuggestion));
            }
            this.chooseSuggestion = null;
          } else {
            this.chooseIndex = null;
          }
          this.poiData = data;
        }
      });
    },
    /* poi列表选中 */
    onChoose(index) {
      this.isSelMove = true;
      this.chooseIndex = index;
      const point = this.poiData[index].location;
      this.map.setZoomAndCenter(this.chooseZoom, [point.lng, point.lat]);
      // 非poi检索类型给地图添加中心标记点
      if (this.searchType !== 0) {
        this.centerMarker.setPosition([point.lng, point.lat]);
        this.map.add(this.centerMarker);
      } else {
        // poi检索类型图标跳动
        this.showIconAnim = false;
        this.$nextTick(() => {
          setTimeout(() => {
            this.showIconAnim = true;
          }, 0);
        });
      }
    },
    /* 搜索建议 */
    onSearch(value) {
      if (!this.autoComplete || !value || this.lastSuggestion === value) {
        return;
      }
      if (this.searchType !== 0) {
        this.poiLoading = true;
      }
      this.lastSuggestion = value;
      this.autoComplete.search(value, (status, result) => {
        let data = [];
        if (result.tips) {
          data = result.tips.map(d => {
            return Object.assign({}, d, {
              address: Array.isArray(d.address) ? d.address[0] : d.address,
              text: d.name,
              value: d.name
            });
          });
        }
        if (this.searchType === 0) {  // POI检索模式
          this.suggestionData = data;
        } else {  // 关键字检索模式
          this.poiData = data;
          this.chooseIndex = null;
          this.poiLoading = false;
          this.map.remove(this.centerMarker);
        }
      });
    },
    /* 搜索建议选中 */
    onSelect(value, option) {
      this.chooseSuggestion = option;
      if (!this.poiData.length || this.poiData[0].name !== this.chooseSuggestion.name) {
        this.poiData.unshift(Object.assign({}, this.chooseSuggestion));
      }
      this.chooseIndex = 0;
      const point = this.chooseSuggestion.location;
      if (point && this.map) {
        this.map.setZoomAndCenter(this.chooseZoom, [point.lng, point.lat]);
      }
    },
    /* 确定选择 */
    onDone() {
      if (!this.map) {
        return;
      }
      let location;
      if (this.chooseIndex === null) {
        if (this.forceChoose) {  // 强制选择
          return this.$message.error('请点击列表选中位置');
        } else {  // 未选择使用地图中心点
          location = Object.assign({}, this.map.getCenter());
        }
      } else {
        location = Object.assign({
          name: this.poiData[this.chooseIndex].name,
          address: this.poiData[this.chooseIndex].address || ''
        }, this.poiData[this.chooseIndex].location);
      }
      if (this.needCity) {  // 获取行政区
        this.doneLoading = true;
        this.map.setCenter([location.lng, location.lat]);
        this.map.getCity((result) => {
          this.doneLoading = false;
          location.city = result;
          this.$emit('done', location);
        });
      } else {
        this.$emit('done', location);
      }
    },
    /* 弹窗打开回调 */
    onOpen() {
      this.show = true;
      if (this.destroyOnClose || this.map === null) {
        this.render();  // 渲染地图
      }
      this.$emit('open');
    },
    /* 弹窗关闭回调 */
    onClosed() {
      if (this.destroyOnClose) {
        this.show = false;
        this.suggestionKeywords = '';
        this.lastSuggestion = '';
        this.poiData = [];
        this.chooseIndex = null;
        this.suggestionData = [];
        this.chooseSuggestion = null;
      }
      this.$emit('closed');
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
}
</script>

<style>
/* 工具栏 */
.ele-map-picker-header {
  display: flex;
  align-items: center;
  padding: 8px 18px;
}

.ele-map-picker-header .ele-map-picker-header-search {
  flex: 1;
  padding-right: 16px;
}

.ele-map-picker-header .ant-select-auto-complete {
  max-width: 200px;
}

/* 地图 */
.ele-map-picker-body {
  display: flex;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  overflow: hidden;
}

.ele-map-picker-body .ele-map-picker-main {
  flex: 1;
  position: relative;
}

.ele-map-picker-body .ele-map-picker-main-plus {
  color: #1890ff;
  font-size: 12px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ele-map-picker-body .ele-map-picker-main-icon {
  width: 26px;
  position: absolute;
  left: 50%;
  bottom: 50%;
  margin-left: -13px;
}

/* poi列表 */
.ele-map-picker-body .ele-map-picker-poi-list {
  width: 300px;
  overflow: auto;
  border-top: 1px solid hsla(0, 0%, 60%, .15);
}

.ele-map-picker-body .ele-map-picker-poi-item {
  padding: 8px 30px 8px 44px;
  border-bottom: 1px solid hsla(0, 0%, 60%, .15);
  position: relative;
  cursor: pointer;
}

.ele-map-picker-body .ele-map-picker-poi-item:hover {
  background: hsla(0, 0%, 60%, .05);
}

.ele-map-picker-body .ele-map-picker-poi-item-icon {
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  font-size: 18px;
  opacity: .4;
}

.ele-map-picker-body .ele-map-picker-poi-item-title {
  font-size: 14px;
}

.ele-map-picker-body .ele-map-picker-poi-item-address {
  font-size: 12px;
  margin-top: 2px;
  opacity: .6;
}

.ele-map-picker-body .ele-map-picker-poi-item-check {
  position: absolute;
  top: 50%;
  right: 7px;
  transform: translateY(-50%);
  color: #1890ff;
  font-size: 14px;
  display: none;
}

.ele-map-picker-body .ele-map-picker-poi-item.active .ele-map-picker-poi-item-check {
  display: block;
}

/* 地图图标跳动动画 */
.ele-map-picker-body .ele-map-picker-anim-bounce {
  animation: eleMapPickerAnimBounce 500ms;
  animation-direction: alternate;
}

@keyframes eleMapPickerAnimBounce {
  0%, 60%, 75%, 90%, to {
    transition-timing-function: cubic-bezier(.215, .61, .355, 1)
  }
  0%, to {
    transform: translate3d(0, 0, 0)
  }
  25% {
    transform: translate3d(0, -10px, 0)
  }
  50% {
    transform: translate3d(0, -20px, 0)
  }
  75% {
    transform: translate3d(0, -10px, 0)
  }
}

/* 小屏幕适应 */
@media screen and (max-width: 768px) {
  .ele-map-picker-dialog {
    top: 0;
    padding: 0;
  }

  .ele-map-picker-body {
    display: block;
  }

  .ele-map-picker-body .ele-map-picker-main > div {
    height: 250px !important;
  }

  .ele-map-picker-body .ele-map-picker-poi-list {
    width: auto;
    height: calc(100vh - 370px) !important;
  }
}
</style>
