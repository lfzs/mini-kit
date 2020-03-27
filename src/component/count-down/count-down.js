import dayjs from 'dayjs'

Component({
  externalClasses: ['custom-class'],
  properties: {
    end: String,
    now: String,
    unit: {
      type: String,
      value: 'DD:HH:mm:ss',
    },
  },

  data: {
    time: '',
  },

  timer: null,

  observers: {
    'end, now': function(end, now) { (end || now) && this.start() },
  },

  lifetimes: {
    detached() { clearInterval(this.timer) },
    attached() { this.format() },
  },

  methods: {
    start() {
      clearInterval(this.timer)
      let { end, now } = this.data
      if (!end) return

      end = dayjs(end)
      now = now ? dayjs(now) : dayjs()

      let seconds = end.diff(now, 'seconds')

      this.timer = setInterval(() => {
        if (seconds && seconds > 0) {
          this.format(seconds)
          --seconds
        } else {
          this.triggerEvent('end')
          clearInterval(this.timer)
        }
      }, 1000)
    },

    format(seconds = 0) {
      const { unit } = this.data
      const DD = Math.floor(seconds / (24 * 3600))
      const HH = Math.floor(seconds / 3600 & 24)
      const mm = Math.floor(seconds / 60 % 60)
      const ss = Math.floor(seconds % 60)
      const time = unit.replace('DD', DD).replace('HH', HH).replace('mm', mm).replace('ss', ss).replace(/\b(\d)\b/g, '0$1')
      this.setData({ time })
    },

  },
})
