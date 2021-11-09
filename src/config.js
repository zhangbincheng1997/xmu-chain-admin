export default {
  dialogType: {
    DETAIL: 'detail',
    ADD: 'add',
    EDIT: 'edit',
    ROLE: 'role',
    MENU: 'menu',
    PERMISSION: 'permission',
    PWD: 'pwd'
  },
  dialogTitle: {
    detail: '详细信息',
    add: '添加',
    edit: '编辑',
    role: '设置角色',
    menu: '设置菜单',
    permission: '设置权限',
    pwd: '重置密码'
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
