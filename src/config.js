export default {
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
  typeOptions: [
    { label: '文本', value: 'text' },
    { label: '图片', value: 'image' },
    { label: '视频', value: 'video' },
    { label: '音频', value: 'audio' },
    { label: '文件', value: 'file' }
  ],
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
