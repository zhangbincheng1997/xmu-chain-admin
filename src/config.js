export default {
  dialogTitle: {
    DETAIL: '详细信息',
    ADD: '添加',
    UPDATE: '更新',
    ROLE: '设置角色',
    MENU: '设置菜单',
    PERMISSION: '设置权限',
    PWD: '重置密码',
    QRCODE: '二维码',
    GENERATE: '生成防伪码'
  },
  genderOptions: [
    { label: 0, value: '未知' },
    { label: 1, value: '男' },
    { label: 2, value: '女' }
  ],
  methodOptions: [
    { label: '*', value: '*' },
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
    { label: 'PUT', value: 'PUT' },
    { label: 'DELETE', value: 'DELETE' }
  ],
  orderStatusOptions: [
    { label: '订单关闭（申请人）', value: -1 },
    { label: '订单关闭（管理员）', value: -2 },
    { label: '新订单（申请人）', value: 0 },
    { label: '已接单（管理员）', value: 1 },
    { label: '已发货（管理员）', value: 2 },
    { label: '已收货（申请人）', value: 3 }
  ],
  orderStatusMap: {
    0: '新订单（申请人）',
    1: '已接单（管理员）',
    2: '已发货（管理员）',
    3: '已收货（申请人）',
    [-1]: '订单关闭（申请人）',
    [-2]: '订单关闭（管理员）'
  },
  orderStatusType: {
    NEW: 0,
    TAKE: 1,
    SEND: 2,
    RECEIVE: 3,
    CLOSE_USER: -1,
    CLOSE_ADMIN: -2
  },
  tagStatusOptions: [
    { label: '未操作', value: 0 },
    { label: '已绑定', value: 1 },
    { label: '报废/废弃', value: 2 }
  ],
  tagStatusMap: {
    0: '未操作',
    1: '已绑定',
    2: '报废/废弃'
  },
  tagStatusType: {
    NONE: 0,
    BIND: 1,
    DISCARD: 2
  }
}
