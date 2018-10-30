<template>
  <el-dialog :title="title" :visible.sync="visible" :width="width" :close-on-click-modal="false" @close="$emit('cancel')">
    <el-form ref="form" :model="form" :rules="rules" v-bind="options">
      <slot>
        <el-form-item v-for="(item,index) in fields" :key="'form-field-'+index" :label="item.field.label" :prop="item.field.name" :required="item.field.required" :rules="item.rules" v-bind="item.formOpts">
          <el-select v-if="item.dict" v-model="form[item.field.name]" placeholder="请选择">
            <el-option v-for="(_item,_index) in item.dict" :key="'option-item-'+_index" :label="_item.name" :value="_item.code" :disabled="_item.status == '1'"></el-option>
          </el-select>        
          <el-checkbox v-else-if="item.formOpts && item.formOpts.inputType=='checkbox'" v-model="form[item.field.name]" :disabled="readonly || item.field.readonly || (!isNew && item.field.editable === false)" >{{item.formOpts && item.formOpts.placeholder}}</el-checkbox>
          <el-input v-else v-model="form[item.field.name]" :disabled="readonly || item.field.readonly || (!isNew && item.field.editable === false)" :placeholder="item.formOpts && item.formOpts.placeholder" :type="item.formOpts && item.formOpts.inputType"></el-input>
        </el-form-item>
      </slot>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('cancel')" :size="options.size">取 消</el-button>
      <el-button type="primary" @click="handleSave" :size="options.size" v-show="!readonly">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { FieldMeta } from './meta-util';

export default {
  name: 'data-dlg',
  props: {
    data: { type: Object, required: true },
    meta: { type: Array, required: true },
    rules: Object,
    readonly: { type: Boolean, default: false } /* 是否只读 */,
    isNew: { type: Boolean, default: false } /* 是否新创建 */,
    options: {
      type: Object,
      default: () => ({ size: 'small' })
    } /* form options */,
    width: String,
    title: String,
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
  computed: {
    fields() {
      return this.meta
        .map(FieldMeta)
        .filter(p => p.slots.form)
        .sort((a, b) => b.order - a.order);
    }
  }
};
</script>
