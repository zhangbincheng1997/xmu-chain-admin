const accessTokenKey = 'ACCESS_TOKEN'
const refreshTokenKey = 'REFRESH_TOKEN'
const ipfsGatewayKey = 'IPFS_GATEWAY'

export function getToken() {
  return window.localStorage.getItem(accessTokenKey)
}

export function setToken(token) {
  window.localStorage.setItem(accessTokenKey, token)
}

export function removeToken() {
  return window.localStorage.removeItem(accessTokenKey)
}

export function getRefreshToken() {
  return window.localStorage.getItem(refreshTokenKey)
}

export function setRefreshToken(token) {
  window.localStorage.setItem(refreshTokenKey, token)
}

export function removeRefreshToken() {
  return window.localStorage.removeItem(refreshTokenKey)
}

export function getIpfsGateway() {
  return window.localStorage.getItem(ipfsGatewayKey)
}

export function setIpfsGateway(gateway) {
  window.localStorage.setItem(ipfsGatewayKey, gateway)
}
