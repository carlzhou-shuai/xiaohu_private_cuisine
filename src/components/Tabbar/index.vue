<!--
* @author zhouchun
* @time 2023-06-01
* @desc 底部导航
-->
<template>
  <nut-tabbar bottom safe-area-inset-bottom placeholder v-model="current" @tab-switch="onTabSwitch">
    <nut-tabbar-item v-for="(item, index) in List" :tab-title="item.title" :icon="item.icon">
    </nut-tabbar-item>
  </nut-tabbar>
</template>
<script>
import { h, ref, onMounted } from 'vue';
import Taro from '@tarojs/taro';
import { Home, Category, Setting, Cart, My } from '@nutui/icons-vue-taro';

export default {
  components: { Home, Category, Setting, Cart, My },
  setup() {
    const List = [
      {
        title: '推荐',
        icon: h(Home),
        path: '/pages/Home/index'
      },
      {
        title: '分类',
        icon: h(Category),
        path: '/pages/Category/index'
      },
      {
        title: '新增菜品',
        icon: h(Setting),
        path: '/pages/Setting/index'
      },
      {
        title: '购物车',
        icon: h(Cart),
        path: '/pages/Cart/index'
      },
      {
        title: '我的订单',
        icon: h(My),
        path: '/pages/My/index'
      }
    ];
    const current = ref(0);
    const onTabSwitch = val => {
      Taro.switchTab({
        url: List[val.state.index].path
      });
    };
    onMounted(() => {});
    return {
      List,
      current,
      onTabSwitch
    };
  }
};
</script>
