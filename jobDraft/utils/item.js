/**
 * 拓扑关系图
 * 元素类
 * @author: Daniel
 * @date: 2018-5-8
 */

// import { type, bgColor, icon, name } from './enum'
import * as util from './util'
import * as d3 from 'd3'

class Item {
  constructor(params) {
    this.container = params.container
    this.id = params.id || util.makeId()
    this.x = params.x
    this.y = params.y
    this.name = params.name
    this.title = params.title
    // this.type = type[params.type]
    this.type = params.type

    // 记录input/output元素的id和连线对象
    this.inputIds = params.inputIds || new Set()
    this.outputIds = params.outputIds || new Set()
    this.inputPathIds = new Set()
    this.outputPathIds = new Set()
    this.data = params.data || null

    // 回调事件
    this.onDrag = params.onDrag
    this.onClick = params.onClick
    this.onDblclick = params.onDblclick
    this.onRemove = params.onRemove
    this.onMouseup = params.onMouseup
    this.onPortMousedown = params.onPortMousedown
    this.onPortMouseup = params.onPortMouseup

    this.onKeyup = params.onKeyup

    // 私有属性
    this._group = null
    this._text = null
    this._input = null
    this._output = null
    this._dragDeltaX = 0
    this._dragDeltaY = 0
    this._createElement()
    this._bindEvent()
  }

  /**
   * 删除元素
   */
  remove() {
    this._group.remove()
    this.onRemove(this)
  }

  /**
   * 取消选中
   */
  blur() {
    // this._group.classed('active', false)
    this._group.classed('active', false)
      .attr('class', 'item')
      .attr('stroke', null)
      .attr('stroke-width', null)
      .attr('stroke-dasharray', null)
  }

  /**
   * 获取input具柄
   * @returns {null|*}
   */
  getInputPort() {
    return this._input
  }

  /**
   * 获取output具柄
   * @returns {null|*}
   */
  getOutputPort() {
    return this._output
  }

  /**
   * 更新元素
   * @param params
   */
  updateItem(params) {
    // let textWidth = util.getTextWidth(params.text) + 15
    // let itemWidth = textWidth + 30
    let itemWidth = 30
    this._group.select('rect').attr('width', itemWidth)
    this.title = params.text
    this._text.text(this.title).attr('x', textWidth / 2 + 30)
    if (this._output) {
      this._output.attr('transform', `translate(${itemWidth - 5}, 10)`)
    }
    this.onDrag(this)
  }

  getItemWidth() {
    return parseInt(this._group.select('rect').attr('width'))
  }

  /**
   * 创建svg元素
   */
  _createElement() {
    let group = this.container.append('g')
      .attr('transform', `translate(${this.x}, ${this.y})`)
      .attr('class', 'item')
      .attr('cursor', 'move')
    this._group = group
    group.append('rect')
      .attr('width', 120)
      .attr('height', 30)
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('fill', 'rgb(22, 156, 228)')
      .attr('class', 'item item-rect')

    let iconGroup = group.append('g')
    iconGroup.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 30)
      .attr('height', 30)
      .attr('fill', '#000')
      .attr('fill-opacity', '0.05')
    iconGroup.append('image')
      // .attr('href', icon[this.name])
      .attr('x', 4)
      .attr('y', 4)
      .attr('width', 22)
      .attr('height', 22)

    let iconLine = d3.path()
    iconLine.moveTo(30, 0)
    iconLine.lineTo(30, 30)
    iconGroup.append('path')
      .attr('stroke-width', 0.5)
      .attr('stroke', '#000')
      .attr('stroke-opacity', 0.1)
      .attr('d', iconLine)

    let text = group.append('text')
    // let title = this.title || name[this.name]
    let title = this.title
    this._text = text
    text.text(title)
      .attr('x', 73)
      .attr('y', 14)
      .attr('dy', '0.35em')
      .attr('class', 'item_label')
      .attr('text-anchor', 'middle')

    if (~['ACTION', 'FUNCTION'].indexOf(this.type)) {
      let input = group.append('g').attr('transform', 'translate(-5, 10)')
        .attr('class', 'port_input') // 现在只是单纯加上样式，供以后使用
        .attr('fill', '#ddd')
        .attr('stroke', '#999')
        .attr('stroke-width', '1px')
        .attr('cursor', 'crosshair')
      this._input = input
      input.append('rect')
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('width', 10)
        .attr('height', 10)
        .attr('class', 'port')
    }

