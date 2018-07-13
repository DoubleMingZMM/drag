<template>
  <div id="draft">
    <list-item></list-item>
    <!--<draft-container></draft-container>-->
    <div id="chart-container">
      <!--<svg id="topo-chart" width="5000" height="5000"></svg>-->
      <el-button id="add-button" type="text" icon="el-icon-plus" @click="handleAdd">新 增</el-button>
      <el-button id="run-button" type="text" icon="el-icon-caret-right">运 行</el-button>
      <el-tabs v-model="currentTab" type="card" closable @tab-remove="removeTab">
        <!--id作为自定义的参数，通过id追加svg-->
        <el-tab-pane
          v-for="(item, index) in allTabs"
          :id="'tab-' + item.name"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import * as d3 from 'd3'
  import listItem from './components/listItem.vue'
  import Panel from './utils/panel.js'
  let panel = null
  let panelObj = {}
  export default {
    components: {
      listItem
    },
    data() {
      return {
        currentTab: '1',
        allTabs: [{
          title: '作业一',
          name: '1'
        }, {
          title: '作业二',
          name: '2'
        }, {
          title: '作业sdfg一',
          name: '3'
        }, {
          title: '作业sdfgsdfg二',
          name: '4'
        }, {
          title: '作业一',
          name: '5'
        }, {
          title: '作业二',
          name: '6'
        }, {
          title: '作业sdfg一',
          name: '7'
        }, {
          title: '作业dfgsdfg二',
          name: '8'
        }]
      }
    },
    mounted() {
      // 绘制SVG背景图，并且在该方法内调用绑定事件的方法
      this.initializeSVG()
    },
    methods: {
      initializeSVG() {
        const { allTabs } = this

        // 遍历所有的tabs,并且画出画布
        allTabs.map((v, k) => {
          // 调用单个画布方法
          this.paintSVG(v)

          const container = d3.select('#topo-chart-' + v.name).attr('cursor', 'crosshair')
          panel = new Panel({
            container: container
          })

          this.$set(this.allData, `panel_${v.name}`, panel)

          panelObj['panel-' + v.name] = panel

          this.bindDragEvent()
        })
      },
      paintSVG(val = {}) {
        const data = d3.range(400) // (1) 生成一个10元素的数组
        const w = 6000,
          h = 6000,
          p = 1, // 内边距
          x = d3.scaleLinear().domain([0, 1]).range([p, (w - p)]), // (2) 定义x和y比例尺
          y = d3.scaleLinear().domain([0, 1]).range([(h - p), p])

        // (3) 绘制SVG
        var svg = d3.select('.el-tabs__content #tab-' + val.name).append('svg')
          .attr('width', w)
          .attr('height', h)
          .attr('id', 'topo-chart-' + val.name)

        // (4) 给SVG添加分组，并设置样式类，样式见<style>标签中的设置
        var grid = svg.selectAll('.grid')
          .data(x.ticks(400))
          .enter().append('g')
          .attr('style', 'stroke: #e6e6e6; stroke-width: .8px;')
        // (5) 添加线条，设置起始坐标(x1,y1)和结束坐标(x2,y2)的值即可
        // 竖线
        grid.append('line')
          .attr('x1', x)
          .attr('x2', x)
          .attr('y1', p)
          .attr('y2', h - p - 1)

        // 横线
        grid.append('line')
          .attr('y1', y)
          .attr('y2', y)
          .attr('x1', p)
          .attr('x2', w - p + 1)
      },
      bindDragEvent() {
        // 绑定事件的函数中无法使用this
        const _this = this
        let dragDeltaX, dragDeltaY, dragItem, $dragItem
        let items = d3.selectAll('.listItem .item')
        let drag = d3.drag()
          .on('start', function() {
            const mousePosition = d3.mouse(this)
            dragDeltaX = mousePosition[0]
            dragDeltaY = mousePosition[1]
            dragItem = this.cloneNode(true)
            document.getElementById('draft').append(dragItem)
            $dragItem = d3.select(dragItem)
            _this.getItemPosition($dragItem, d3.event.sourceEvent.x - dragDeltaX, d3.event.sourceEvent.y - dragDeltaY)
          })
          .on('drag', function() {
            _this.getItemPosition($dragItem, d3.event.sourceEvent.x - dragDeltaX, d3.event.sourceEvent.y - dragDeltaY)
          })
          .on('end', function() {
            const $container = document.getElementById('chart-container')
            const position = {
              x: d3.event.sourceEvent.x - dragDeltaX - $container.offsetLeft,
              y: d3.event.sourceEvent.y - dragDeltaY - $container.offsetTop
            }
            if (position.x > 0) {
              panelObj['panel-' + _this.currentTab].addItem({
                // container: d3.select('#topo-chart-' + _this.currentTab),
                x: position.x,
                y: position.y,
                name: $dragItem.attr('data-name'),
                type: $dragItem.attr('data-type')
              })
            }
            $dragItem.remove()
          })
        items.call(drag)
      },
      getItemPosition($item, x, y) {
        $item.attr('style', `position:absolute;transform:translate(${x - 220}px, ${y - 110}px)`)
      },
      removeTab(targetName) {
        const { allTabs, currentTab } = this
        const tabs = allTabs
        let activeName = currentTab
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              const nextTab = tabs[index + 1] || tabs[index - 1]
              if (nextTab) {
                activeName = nextTab.name
              }
            }
          })
        }
        // 改变localStorage的同时，也要去改变data，这样视图会跟着渲染
        this.currentTab = activeName
        this.allTabs = tabs.filter(tab => tab.name !== targetName)
      },
      handleAdd() {
        const _this = this
        const specialName = Math.random().toString().substring(3)
        // 改变localStorage的同时，也要去改变data，这样视图会跟着渲染
        this.currentTab = specialName
        this.allTabs.push({
          title: '作业二',
          name: specialName
        })
        // 将时间设置为4毫秒，最小时间，并不是想让他超时执行，让其变成异步且不影响页面响应速度
        setTimeout(function() {
          // 调用单个画布方法
          _this.paintSVG({
            name: specialName
          })
          const container = d3.select('#topo-chart-' + specialName).attr('cursor', 'crosshair')
          panel = new Panel({
            container: container
          })
          panelObj['panel-' + specialName] = panel

          _this.bindDragEvent()
        }, 4)
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  #draft{
    display: block;
    // position: relative;
    #chart-container {
      position: absolute;
      top: 110px;
      left: 420px;
      bottom: 0;
      right: 0;
      overflow: hidden;
      #add-button{
        position: absolute;
        right: 0;
        top: 5px;
        z-index: 1;
        margin-right: 20px;
      }
      #run-button{
        position: absolute;
        right: 0;
        top: 5px;
        z-index: 1;
        margin-right: 100px;
      }
      /deep/ .el-tabs__header{
        margin: 0;
        position: absolute;
        width: 700px;
      }
      /deep/ .el-tabs--card>.el-tabs__header{
        border-bottom: none;
      }
      /deep/ .el-tabs__item{
        background: #dcd5d5;
        margin: 5px 0 5px 5px;
        border-radius: 5px;
        height: 35px;
        line-height: 35px;
        color: white;
      }
      /deep/ .el-tabs__item:hover{
        background: #747678;
      }
      /deep/ .el-tabs--card>.el-tabs__header .el-tabs__item{
        border: none;
      }
      /deep/ .el-tabs--card>.el-tabs__header .el-tabs__nav{
        border: none;
      }
      /deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active.is-closable{
        background: #747678!important;
      }
      /deep/ .el-tabs__nav-next, /deep/ .el-tabs__nav-prev{
        z-index: 1;
      }
      /deep/ .el-tabs__nav-next:hover, /deep/ .el-tabs__nav-prev:hover{
        color: black;
      }
      /deep/ [class*=" el-icon-"], /deep/ [class^=el-icon-]{
        font-weight: bolder;
      }
      #topo-chart {
        cursor: crosshair;

        /*/deep/ .item {
          cursor: move;

          &.active .item-rect {
            stroke: #999;
            stroke-width: 1px;
            stroke-dasharray: 5px;
          }
        }*/

        /deep/ .item_label {
          font-size: 13px;
          fill: #fff;
          stroke-width: 0;
          user-select: none;
        }

        /*/deep/ .port {
          fill: #ddd;
          stroke: #999;
          stroke-width: 1;
          cursor: crosshair;
        }*/

        /*/deep/ .port-hovered {
          fill: #ff7f0e;
          stroke: #ff7f0e;
        }*/

        /*/deep/ .line {
          fill: none;
          stroke: #999;
          stroke-width: 3px;

          &.active {
            stroke: #ff7f0e;
          }
        }*/
      }
    }
  }
</style>
