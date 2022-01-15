export function copyText(val) {
  this.$copyText(val).then(() => {
    this.$message({
      type: 'success',
      message: '复制成功',
      duration: 2000
    })
  })
}
