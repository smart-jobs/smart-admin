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
        <el-button icon="el-icon-plus" type="primary" size="mini" v-if="!readonly">添加</el-button>
      </slot>
    </el-header>
    <el-main class="table-area">
      <el-table border style="width: 100%;overflow: auto;" v-bind="options" :data="data">
        <slot>
          <el-table-column v-for="(item,index) in listFields" :key="'field'+index" :label="item.label" 
            :prop="item.name" v-bind="item.options" show-overflow-tooltip/>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button v-for="(item,index) in operItems" :key="'field'+index" @click="handleOper(item, scope.row)" type="text" size="small">{{item.label}}</el-button>
            </template>
          </el-table-column>
        </slot>
      </el-table>
    </el-main>
    <el-footer height="36px" v-if="paging">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 50, 100, 200]" :page-size="size" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    </el-footer>
  </el-container>
</template>
<script>
import { FieldMeta, Operation } from './meta-util';

export default {
  name: 'demo-table',
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
    operation: {
      default: () => [['edit', '编辑'], ['delete', '删除', true]]
    } /* 操作类型 */,
    data: Array,
    total: { type: Number, default: 0 } /* 总数据条数 */
  },
  data() {
    return {
      page: 1,
      size: 20,
      filterData: {
        name: '',
        value: ''
      }
    };
  },
  methods: {
    async query() {
      this.$emit('query', {
        filter: { [this.filterData.name]: this.filterData.value },
        paging: { page, size }
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
    async handleOper({ event, label, confirm }, data) {
      try {
        if (confirm) {
          await this.$confirm(`是否${label}此数据?`, '请确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          });
        }
        this.$emit(event, data);
      } catch (err) {
        if (err == 'cancel') {
          this.$message({
            type: 'info',
            message: `已取消${label}`
          });
        }
      }
    },
    resetPage() {
      // TODO: 重置分页数据
      this.page = 0;
      this.size = 20;
    }
  },
  computed: {
    filterFields() {
      return this.meta
        .map(FieldMeta)
        .filter(p => p.slots.filter)
        .sort((a, b) => b.order - a.order)
        .map(p => p.field);
    },
    listFields() {
      const res = this.meta
        .map(FieldMeta)
        .filter(p => p.slots.list)
        // .sort((a, b) => b.order - a.order)
        .map(p => ({ ...p.field, options: p.listOpts }));
      // console.log('listFields: ', res);
      return res;
    },
    operItems() {
      return Operation(this.operation);
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
.table-area {
  padding: 0;
}
</style>
