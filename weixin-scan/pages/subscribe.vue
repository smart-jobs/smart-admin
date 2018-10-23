<template>
  <info title="未关注公众号" message="请识别二维码关注公众号">
    <img src="~/static/qrcode_for_gh_cc6425d359a6_344.jpg" width="70%">
  </info>
</template>

<script>
import Info from '@/components/info';

export default {
  components: {
    Info,
  },
  head: {
    title: '未关注公众号',
  },
};
</script>
