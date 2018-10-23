<template>
  <el-dialog :title="title" :visible.sync="visible" width="600px" :close-on-click-modal="false">
    <div class="content">
      <div class="left">
      <el-scrollbar>
        <el-tree ref="tree" :data="treeItems" :props="navProps" node-key="_id" @node-click="handleNavClick" :highlight-current="true">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>
              <i class="prefix naf-icons naf-icon-user1" v-if="data.userid"/>
              <i class="prefix naf-icons naf-icon-folder1" v-else/>
              {{ node.label }}
            </span>
            <span>
              <i class="suffix naf-icons naf-icon-ok" v-show="inSelected(data)"/>
            </span>
          </span>
        </el-tree>
      </el-scrollbar>
      </div>
      <div class="right">
      <el-scrollbar >
        <el-tree ref="selected" :data="selected" :props="navProps" node-key="id" :highlight-current="true">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>
              <i class="prefix naf-icons naf-icon-user1" v-if="data.userid"/>
              <i class="prefix naf-icons naf-icon-folder1" v-else/>
              {{ node.label }}
            </span>
            <span style="float: right">
              <i class="suffix naf-icons naf-icon-close" />
            </span>
          </span>
        </el-tree>
      </el-scrollbar>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('cancel')" :size="options.size">取 消</el-button>
      <el-button type="primary" @click="$emit('ok', selected)" :size="options.size">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { mapState } from 'vuex';
import _ from 'lodash';

export default {
  props: {
    options: {
      type: Object,
      default: () => ({ size: 'small' })
    } /* form options */,
    title: String,
    visible: { type: Boolean, default: true }
  },
  data() {
    return {
      navProps: {
        children: 'children',
        label: 'name'
      },
      selected: [],
    };
  },
  methods: {
    handleNavClick(data) {
      // this.$emit('selected', data);
      const idx = this.selected.findIndex(p=>(_.isNumber(data.id) && p.id === data.id) || (_.isString(data.userid) && p.userid === data.userid));
      console.log('idx:', idx);
      if(idx === -1) {
        this.selected.push(_.omit(data, ['children']));
      } else {
        this.selected.splice(idx, 1);
      }
    },
    inSelected(data) {
      return this.selected.some(p=>(_.isNumber(data.id) && p.id === data.id) || (_.isString(data.userid) && p.userid === data.userid));
    }
  },
  computed: {
    ...mapState({
      deptItems: state => state.system.dept.items,
      userItems: state => state.system.user.items
    }),
    treeItems() {
      if (this.navItems) return this.navItems;
      const items = this.deptItems || [];
      const root = items.filter(a => !items.some(b => b.id === a.parentid));
      const fetchChildren = item => {
        const children = items
          .filter(p => p.parentid === item.id)
          .map(p => fetchChildren(p));
        const users = this.userItems.filter(
          p => p.department && p.department.includes(item.id)
        );
        return { ...item, children: [...children, ...users] };
      };
      const rootUsers = this.userItems.filter(
        p => p.department && p.department.includes(0)
      );
      return root.map(p => fetchChildren(p)).concat(rootUsers);
    }
  }
};
</script>
<style lang="less" scoped>
.nav-tree {
  /deep/ .el-tree-node.is-current > .el-tree-node__content {
    background-color: #409eff;
    color: white;
    .naf-icon-dian {
      display: inline;
      color: white;
    }
  }
  /deep/ .naf-icon-dian {
    display: none;
  }
  /deep/ .el-tree-node__content:hover .naf-icon-dian {
    display: inline;
  }
}

.content {
  display: flex;
  flex-direction: row;
  height: 340px;
}

.left {
  flex: 1;
}
.right {
  width: 240px;
}

.naf-icons.prefix {
  color: grey;
}
.naf-icons.suffix {
  color: lightgrey;
}

.custom-tree-node {
  flex: 1; 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  font-size: 14px; 
  padding-right: 8px;
}

.el-scrollbar{
  height: 100%;
}
</style>
