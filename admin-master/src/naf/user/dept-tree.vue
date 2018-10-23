<template>
  <div class="nav-tree">
    <el-tree ref="tree" :data="treeItems" :props="navProps" node-key="id" @node-click="handleNavClick" :highlight-current="true"></el-tree>
  </div>
</template>
<script>
export default {
  props: {
    navItems: Array,
    dataItems: Array,
  },
  data() {
    return {
      navProps: {
        children: 'children',
        label: 'name'
      },
    };
  },
  methods: {
    handleNavClick(data) {
      this.$emit('selected', data);
    },
    setCurrentKey(key) {
      this.$refs['tree'].setCurrentKey(key);
    }
  },
  computed: {
    treeItems() {
      if(this.navItems) return this.navItems;
      const items = this.dataItems || [];
      const root = items.filter(a=> !items.some(b=>b.id === a.parentid));
      const fetchChildren = (item)=> {
        if(!item.path) item.path = [item.name];
        const children = items.filter(p=> p.parentid === item.id)
                              .map(p=> fetchChildren({...p, parent: item, path: item.path.concat(p.name)}));
        return { ...item, children };
      };
      return root.map(p=> fetchChildren(p));
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
</style>
