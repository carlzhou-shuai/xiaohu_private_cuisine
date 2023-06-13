<template>
  <view class="contianer">
    正在施工！！！！
    <!-- 底部导航栏 -->
    <Tabbar ref="tabbar"></Tabbar>
  </view>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue';
import { useDidShow } from '@tarojs/taro';
import Tabbar from '@/components/Tabbar';
import { apiGetOrder } from '@/api/my.js';
const state = reactive({
  orders: []
});
const tabbar = ref();

useDidShow(() => {
  tabbar.value.current = 1; // 当前页面索引
  // getOrder();
});

const getOrder = () => {
  apiGetOrder().then(res => {
    state.orders = res.data;
  });
};
</script>

<style lang="scss"></style>
