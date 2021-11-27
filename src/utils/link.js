export function linkTransaction(val) {
  this.$router.push({
    path: '/browser/transactionInfo',
    query: {
      transactionHash: val
    }
  })
}

export function linkTemplate(type, val) {
  this.$router.push({
    path: '/template/' + type,
    query: {
      id: val
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

export function linkDetail(val) {
  this.$router.push({
    path: '/order/detail',
    query: {
      id: val
    }
  })
}
