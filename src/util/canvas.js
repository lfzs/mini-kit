/*
  在 wxml 中需要提前声明
  <canvas canvas-id="canvas" style="width: 375px; height: 375px; background-color: red;"/>
*/

let CTX
export default function canvas(canvasId, config = []) {
  CTX = wx.createCanvasContext(canvasId)

  config.forEach(configItem => {
    switch (configItem && configItem.type.toLowerCase()) {
    case 'image':
      drawImage(configItem)
      break
    case 'text':
      drawTextLine(configItem)
      break
    case 'background':
      drawBackground(configItem)
      break
    }
  })

  return new Promise((resolve, reject) => {
    CTX.draw(false, () => {
      wx.canvasToTempFilePath({
        canvasId,
        quality: 1,
        success: resolve,
        fail: reject,
      })
    })
  })
}

function drawImage(config) {
  // info 为 wx.getImageInfo 的信息
  const { top, left, width, height, url, info } = config
  if (info) {
    // aspectFill 模式，水平100%，垂直居中截取
    CTX.save()
    CTX.beginPath()
    CTX.rect(left, top, width, height)
    CTX.clip()
    const newHeight = width / info.width * info.height
    const topOffset = newHeight > height ? (newHeight - height) / 2 : 0
    CTX.drawImage(url, left, top - topOffset, width, newHeight)
    CTX.restore()
  } else {
    CTX.drawImage(url, left, top, width, height)
  }
}

function drawTextLine(config) {
  const { text, top, left, fontSize, color, textAlign = 'left', baseline = 'top', maxLine = 1 } = config
  CTX.setFontSize(fontSize)
  CTX.setTextAlign(textAlign)
  CTX.setFillStyle(color)
  CTX.setTextBaseline(baseline)
  if (maxLine === 1) return CTX.fillText(text, left, top)

  drawTextLines(config)
}

function drawTextLines(config) {
  const { text, top, left, maxWidth, lineHeight, maxLine } = config

  const lines = [''] // 每一行的文字
  let isOver = false // 文字是否多余

  for (let index = 0; index < text.length; index++) {
    const last = lines[lines.length - 1]
    const { width } = CTX.measureText(last)

    if (width < maxWidth) {
      lines[lines.length - 1] = `${last}${text[index]}`
    } else {
      if (lines.length >= maxLine) {
        isOver = true
        break
      }
      lines.push(text[index])
    }
  }

  if (isOver) {
    const last = lines[lines.length - 1]
    lines[lines.length - 1] = `${last.substring(0, last.length - 1)}...`
  }

  for (let index = 0; index < lines.length; index++) {
    CTX.fillText(lines[index], left, top + (lineHeight * index), maxWidth)
  }
}

function drawBackground(config) {
  const { top, left, width, height, color } = config
  CTX.setFillStyle(color)
  CTX.setStrokeStyle(color)
  CTX.fillRect(left, top, width, height)
}
