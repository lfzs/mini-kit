// 遮罩

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    show: Boolean,
  },

  methods: {
    noop() {},
    onMask() { this.triggerEvent('mask') },
  },

})
