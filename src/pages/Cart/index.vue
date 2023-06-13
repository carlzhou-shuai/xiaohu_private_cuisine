<template>
  <view class="container">
    <scroll-view class="scroll-view" :enableFlex="true" :scroll-y="true">
      <view v-for="item in state.cart" :key="item.orderID" class="cart">
        <view class="cart-left">
          <nut-checkbox class="cart-left-checkbox" v-model="item.checked"></nut-checkbox>
          <Image
            class="cart-left-image"
            :src="item.image"
            mode="aspectFill"
            :originalSrc="item.image"
            width="100%"
          />
        </view>
        <view class="cart-right">
          <view class="cart-right-name">{{ item.name }}</view>
          <view class="cart-right-description">{{ item.description }}</view>
          <view class="cart-right-price">
            <nut-price
              :price="item.price * item.quantity"
              position="after"
              :symbol="currency"
              :decimal-digits="0"
              size="small"
          /></view>
          <view class="cart-right-quantity">
            <nut-input-number
              v-model="item.quantity"
              @change="
                value => {
                  onChange(value, item.orderID);
                }
              "
            />
          </view>
        </view>
      </view>
    </scroll-view>
    <nut-cell class="cart-option">
      <a
        v-if="state.checked"
        @click="
          () => {
            state.checked = !state.checked;
          }
        "
        >编辑</a
      >
      <a
        v-else
        @click="
          () => {
            state.checked = !state.checked;
          }
        "
        >取消</a
      >
      <nut-button size="small" type="primary" v-if="!state.checked" @click="handleDelete"
        >删除</nut-button
      >
      <view v-else class="cart-option-order">
        <a @click="() => startOrder()">下单</a>
        <nut-divider
          direction="vertical"
          :style="{
            borderColor: '#fff',
            top: 0
          }"
        />
        <a @click="() => (state.isVisible = true)">预定</a>
      </view>
    </nut-cell>
    <!-- 时间选择 -->
    <nut-calendar
      v-model:visible="state.isVisible"
      :default-value="state.defaultDate"
      @close="() => (state.isVisible = false)"
      @choose="setChooseValue"
    >
    </nut-calendar>
    <!-- 底部导航栏 -->
    <Tabbar ref="tabbar"></Tabbar>
  </view>
</template>

<script setup>
import Taro from '@tarojs/taro';
import moment from 'moment';
import { reactive, ref, computed } from 'vue';
import { useDidShow } from '@tarojs/taro';
import Tabbar from '@/components/Tabbar';
import { apiGetCart, apiUpdateCart, apiDeleteCart, apiStartOrder } from '@/api/cart.js';

const state = reactive({
  cart: [],
  checked: true, // 编辑
  isVisible: false, //日历显隐
  defaultDate: moment(new Date()).format('YYYY-MM-DD'), //默认当天
  reserveDate: null //预定日期
});
const tabbar = ref();
const currency = ref(window.$currency);
// 计算属性 ref
const checkedOrderIDs = computed(() => {
  return state.cart.filter(v => v.checked).map(v => v.orderID);
});
useDidShow(() => {
  tabbar.value.current = 3; // 当前页面索引
  getCart();
});

const getCart = () => {
  apiGetCart().then(res => {
    state.cart = res.data;
  });
};

const onChange = (quantity, orderID) => {
  apiUpdateCart({ quantity, orderID }).then();
};

const handleDelete = () => {
  apiDeleteCart({ orderIDs: checkedOrderIDs.value }).then(() => getCart());
};

/**
 *下单 | 预定
 *@params
 *@returns
 */
const startOrder = reserveDate => {
  if (checkedOrderIDs.value.length == 0) {
    Taro.showToast({
      title: '请先勾选',
      icon: 'error',
      duration: 2000
    });
    return;
  }
  apiStartOrder({
    orderIDs: checkedOrderIDs.value,
    orderDate: reserveDate ? reserveDate : state.defaultDate
  }).then(() => {
    Taro.showToast({
      title: '下单成功',
      icon: 'success',
      duration: 2000
    });
    getCart();
  });
};

const setChooseValue = param => {
  state.reserveDate = param[3];
  startOrder(param[3]);
};
</script>

<style lang="scss">
.container {
  .cart {
    display: flex;
    justify-content: space-between;
    height: 300px;
    background-color: #fff;
    border-radius: 20px;
    margin-bottom: 20px;
    .cart-left {
      width: 350px;
      display: flex;
      .cart-left-checkbox {
        display: flex;
        justify-content: center;
        padding-left: 28px;
        box-sizing: border-box;
        width: 50px;
      }
      .cart-left-image {
        width: 300px;
        height: 300px;
      }
    }
    .cart-right {
      flex: auto;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .cart-right-description {
        color: #888;
        font-size: 24px;
        height: 40%;
      }
      .cart-right-name,
      .cart-right-description {
        padding: 0 40px;
      }
      .cart-right-quantity,
      .cart-right-price {
        display: flex;
        justify-content: flex-end;
        padding: 0 40px;
      }
    }
  }
  .cart-option {
    display: flex;
    justify-content: space-between;
    position: fixed;
    bottom: 153px;
    align-items: center;
    background-color: #fff;
    z-index: 9;
    .cart-option-order {
      width: 200px;
      height: 60px;
      border: 1px solid #fff;
      background-color: #fa2c19;
      color: #fff;
      border-radius: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
