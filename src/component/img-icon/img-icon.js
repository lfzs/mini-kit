Component({
  externalClasses: ['custom-class'],

  properties: {
    name: String,
    size: {
      type: Number,
      value: 20,
    },
    ext: {
      type: String,
      value: 'png',
    },
  },
})
