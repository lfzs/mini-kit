/*
  在 wxml 中需要提前声明
  <canvas canvas-id="canvas" style="width: 375px; height: 375px; background-color: red;"/>
*/

let CTX
export default function canvas(canvasId, config) {
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
  const { text, top, left, maxWidth, fontSize, color, textAlign = 'left', baseline = 'top', lineHeight = 30, lineCount = 1 } = config
  CTX.setFontSize(fontSize)
  CTX.setTextAlign(textAlign)
  CTX.setFillStyle(color)
  CTX.setTextBaseline(baseline)
  if (lineCount === 1) return CTX.fillText(text, left, top, maxWidth)

  const lines = [''] // 每一行的文字
  for (let index = 0; index < text.length; index++) {
    const { width } = CTX.measureText(lines[lines.length - 1])
    if (width > maxWidth) {
      if (lines.length > lineCount) break
      lines.push(text[index])
    } else {
      lines[lines.length - 1] = lines.pop() + text[index]
    }
  }

  // 是否有多余
  if (lines.length > lineCount) {
    lines.pop()
    const lastLine = lines[lines.length - 1]
    lines[lines.length - 1] = `${lastLine.substring(0, lastLine.length - 3)}...`
  }

  for (let index = 0; index < lines.length; index++) CTX.fillText(lines[index], left, top + (lineHeight * index), maxWidth)
}

function drawBackground(config) {
  const { top, left, width, height, color } = config
  CTX.setFillStyle(color)
  CTX.setStrokeStyle(color)
  CTX.fillRect(left, top, width, height)
}
