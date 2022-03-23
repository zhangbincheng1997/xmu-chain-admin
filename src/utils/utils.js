// ----- 复制文本 -----
export function copyText(val) {
  this.$copyText(val).then(() => {
    this.$message({
      type: 'success',
      message: '复制成功',
      duration: 2000
    })
  })
}

// ----- 跳转批次 -----
export function linkBatch(val) {
  this.$router.push({
    path: '/batch',
    query: {
      batchId: val
    }
  })
}
