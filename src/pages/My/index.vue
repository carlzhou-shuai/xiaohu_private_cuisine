<template>
  <view class="contianer">
    <!-- 用户信息 -->
    <view class="user">
      <open-data type="userAvatarUrl" class="user-avatar" />
      <open-data type="userNickName" class="user-nickname" />
    </view>
    <!-- 头部导航 -->
    <nut-navbar>
      <template #content>
        <nut-tabs v-model="state.orderStatus" @click="changeTabList">
          <nut-tab-pane title="制作中"> </nut-tab-pane>
          <nut-tab-pane title="已品尝"> </nut-tab-pane>
        </nut-tabs>
      </template>
    </nut-navbar>
    <!-- 订单 -->
    <view class="order" v-for="item in state.orders" :key="orderID">
      <view class="order-top">
        <view class="order-date">{{ moment(item.orderDate).format('YYYY-DD-MM') }}</view>
      </view>
      <view class="order-middle">
        <Image class="order-image" :src="item.goods[0].image" mode="aspectFill" width="100%" />
        <view class="order-goods">
          {{ item.goods.map(v => v.name).join('+') }}
        </view>
        <view class="order-price"> {{ item.goods.reduce((a, v) => a + v.price, 0) }}元 </view>
      </view>
      <view class="order-bottom">
        <nut-button plain type="primary" v-if="item.status == 'finish'" size="small"
          >评价</nut-button
        >
        <template v-else>
          <nut-button plain type="primary" size="small">提醒制作</nut-button>
          <nut-button
            style="margin-left: 8px"
            plain
            type="primary"
            @click="finish(item.goods.map(v => v.orderID))"
            size="small"
            >已品尝</nut-button
          >
        </template>
      </view>
    </view>
    <!-- 底部导航栏 -->
    <Tabbar ref="tabbar"></Tabbar>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useDidShow } from '@tarojs/taro';
import Tabbar from '@/components/Tabbar';
import { apiGetOrder, apiSetFinish } from '@/api/my.js';
import moment from 'moment';
const state = reactive({
  orders: [],
  orderStatus: 0 // 0 doing 制作中 1 finish 已品尝
});
const tabbar = ref();

useDidShow(() => {
  tabbar.value.current = 4; // 当前页面索引
  getOrder();
});

const getOrder = () => {
  apiGetOrder({ status: ['doing', 'finish'][state.orderStatus] }).then(res => {
    // 把订单 归类
    const orginOrder = res.data;
    const dates = [...new Set(orginOrder.map(v => v.orderDate))];
    state.orders = dates.map(v => {
      return {
        orderDate: v,
        status: ['doing', 'finish'][state.orderStatus],
        goods: orginOrder.filter(i => i.orderDate == v)
      };
    });
  });
};

const changeTabList = val => {
  state.orderStatus = val.paneKey;
  state.orders = [];
  getOrder();
};

const finish = orderIDs => {
  apiSetFinish({ orderIDs }).then();
  getOrder();
};
</script>

<style lang="scss">
.contianer {
  .user {
    background-color: #fff;
    display: flex;
    padding: 20px;
    align-items: center;
    color: #333;
    .user-avatar {
      width: 100px;
      height: 100px;
      margin-right: 28px;
    }
    .user-nickname {
    }
  }
  .order {
    background-color: #fff;
    border-radius: 20px;
    padding: 20px;
    margin: 20px;
    .order-top {
      font-size: 28px;
    }
    .order-middle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 0;
      .order-image {
        width: 100px;
        height: 100px;
        border-radius: 10px;
      }
      .order-goods {
        flex: 1;
        color: #666;
        padding: 20px;
      }
      .order-price {
        width: 100px;
      }
    }
    .order-bottom {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
