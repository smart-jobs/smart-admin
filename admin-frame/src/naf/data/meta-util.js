import _ from 'lodash';
import moment from 'moment';

/* 字段定义 */
export const FieldMeta = (meta) => {
  let { field, slots, listOpts } = meta;
  const { rules, formOpts, order = 0 } = meta;
  if (field === undefined) {
    const { name, label, required = false, readonly = false, editable = true } = meta;
    field = { name, label, required, readonly, editable };
  }
  if (_.isArray(field)) {
    const [name, label, required = false, readonly = false, editable = true] = field;
    field = { name, label, required, readonly, editable };
  }

  if (slots === undefined) {
    // 从meta对象中提取slots属性
    const { filter = false, list = true, form = true } = meta;
    slots = { filter, list, form };
  } else if (_.isObject(slots)) {
    // 处理slots默认值
    const { filter = false, list = true, form = true } = slots;
    slots = { filter, list, form };
  } else if (_.isArray(slots)) {
    slots = { filter: slots.includes('filter'), filter: slots.includes('list'), form: slots.includes('form') }
  }

  // 处理formatter
  let { formatter } = meta;
  if (!_.isFunction(formatter) && (_.isObject(formatter) || _.isString(formatter) || _.isArray(formatter))) {
    let { name, param } = _.isObject(formatter) ? formatter : {};
    if (_.isString(formatter)) {
      [name, param] = formatter.split(':', 2);
    } else if (_.isArray(formatter)) {
      [name, param] = formatter;
    }

    if (name === undefined) {
      formatter = undefined;
    } else if (name === 'dict' && param === undefined) {
      console.warn(`use ${formatter} formatter must set param,example: 'dict:status' `);
      formatter = undefined;
    } else {
      formatter = { name, param };
    }
  }

  return { field, rules, slots, order, formOpts, listOpts, formatter };
}

/* 列表操作列定义 */
export const Operation = (meta) => {
  let items = Object.entries(meta);
  if (_.isArray(meta)) {
    items = Object.values(meta);
  }
  return items.map(item => {
    if (_.isArray(item)) {
      let [event, label, icon, confirm = false ] = item;
      if(_.isBoolean(icon)){
        confirm = icon;
        icon = undefined;
      } 
      return { event, label, icon, confirm };
    }
    return item;
  });
}

// 预置formatter函数
const formatters = {
  date: (param) => (row, column, cellValue, index) => {
    if (cellValue) {
      return moment(cellValue).format(param||'YYYY-MM-DD');
    }
    return cellValue;
  },
  dict: (param) => {
    return function (row, column, cellValue, index) {
      if (_.isString(cellValue)) {
        return this.$dict(param, cellValue)
      }
      return cellValue;
    }
  },
}

export const Formatter = (meta, _this) => {
  // 处理formatter
  let { formatter } = meta;
  if (!_.isFunction(formatter) && _.isObject(formatter)) {
    const { name, param } = formatter;
    formatter = formatters[name](param);
    if (_this !== undefined) {
      formatter = formatter.bind(_this);
    }
  }
  if (!_.isFunction(formatter)) {
    formatter = undefined;
  }

  return formatter;
}

export const MergeFilters = (meta, _this) => {
  // 生成column filters
  let { formatter, listOpts } = meta;
  if (listOpts && listOpts.filterable && _.isObject(formatter) && formatter.name === 'dict') {
    let items = _this.$dict(formatter.param);
    if(!items || items.length > 20) return undefined;

    const filterMethod = (value, row, column) => {
      const property = column['property'];
      return row[property] === value;
    }

    const filters = items.map(p=>({text: p.name, value: p.code}));
    return { filters, filterMethod, ...listOpts };
  }
  return listOpts;
}
