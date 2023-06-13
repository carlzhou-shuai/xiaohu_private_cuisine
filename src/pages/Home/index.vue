<template>
  <view class="container">
    <scroll-view
      v-if="state.menu.length > 0"
      class="scroll-view"
      :enableFlex="true"
      :scroll-y="true"
      @scrolltolower="lower"
      @scroll="scroll"
    >
      <view v-for="item in state.menu" :key="item.productID" class="good">
        <Image
          class="good-image"
          :src="item.image"
          mode="aspectFill"
          :originalSrc="item.image"
          width="100%"
        />
        <view class="good-bottom">
          <view>
            <view class="good-name">{{ item.name }}</view>
            <view class="good-price">
              <nut-price
                :price="item.price"
                position="after"
                :symbol="currency"
                :decimal-digits="0"
                size="small"
              />
            </view>
          </view>
          <nut-button shape="round" size="mini" type="primary" plain @click="addCart(item)">
            <template #icon>
              <IconFont name="cart"></IconFont>
            </template>
          </nut-button>
        </view>
      </view>
    </scroll-view>
    <nut-empty image="error" description="加载失败" v-else>
      <div style="margin-top: 10px">
        <nut-button icon="refresh" type="primary" @click="getMenu">重试</nut-button>
      </div>
    </nut-empty>
    <!-- 底部导航栏 -->
    <Tabbar ref="tabbar"></Tabbar>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useDidShow } from '@tarojs/taro';
import Tabbar from '@/components/Tabbar';
import { IconFont } from '@nutui/icons-vue-taro';
import { apiGetMenu, apiAddCart } from '@/api/home';
const state = reactive({
  menu: []
});
const currency = ref(window.$currency);
const tabbar = ref();
useDidShow(() => {
  tabbar.value.current = 0; // 当前页面索引
  login();
  getMenu();
});
/**
 *获取菜单
 *@params
 *@returns
 */
const getMenu = () => {
  apiGetMenu().then(res => {
    state.menu = res.data;
  });
};
/**
 *添加到购物车
 *@params
 *@returns
 */
const addCart = good => {
  apiAddCart({ productID: good.productID }).then();
};
/**
 *登录
 *@params
 *@returns
 */
const login = () => {};
/**
 *触底事件
 *@params
 *@returns
 */
const lower = () => {
  console.log('触底了');
};
</script>

<style lang="scss">
.container {
  height: 100vh;
  // font-size: 20px;
  .scroll-view {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .good {
      width: 48%;
      overflow: hidden;
      background-color: #fff;
      margin: 7px;
      border-radius: 20px;
      .good-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: nowrap;
        padding: 10rpx 20rpx;
        .good-name {
          // color: #fa2c19;
          color: #333;
        }
      }
      .good-image {
        width: 100%;
      }
    }
  }
}
</style>