    if (~['INPUT', 'FUNCTION'].indexOf(this.type)) {
      let output = group.append('g').attr('transform', 'translate(115, 10)')
        .attr('class', 'port_output') // 现在只是单纯加上样式，供以后使用
        .attr('fill', '#ddd')
        .attr('stroke', '#999')
        .attr('stroke-width', '1px')
        .attr('cursor', 'crosshair')
      this._output = output
      output.append('rect')
        .attr('rx', 3)
        .attr('ry', 3)
        .attr('width', 10)
        .attr('height', 10)
        .attr('class', 'port')
    }
  }

  /**
   * 绑定事件
   * @private
   */
  _bindEvent() {
    this._group.on('click', this._onClick.bind(this))
    this._group.on('dblclick', this._onDblclick.bind(this))
    this._group.on('mouseup', this._onMouseup.bind(this))
    d3.select('body').on('keyup', this._onKeyup.bind(this))
    if (this._input) {
      this._input.on('mouseenter', this._onPortEnter)
      this._input.on('mouseleave', this._onPortLeave)
      this._input.on('mousedown', this._onPortMousedown.bind(this))
      this._input.on('mouseup', this._onPortMouseup.bind(this))
    }
    if (this._output) {
      this._output.on('mouseenter', this._onPortEnter)
      this._output.on('mouseleave', this._onPortLeave)
      this._output.on('mousedown', this._onPortMousedown.bind(this))
      this._output.on('mouseup', this._onPortMouseup.bind(this))
    }
    let drag = d3.drag()
      .on('start', this._onGroupDragstart.bind(this))
      .on('drag', this._onGroupDrag.bind(this))
    this._group.call(drag)
  }

  /**
   * 鼠标进入连线具柄
   * @private
   */
  _onPortEnter() {
    d3.select(this).select('rect')
      .attr('fill', '#ff7f0e')
      .attr('stroke', '#ff7f0e')
  }

  /**
   * 鼠标离开连线具柄
   * @private
   */
  _onPortLeave() {
    d3.select(this).select('rect')
      .attr('fill', '#ddd')
      .attr('stroke', '#999')
  }

  /**
   * 鼠标按下连线具柄
   * @private
   */
  _onPortMousedown() {
    d3.event.stopPropagation()
    const portType = d3.select(d3.event.target.parentNode).attr('class').replace('port_', '')
    this.onPortMousedown(this, portType)
  }

  /**
   * 鼠标按钮抬在线具柄抬起
   * @private
   */
  _onPortMouseup() {
    d3.event.stopPropagation()
    const portType = d3.select(d3.event.target.parentNode).attr('class').replace('port_', '')
    this.onPortMouseup(this, portType)
  }

  /**
   * 开始拖拽
   * @private
   */
  _onGroupDragstart() {
    this._dragDeltaX = d3.event.x - this.x
    this._dragDeltaY = d3.event.y - this.y
  }

  /**
   * 正在拖拽
   * @private
   */
  _onGroupDrag() {
    this.x = d3.event.x - this._dragDeltaX
    this.y = d3.event.y - this._dragDeltaY
    this._group.raise().attr('transform', `translate(${this.x}, ${this.y})`)
    this.onDrag(this)
  }

  /**
   * 点击当前元素
   */
  _onClick() {
    d3.event.stopPropagation()
    // this._group.classed('active', true)
    this._group
      .attr('class', 'active')
      .attr('stroke', '#999')
      .attr('stroke-width', '1px')
      .attr('stroke-dasharray', '5px')
    this.onClick(this)
  }

  /**
   * 双击当前元素
   */
  _onDblclick() {
    d3.event.stopPropagation()
    this.onDblclick(this)
  }

  /**
   * 删除当前元素
   */
  _onKeyup() {
    debugger
    d3.event.stopPropagation()
    this.onKeyup(this)
  }

  /**
   * 鼠标按钮在元素位置抬起
   * @private
   */
  _onMouseup() {
    d3.event.stopPropagation()
    this.onMouseup(this)
  }
}

export default Item
