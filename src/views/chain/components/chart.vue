<template>
  <div :id="chartId" style="height: 200px;" />
</template>

<script>
const echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts/lib/component/title')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/grid')
require('echarts/lib/component/legend')
require('echarts/lib/component/dataZoom')

export default {
  name: 'Charts',
  props: {
    id: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => []
    },
    transactionDataArr: {
      type: Array,
      default: () => []
    },
    size: {
      type: Object,
      default: () => {}
    }
  },
  data: function() {
    return {
      chartId: this.id,
      chartData: this.data,
      chartTransactionDataArr: this.transactionDataArr,
      chartSize: this.size,
      chart: ''
    }
  },
  watch: {
    data: function() {
      this.chartId = this.id
      this.chartData = this.data
      this.chartTransactionDataArr = this.transactionDataArr
      this.chartSize = this.size
      this.chartShow()
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.chartShow()
    })
  },
  beforeDestroy: function() {
    window.onresize = null
    if (this.chart) {
      this.chart.dispose()
    }
  },
  methods: {
    chartShow: function() {
      this.chart = echarts.init(document.getElementById(this.chartId))
      const option = {
        legend: {
          height: this.chartSize.height,
          width: this.chartSize.width
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter: function(data) {
            return (
              '<span style="font-size:10px">' +
                            data[0].name +
                            '</span><br><table ><tr><td style="padding:0">' +
                            '<span style="font-size:10px;color:white">' + '交易量' + '：' +
                            data[0].value + '笔' +
                            '</a></span><br></td></tr></table>'
            )
          }
        },
        grid: {
          left: 43,
          right: 33,
          top: 7,
          bottom: 40
        },
        series: [
          {
            type: 'line',
            symbolSize: 1,
            itemStyle: {
              normal: {
                color: '#0db1c1',
                lineStyle: {
                  color: '#0db1c1'
                }
              }
            },
            areaStyle: {
              color: 'rgba(13, 177, 193,0.3)'
            },
            data: this.chartTransactionDataArr
          }
        ],
        xAxis: {
          data: this.chartData,
          axisLine: {
            lineStyle: {
              color: '#e9e9e9',
              width: 2
            }
          },
          axisLabel: {
            interval: 1,
            textStyle: {
              color: 'rgba(0, 14, 31, 0.62)'
            }
          }
        },
        yAxis: {
          axisLine: {
            show: false,
            lineStyle: {
              color: '#333'
            }
          },
          splitLine: { show: true, lineStyle: { type: 'dashed', color: '#e9e9e9' }},
          axisTick: { show: false },
          axisLabel: {
            formatter: function(value) {
              if (value > 1000 && value < 1000000) {
                return value / 1000 + 'K'
              } else if (value > 1000000 || value === 1000000) {
                return value / 1000000 + 'M'
              } else {
                return value + ''
              }
            },
            textStyle: {
              color: 'rgba(0, 14, 31, 0.62)'
            }
          }
        }
      }
      this.chart.setOption(option, true)
      window.onresize = () => {
        this.chart.resize()
      }
    }
  }
}
</script>
