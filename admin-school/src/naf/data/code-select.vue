<template>
  <el-select v-model="selected" :placeholder="placeholder || '请选择'" @change="handleChange">
    <el-option v-for="(item,_index) in $dict(category)" :key="'option-item-'+_index" :label="item.name" :value="item.code" :disabled="item.status == '1'"></el-option>
  </el-select>
</template>
<script>

export default {
  name: 'code-select',
  props: {
    value: { required: true },
    category: { type: String, required: true },
    placeholder: String,
  },
  data() {
    return {
      selected: this.value,
    };
  },
  methods: {
    handleChange() {
      this.$emit('input', this.selected);
      this.$emit('change', this.selected);
    }
  },
};
</script>
