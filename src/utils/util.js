/*
 * Copyright 2014-2020 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict'

import { before } from 'lodash'

const changeDate = function(date) {
  const newData = new Date(date)
  const Y = newData.getFullYear()
  const M = newData.getMonth() + 1 > 9 ? newData.getMonth() + 1 : '0' + (newData.getMonth() + 1)
  const D = newData.getDate() > 9 ? newData.getDate() : '0' + newData.getDate()
  return Y + '-' + M + '-' + D
}
export function formatData() {
  const newData = new Date()
  const Y = newData.getFullYear()
  const M = newData.getMonth() + 1 > 9 ? newData.getMonth() + 1 : '0' + (newData.getMonth() + 1)
  const D = newData.getDate() > 9 ? newData.getDate() : '0' + newData.getDate()
  const newdata = Y + '/' + M + '/' + D
  return newdata
}

export function date(date) {
  const newData = new Date(date.getTime())
  const Y = newData.getFullYear()
  const M = newData.getMonth() + 1 > 9 ? newData.getMonth() + 1 : '0' + (newData.getMonth() + 1)
  const D = newData.getDate() > 9 ? newData.getDate() : '0' + newData.getDate()
  const h = newData.getHours()
  const m = newData.getMinutes()
  const s = newData.getSeconds()
  return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
}
export function getDate(val) {
  val = Number(val)
  const date = new Date(val)
  const Y = date.getFullYear()
  const M = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
  const D = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
  const h = date.getHours()
  const m = date.getMinutes()
  const s = date.getSeconds()
  return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
}

export function changWeek(data) {
  const lastDate = (new Date()).getTime()
  const firstDate = lastDate - 6 * 24 * 3600 * 1000
  const dateList = []
  dateList[0] = {}
  dateList[0].transCount = 0
  dateList[0].day = firstDate
  for (let i = 1; i < 7; i++) {
    dateList[i] = {}
    dateList[i].day = dateList[i - 1].day + 24 * 3600 * 1000
    dateList[i].transCount = 0
  }
  for (let i = 0; i < 7; i++) {
    dateList[i].day = changeDate(dateList[i].day)
  }
  dateList.forEach(function(value) {
    if (data && data.length) {
      for (let j = 0; j < data.length; j++) {
        if (value.day === data[j].day) {
          value.transCount = data[j].transCount
        }
      }
    }
  })
  return dateList
}
/** Get request parameter processing
 * @param necessary Required
 * @param query Optional
 * @return {Object}
 */
export function reviseParam(necessary, query) {
  const params = arguments[0]
  const querys = arguments[1]
  const arr = []
  let str = ''
  for (var i in params) {
    arr.push(params[i])
  }
  str = arr.join('/')
  return { str, querys }
}

/** get cookie*/
export function getCookie(name) {
  var arr; var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if (arr = document.cookie.match(reg)) { return (arr[2]) } else { return null }
}

/** set cookie*/
export function setCookie(c_name, value, expiredays) {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = c_name + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
}

/** delete cookie*/
export function delCookie(name) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(name)
  if (cval != null) { document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString() }
}

/**
 * format Timestamp example："2018-01-17 15:39:34"
 * @param d Timestamp
 * @param fmt "yyyy-MM-dd" || "yyyy-MM-dd HH:mm:ss"
 * @returns {string}
 */
export function format(d, fmt) {
  let date = {}

  if (!(d instanceof Date)) {
    date = new Date(parseInt(d))
  } else {
    date = d
  }
  const o = {
    'M+': date.getMonth() + 1, // month
    'd+': date.getDate(), // day
    'H+': date.getHours(), // hour
    'm+': date.getMinutes(), // minute
    's+': date.getSeconds(), // second
    'q+': Math.floor((date.getMonth() + 3) / 3), // quarter
    'S': date.getMilliseconds() // millisecond
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  return fmt
}

/**
* number：formatted number
* decimals：Keep a few decimals
* dec_point：decimal point symbol
* thousands_sep：thousands of symbols
* */
export function numberFormat(number, decimals, dec_point, thousands_sep) {
  number = (number + '').replace(/[^0-9+-Ee.]/g, '')
  var n = !isFinite(+number) ? 0 : +number
  var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
  var sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep
  var dec = (typeof dec_point === 'undefined') ? '.' : dec_point
  var s = ''
  var toFixedFix = function(n, prec) {
    var k = Math.pow(10, prec)
    return '' + Math.ceil(n * k) / k
  }

  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
  var re = /(-?\d+)(\d{3})/
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, '$1' + sep + '$2')
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }
  return s.join(dec)
}

export function isNumber(obj) {
  return typeof obj === 'number' && !isNaN(obj)
}

