<template>
  <el-dialog :title="isNew?'起草公文':'修改草稿'" :visible.sync="visible" :close-on-click-modal="false">
    <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="80px">
      <slot>
        <el-form-item label="文号" prop="docNo" :required="true">
          <el-input v-model="form.docNo"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title" :required="true">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="接收单位" prop="receiveUnit" :required="true">
          <el-input v-model="form.receiveUnit"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content" :required="true">
          <el-input v-model="form.content" type="textarea" rows="6"></el-input>
        </el-form-item>
        <el-form-item label="附件" prop="attachment">
          <el-input v-model="form.attachment"></el-input>
        </el-form-item>
        <el-form-item label="是否回执" prop="hasReceipt">
          <el-checkbox v-model="form.hasReceipt"></el-checkbox>
        </el-form-item>
        <el-form-item label="回执字段" prop="receiptFields" :required="form.hasReceipt">
          <el-input v-model="form.receiptFields"></el-input>
        </el-form-item>
      </slot>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('cancel')" :size="mini">取 消</el-button>
      <el-button type="primary" @click="handleSave" :size="mini">保存草稿</el-button>
      <el-button type="primary" @click="handleSave" :size="mini">立即递送</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'data-dlg',
  props: {
    data: { type: Object, required: true },
    rules: Object,
    isNew: { type: Boolean, default: false } /* 是否新创建 */,
    visible: { type: Boolean, default: true },
  },
  data() {
    return {
      form: { ...this.data },
    };
  },
  methods: {
    handleSave() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$emit('save', { isNew: this.isNew, data: this.form });
        } else {
          console.warn('form validate error!!!');
        }
      });
    }
  },
};
</script>
