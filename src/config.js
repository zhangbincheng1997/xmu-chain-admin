export default {
  ADD: 'add',
  EDIT: 'edit',
  MENU: 'menu',
  PERMISSION: 'permission',
  dialogTitle: {
    add: '添加',
    edit: '编辑'
  },
  roleDialogTitle: {
    menu: '设置菜单',
    permission: '设置权限'
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
  ]
}
