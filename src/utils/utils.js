export function copyText(val) {
  this.$copyText(val).then(() => {
    this.$message({
      type: 'success',
      message: '复制成功',
      duration: 2000
    })
  })
}

export function linkUser(val) {
  this.$router.push({
    path: '/admin/user',
    query: {
      keyword: val
    }
  })
}

export function linkTransaction(val) {
  this.$router.push({
    path: '/browser/transactionInfo',
    query: {
      transactionHash: val
    }
  })
}

export function linkTrace(val) {
  this.$router.push({
    path: '/trace/info',
    query: {
      code: val
    }
  })
}
