// 步进器
Component({
  properties: {
    value: Number,
    max: Number,
    min: {
      type: Number,
      value: 1,
    },
    step: {
      type: Number,
      value: 1,
    },
  },

  methods: {

    onMin() {
      const { value, min, step } = this.data
      const newVal = value - step
      this.triggerEvent('change', newVal >= min ? newVal : min)
    },

    onMax() {
      const { value, max, step } = this.data
      const newVal = value + step
      this.triggerEvent('change', newVal <= max ? newVal : max)
    },

    onBlur(e) {
      const { value, max, min } = this.data
      const newVal = parseInt(e.detail.value)
      if (newVal && (newVal !== value) && (newVal <= max) && (newVal >= min)) {
        this.triggerEvent('change', newVal)
      } else {
        this.setData({ value })
      }
    },
  },

})