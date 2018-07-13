<template>
  <div class="app-container listItem">
    <div class="item-category">
      <div class="item-header">输入</div>
      <div class="item-content">
        <div class="item item-input" data-type="INPUT" data-name="DEVICE">
          <div class="item-icon"></div>
          <div class="item-label">设备数据</div>
          <div class="item-port item-port-output"></div>
        </div>
        <div class="item item-input" data-type="INPUT" data-name="CUSTOM_DATA">
          <div class="item-icon"></div>
          <div class="item-label">自定义数据</div>
          <div class="item-port item-port-output"></div>
        </div>
      </div>
    </div>

    <div class="item-category">
      <div class="item-header">处理方法</div>
      <div class="item-content">
        <div class="item item-function" data-type="FUNCTION" data-name="LOGIC_RULE">
          <div class="item-icon"></div>
          <div class="item-label">逻辑规则</div>
          <div class="item-port item-port-input"></div>
          <div class="item-port item-port-output"></div>
        </div>
        <div class="item item-function" data-type="FUNCTION" data-name="ARITHMETIC">
          <div class="item-icon"></div>
          <div class="item-label">四则规范</div>
          <div class="item-port item-port-input"></div>
          <div class="item-port item-port-output"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'listItem',
    data() {
      return {
      }
    },
    mounted() {
    },
    methods: {
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .listItem{
    position: absolute;
    top: 110px;
    bottom: 0;
    width: 200px;
    background-color: #f3f3f3;
  }
  .item-header {
    margin-bottom: 10px;
    color: #999;
    font-size: 14px;
  }
  .item {
    position: relative;
    margin-bottom: 10px;
    background: #ddd;
    border-radius: 5px;
    width: 120px;
    height: 28px;
    cursor: move;
    outline: none;

    &.item-input {
      background: rgb(22, 156, 228);
    }
    &.item-function {
      background: rgb(143, 187, 52);
    }
    &.item-action {
      background: rgb(255, 197, 57);
    }
    &:hover {
      .item-port {
        background: #eee;
      }
    }

    .item-icon {
      position: absolute;
      width: 30px;
      top: 0;
      left: 0;
      bottom: 0;
      border-right: 1px solid rgba(0,0,0,.1);
      background-color: rgba(0,0,0,.05);

      img {
        position: absolute;
        top: 3px;
        left: 4px;
      }
    }

    .item-label {
      margin-left: 28px;
      line-height: 26px;
      overflow: hidden;
      text-align: center;
      color: #fff;
      font-size: 13px;
    }

    .item-port {
      position: absolute;
      top: 9px;
      width: 10px;
      height: 10px;
      border: 1px solid #999;
      box-sizing: border-box;
      border-radius: 3px;
      background: #d9d9d9;

      &.item-port-input {
        left: -5px;
      }

      &.item-port-output {
        right: -5px;
      }
    }
  }
</style>
