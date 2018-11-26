<template>
  <el-form ref="form" :model="form" :rules="rules" v-bind="options">
    <slot>
      <el-form-item v-for="(item,index) in fields" :key="'form-field-'+index" :label="item.field.label" :prop="item.field.name" :required="item.field.required" :rules="item.rules" v-bind="item.formOpts">
        <el-select v-if="item.dict" v-model="form[item.field.name]" placeholder="请选择">
          <el-option v-for="(_item,_index) in item.dict" :key="'option-item-'+_index" :label="_item.name" :value="_item.code" :disabled="_item.status == '1'"></el-option>
        </el-select>        
        <el-checkbox v-else-if="item.formOpts && item.formOpts.inputType=='checkbox'" v-model="form[item.field.name]" :disabled="readonly || item.field.readonly || (!isNew && item.field.editable === false)" >{{item.formOpts && item.formOpts.placeholder}}</el-checkbox>
        <el-input v-else v-model="form[item.field.name]" :disabled="readonly || item.field.readonly || (!isNew && item.field.editable === false)" :placeholder="item.formOpts && item.formOpts.placeholder" :type="item.formOpts && item.formOpts.inputType"></el-input>
      </el-form-item>
      <el-form-item v-show="!readonly">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="info" @click="$emit('cancel')">取消</el-button>
      </el-form-item>
    </slot>
  </el-form>
</template>
<script>
import { FieldMeta } from './meta-util';

export default {
  name: 'data-form',
  props: {
    data: { type: Object, required: true },
    meta: { type: Array, required: true },
    rules: Object,
    readonly: { type: Boolean, default: false } /* 是否只读 */,
    isNew: { type: Boolean, default: false } /* 是否新创建 */,
    options: Object
  },
  data() {
    return {
      form: { ...this.data }
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
    },
    mergeRules(meta) {
      if( meta.field.required && 
          (!this.rules || !this.rules[meta.field.name] || !this.rules[meta.field.name].some(p=>p.required)) &&
          (!meta.rules || !meta.rules || !meta.rules.some(p=>p.required))){
        const rules = meta.rules || [];
        rules.push({ required: true, message: '不能为空', trigger: 'blur' });
        return rules;
      } else {
        return meta.rules;
      }
    },
    validateField(payload){
      this.$refs['form'].validateField(payload);
    }
  },
  computed: {
    fields() {
      return this.meta
        .map(FieldMeta)
        .filter(p => p.slots.form)
        .sort((a, b) => b.order - a.order)
        .map(p=>({
          ...p, dict: this.$dict && p.formatter && p.formatter.name === 'dict' && this.$dict(p.formatter.param), rules: this.mergeRules(p)
        }));
    }
  }
};
</script>