/**
* startTime
* endTime
* data
* */
export function completionDateData(startTime, endTime, data) {
  var lastDate = new Date(endTime).getTime()
  var firstDate = new Date(startTime).getTime()
  var len = (lastDate - firstDate) / 86400000
  var dateList = []
  dateList[0] = {}
  dateList[0].time = firstDate
  dateList[0].transCount = 0
  for (let i = 1; i < len + 1; i++) {
    dateList[i] = {}
    dateList[i].time = dateList[i - 1].time + 24 * 3600 * 1000
    dateList[i].transCount = 0
  }
  for (let i = 0; i < len + 1; i++) {
    dateList[i].time = format(dateList[i].time, 'MM-dd')
  }
  for (let i = 0; i < dateList.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (dateList[i]['time'] === data[j]['time']) {
        dateList[i]['transCount'] = data[j]['transCount']
      }
    }
  }
  return dateList
}
/**
* array:[{key: value}]
* onlyKey
* */
export function unique(array, onlyKey) {
  const result = {}; const finalResult = []; const oneKey = onlyKey
  for (let i = 0; i < array.length; i++) {
    result[array[i][oneKey]] = array[i]
  }
  for (const key in result) {
    finalResult.push(result[key])
  }
  return finalResult
}
/**
* array:[]
* */
export function unique1(array) {
  var tmp = Array.from(new Set(array))
  return tmp
}

export function isJson(str) {
  if (typeof str === 'string') {
    try {
      var obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      console.log('error：' + str + '!!!' + e)
      return false
    }
  }
}

export function dataType(type, value) {
  switch (type) {
    case 'bool':
      if ((value === 'true' || value === 'false')) return eval(value.toLowerCase())
      break
    case 'uint[]':
      try {
        return JSON.parse(value)
      } catch (error) {
        console.log('error：' + value + '!!!' + error)
        return
      }
      break
    case 'uint8[]':
      try {
        return JSON.parse(value)
      } catch (error) {
        console.log('error：' + value + '!!!' + error)
        return
      }
      break
    case 'uint32[]':
      try {
        return JSON.parse(value)
      } catch (error) {
        console.log('error：' + value + '!!!' + error)
        return
      }
      break
    case 'uint128[]':
      try {
        return JSON.parse(value)
      } catch (error) {
        console.log('error：' + value + '!!!' + error)
        return
      }
      break
    case 'uint256[]':
      try {
        return JSON.parse(value)
      } catch (error) {
        console.log('error：' + value + '!!!' + error)
        return
      }
      break
    case 'uint8[]':
      try {
        return JSON.parse(value)
      } catch (error) {
        console.log('error：' + value + '!!!' + error)
        return
      }
      break
    case 'bytes32[]':
      try {
        var value = value.replace(/\^\[.*\]\$/, '')
        return JSON.parse(value)
      } catch (error) {
        console.log('error：' + value + '!!!' + error)
        return
      }
      break
    case 'address[]':
      try {
        var value = value.replace(/\^\[.*\]\$/, '')
        return JSON.parse(value)
      } catch (error) {
        console.log('error：' + value + '!!!' + error)
        return
      }
      break
    default:
      try {
        var value = value.replace(/\^\[.*\]\$/, '')
        return JSON.parse(value)
      } catch (error) {
        console.log('error：' + value + '!!!' + error)
        return
      }
      break
      break
  }
}
export function substring_0_40(params) {
  return params.substring(0, 40)
}
export function versionfunegt(ver1, ver2) {
  var version1pre = parseFloat(ver1)
  var version2pre = parseFloat(ver2)
  var version1next = ver1.replace(version1pre + '.', '')
  var version2next = ver2.replace(version2pre + '.', '')
  if (version1pre > version2pre) {
    return true
  } else if (version1pre < version2pre) {
    return false
  } else {
    if (version1next >= version2next) {
      return true
    } else {
      return false
    }
  }
}
export function subStringToNumber(val) {
  const array = val.split('')
  let num = ''
  for (let i = 0; i < array.length; i++) {
    num = num + array[i].charCodeAt(0)
  }
  return parseInt(num)
}

export function toContractName(value) {
  switch (value) {
    case '0x0000000000000000000000000000000000001000':
      return 'SystemConfig'
      break
    case '0x0000000000000000000000000000000000001001':
      return 'TableFactory'
      break
    case '0x0000000000000000000000000000000000001002':
      return 'CRUD'
      break
    case '0x0000000000000000000000000000000000001003':
      return 'Consensus'
      break
    case '0x0000000000000000000000000000000000001004':
      return 'CNS'
      break
    case '0x0000000000000000000000000000000000001005':
      return 'Permission'
      break
    case '0x0000000000000000000000000000000000001007':
      return 'CSM'
      break
    case '0x0000000000000000000000000000000000001008':
      return 'ChainGovern'
      break
    case '0x0000000000000000000000000000000000001009':
      return 'ChainCharge'
      break
    default:
      return ''
      break
  }
}
/**
 * @method  省略号动态效果
 */
export function dynamicPoint(val, num) {
  console.log(val, num)
  if (num % 3 === 0) {
    return `${val}··`
  } else if (num % 3 === 1) {
    return `${val}····`
  } else {
    return `${val}······`
  }
}

export function getDay(beforeDate) {
  const temp = []
  for (let i = 0; i < beforeDate; i++) {
    const time = new Date(new Date().setDate(new Date().getDate() - i))
    const month = `0${time.getMonth() + 1}`.slice(-2)
    const strDate = `0${time.getDate()}`.slice(-2)
    temp.push(`${month}-${strDate}`)
  }
  console.log(temp)
  return temp
}
