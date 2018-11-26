<template>
  <el-container class="container">
    <el-header height="36px" style="line-height:36px;" v-if="filter || action">
      <slot name="filter" v-if="filter">
        <div class="filter-box">
          <el-input placeholder="请输入内容" class="input-with-select" :clearable="true" size="mini" v-model="filterData.value">
            <el-select slot="prepend" placeholder="请选择" width="110" v-model="filterData.name">
              <el-option v-for="(item,index) in filterFields" :label="item.label" :value="item.name" :key="'filter'+index"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="query"></el-button>
          </el-input>
        </div>
      </slot>
      <slot name="action" v-if="action">
        <el-button icon="el-icon-plus" type="primary" size="mini" v-if="!readonly" @click="$emit('add-new')">添加</el-button>
      </slot>
    </el-header>
    <el-main class="table-area">
      <lite-grid :data="data" :meta="meta" :options="options" :readonly="readonly" :operation="operation" @oper="handleOper">
        <slot>
        </slot>
      </lite-grid>
    </el-main>
    <el-footer height="36px" v-if="paging">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 50, 100, 200]" :page-size="size" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </el-footer>
  </el-container>
</template>
<script>
import { FieldMeta } from './meta-util';
import LiteGrid from './lite-grid';

export default {
  name: 'filter-grid',
  components: {
    LiteGrid
  },
  props: {
    meta: { type: Array, required: true },
    readonly: Boolean /* 是否显示操作列 */,
    filter: { type: Boolean, default: false } /* 是否显示查询 */,
    action: { type: Boolean, default: false } /* 是否显操作按钮 */,
    paging: { type: Boolean, default: false } /* 是否显示分页 */,
    options: {
      type: Object,
      default: () => ({ size: 'mini' })
    } /* 表格扩展属性 */,
    operation: Array,
    data: Array,
    total: { type: Number, default: 0 }, /* 总数据条数 */
    pageSize: { type: Number, default: 10 }
  },
  data() {
    return {
      page: 1,
      size: this.pageSize,
      filterData: {
        name: '',
        value: ''
      }
    };
  },
  methods: {
    async query() {
      let filter = { [this.filterData.name]: this.filterData.value };
      if(this.filterData.name == undefined || this.filterData.value == undefined || this.filterData.value == '') {
        filter = undefined;
      }
      this.$emit('query', {
        filter,
        paging: { page: this.page, size: this.size }
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.size = val;
      if (this.total === 0) return;
      const pages = Math.floor((this.total + val) / val);
      if (pages < this.page) this.page = pages;
      this.query();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;
      this.query();
    },
    async handleOper({ event, data }) {
      this.$emit(event, data);
    },
    resetPage() {
      this.page = 1;
    }
  },
  computed: {
    filterFields() {
      return this.meta
        .map(FieldMeta)
        .filter(p => p.slots.filter)
        .sort((a, b) => b.order - a.order)
        .map(p => p.field);
    }
  }
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
}
.el-table {
  height: 100%;
  overflow: auto;
}
.filter-box {
  width: 280px;
  display: inline-block;
  .el-select {
    width: 100px;
  }
}
.el-main {
  padding: 10px 20px;
}
// .table-area {
//   padding: 0;
// }
</style>
