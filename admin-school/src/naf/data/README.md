# 基于数据驱动的数据视图，具备增删改查基础功能
## 组件说明
### list
弃用，用filter-grid代替
### lite-grid
简单数据列表，不包含查询和分页
### filter-grid
组合数据列表，包含查询和分页功能
### meta-util
数据定义处理工具包
### 其他
demo-table 演示数据列表
naf-table 最早构建的代码框架，已无用

## 字段定义
### Meta定义形式1
{
  name: String, //字段名称
  label: String, //显示名称
  required: Boolean, //是否必须
  readonly: Boolean, //字段是否只读，默认false
  editable: Boolean, //字段是否支持编辑，默认true
  slots: Array, // 显示区域，默认为['list', 'form']，可选值：'list'、'form'、'filter'
  rules: Array, //表单校验规则
  order: Number, // 显示顺序，默认为0，数字越大越靠前
  listOpts: Object, //数据列表可选参数
  formOpts: Object, //数据表单可选参数
}
### Meta定义形式2
{
  field: {
    name: String, //字段名称
    label: String, //显示名称
    required: Boolean, //是否必须
    readonly: Boolean, //字段是否只读，默认false
    editable: Boolean, //字段是否支持编辑，默认true
  },
  slots: Array, // 显示区域，默认为['list', 'form']，可选值：'list'、'form'、'filter'
  rules: Array, //表单校验规则
  order: Number, // 显示顺序，默认为0，数字越大越靠前
  listOpts: Object, //数据列表可选参数
  formOpts: Object, //数据表单可选参数
}
### Meta定义形式3
{
  field: [name,label,required,readonly,editable,filter],
  slots: Object, // 显示区域，示例：{ filter: false, list: true, form: true }
  rules: Array, //表单校验规则
  order: Number, // 显示顺序，默认为0，数字越大越靠前
  listOpts: Object, //数据列表可选参数
  formOpts: Object, //数据表单可选参数
}
### Meta定义形式4(预留，暂不支持)
[
  [name,label,required,readonly,editable,filter],
  [slots: Array], // 显示区域，默认为['list', 'form']，可选值：'list'、'form'、'filter'
  [rules: Array], //表单校验规则
  [
    order: Number, // 显示顺序，默认为0，数字越大越靠前
    listOpts: Object, //数据列表可选参数
    formOpts: Object, //数据表单可选参数
  ]
]

## 列表操作定义
### 定义形式1-简单对象
{
  edit: '编辑',
  delete: '删除',
  view: '查看',
}

### 定义形式2-简单数组
[
  [ 'edit', '编辑' ],
  [ 'delete', '删除', true /*是否进行确认提示*/ ],
  [ 'view', '查看' ],
]

### 定义形式3-数组对象(终极形态)
[
  { event: 'edit', label: '编辑' },
  { event: 'delete', label: '删除', confirm: true },
  { event: 'view', label: '查看' },
]


