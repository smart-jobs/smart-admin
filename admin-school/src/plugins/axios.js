import Vue from 'vue';
// import NafCore from 'naf-core';
// const { BusinessError } = NafCore.Error;

var vm = new Vue({})

export default function ({ $axios, redirect, app }) {
  $axios.onRequest(config => {
    if (process.browser) {
      vm.$loading()
    }
  })

  $axios.onResponse(response => {
    if (process.browser) {
      let load = vm.$loading();
      load.close();
      const res = response.data;
      if (res.errcode) {
        // console.log('response: ', response);
        console.error(`请求发生错误：${res.errcode}, ${res.errmsg}`);
        // vm.$message({
        //   type: 'error',
        //   message: res.errmsg || '请求失败',
        //   duration: 3000
        // });
        // vm.$notify({
        //   title: '错误',
        //   message: res.errmsg || '请求发生错误',
        //   type: 'error'
        // });
        // throw new BusinessError(res.errcode, res.errmsg);
      }
    }
  })

  $axios.onError(error => {
    if (process.browser) {
      let load = vm.$loading();
      load.close();
    }
    const code = parseInt(error.response && error.response.status)
    if (code === 400) {
      redirect('/400')
    } else if (code === 403) {
      redirect('/login')
    }
  })
}
