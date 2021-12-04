export function copyText(val) {
  this.$copyText(val).then(() => {
    this.$message({
      type: 'success',
      message: '复制成功',
      duration: 2000
    })
  })
}

export function linkFrom(val) {
  this.$router.push({
    path: '/browser/transactionInfo',
    query: {
      transFrom: val
    }
  })
}

export function linkHash(val) {
  this.$router.push({
    path: '/browser/transactionInfo',
    query: {
      transHash: val
    }
  })
}

export function linkTrace(val) {
  this.$router.push({
    path: '/test/trace',
    query: {
      code: val
    }
  })
}
