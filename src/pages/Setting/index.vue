<template>
  <view class="container">
    <nut-form :model-value="formData" ref="ruleForm">
      <nut-form-item
        label="菜名"
        prop="name"
        required
        :rules="[{ required: true, message: '请输入菜名' }]"
      >
        <nut-input
          class="nut-input-text"
          v-model="formData.name"
          placeholder="请输入菜名"
          type="text"
        />
      </nut-form-item>
      <nut-form-item
        label="价格（￥）"
        prop="price"
        required
        :rules="[
          { required: true, message: '请输入价格' },
          { validator: customValidator, message: '必须是数字' }
        ]"
      >
        <nut-input
          class="nut-input-text"
          v-model="formData.price"
          placeholder="请输入价格"
          type="text"
        />
      </nut-form-item>
      <nut-form-item
        label="图片"
        prop="image"
        required
        :rules="[{ required: true, message: '请上传图片' }]"
      >
        <nut-uploader
          ref="upload"
          :url="uploadurl"
          :media-type="['image']"
          :multiple="false"
          maximum="1"
          @success="uploadSuccess"
          @delete="uploadDelete"
          @progress="onProgress"
          v-model="fileList"
        ></nut-uploader>
        <nut-progress
          style="margin-top: 10px"
          :percentage="progressPercentage"
          stroke-color="linear-gradient(270deg, rgba(18,126,255,1) 0%,rgba(32,147,255,1) 32.815625%,rgba(13,242,204,1) 100%)"
          :status="progressPercentage == 100 ? '' : 'active'"
        >
        </nut-progress>
      </nut-form-item>
      <nut-form-item label="备注" prop="description">
        <nut-textarea
          placeholder="请输入备注"
          type="text"
          v-model="formData.description"
          limit-show
          max-length="200"
        />
      </nut-form-item>
      <nut-button type="primary" style="margin: 10px; float: right" @click="submit"
        >提交</nut-button
      >
      <nut-button type="primary" style="margin: 10px; float: right" @click="reset">重置</nut-button>
    </nut-form>
    <!-- 底部导航栏 -->
    <Tabbar ref="tabbar"></Tabbar>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useDidShow } from '@tarojs/taro';
import Tabbar from '@/components/Tabbar';
import { apiAddMenu } from '@/api/setting.js';
import Taro from '@tarojs/taro';
const tabbar = ref();
const ruleForm = ref();
const upload = ref();
const uploadurl = ref(window.$baseURL + '/upload'); //上传路径
const progressPercentage = ref(0); //进度
const defaultFormData = {
  name: '', //菜名
  price: '', //价格
  description: '', //备注
  image: '' //图片
};
const formData = reactive({ ...defaultFormData });
const fileList = reactive([]);

useDidShow(() => {
  tabbar.value.current = 2; // 当前页面索引
});
/**
 *表单提交
 *@params
 *@returns
 */
const submit = () => {
  ruleForm.value.validate().then(({ valid, errors }) => {
    if (valid) {
      apiAddMenu(formData).then(res => {
        // 提示添加成功
        Taro.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000
        });
        // 重置表单
        reset();
      });
    } else {
      console.log('error submit!!', errors);
    }
  });
};
/**
 *重置校验和表单
 *@params
 *@returns
 */
const reset = () => {
  ruleForm.value.reset();
  Object.assign(formData, defaultFormData);
  upload.value.clearUploadQueue();
  progressPercentage.value = 0;
};
/**
 *图片上传成功
 *@params data,option,fileItem
 *@returns
 */
const uploadSuccess = result => {
  formData.image = JSON.parse(result.data.data).data.url;
};
/**
 *图片删除
 *@params files,fileList,index
 *@returns
 */
const uploadDelete = e => {
  formData.image = '';
  progressPercentage.value = 0;
};
/**
 *上传进度
 *@params
 *@returns
 */
const onProgress = ({ event, options, percentage }) => {
  progressPercentage.value = percentage;
};
/**
 *校验数字
 *@params
 *@returns
 */
const customValidator = val => /^\d+$/.test(val);
</script>

<style lang="less"></style>
