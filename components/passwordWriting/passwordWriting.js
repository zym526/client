Component({
  properties: {
    // 输入框的数量
    inputLength: {
      type: Number,
      value: 6
    },
    // 单个输入框的宽度
    inputWidth: {
      type: String,
      value: '80rpx'
    },
    inputHeight: {
      type: String,
      value: '74rpx'
    },
  },
  data: {
    // input是否获取焦点
    inputFocus: false,
    // 初始input值为空
    currentValue: ''
  },
  methods: {
    // 设置当前的值
    _setCurrentValue(e) {
      // 在此处判断满6（inputLength）位，把值返回给上级父组件或页面
      let currentValue = e.detail.value
      // 改变时，派发一个事件，如果父组件或页面中需要实时获取改变后的值，可以监听这个事件。
      this.triggerEvent('change', e.detail.value)
 
      this.setData({
        currentValue
      }) 
      // if (currentValue.length >= this.data.inputLength) {
      //   this._complate() 
      //   return
      // }
    },
    // 点击伪装的input时，让隐藏的input获得焦点
    _focusInput() {
      this.setData({
        inputFocus: true
      })
    },
    _complate() {
      this.triggerEvent('inputComplate', this.data.currentValue)
    },
    // 清除input当前的值
    clearCurrentValue() {
      this.setData({
        currentValue: ''
      })
    }
  }
})