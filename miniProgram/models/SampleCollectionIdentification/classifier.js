import * as tf from '@tensorflow/tfjs-core'
import * as knnClassifier from './knn-classifier.js'

import { getFrameSliceOptions } from '../utils/util'
import { MOBILENET_URL } from '../utils/url'
import { MobileNet } from './mobilenet'

export class Classifier {
  // 指明前置或后置 front|back
  cameraPosition

  // 图像显示尺寸结构体 { width: Number, height: Number }
  displaySize

  // 神经网络模型
  mobileNet

  // KNN 模型
  knn

  // ready
  ready

  constructor(cameraPosition, displaySize) {
    this.cameraPosition = cameraPosition

    this.displaySize = {
      width: displaySize.width,
      height: displaySize.height
    }

    this.knn = knnClassifier.create()

    this.ready = false
  }

  load() {
    // 如果需要加载已经保存的咖啡杯模型，请传 true 值
    return new Promise((resolve, reject) => {
      this.mobileNet = new MobileNet()

      this.mobileNet.load(MOBILENET_URL).then(_ => {
        this.ready = true
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }

  isReady() {
    return this.ready
  }

  getNumClasses() {
    return this.knn.getNumClasses()
  }

  addExample(frame, index) {
    const tensor = this.squeeze(frame.data, { width: frame.width, height: frame.height })
    this.knn.addExample(tensor, index)
  }

  clearClass(index) {
    this.knn.clearClass(index)
  }

  predictClass(frame, k = 3) {
    return new Promise((resolve, reject) => {
      if (this.knn.getNumClasses() < 2) {
        reject()
      } else {
        const tensor = this.squeeze(frame.data, { width: frame.width, height: frame.height })
        this.knn.predictClass(tensor, k).then((res) => {
          resolve({
            classIndex: Number(res.label ? res.label : res.classIndex)
          })
        }).catch((err) => {
          reject(err)
        })
      }
    })
  }

  squeeze(ab, size) {
    // const data = new Uint8Array(ab)
    return tf.tidy(() => {
      const temp = tf.tensor(new Uint8Array(ab), [size.height, size.width, 4])
      const sliceOptions = getFrameSliceOptions(size.width, size.height, 224, 224)

      const pixels = temp.slice(sliceOptions.start, sliceOptions.size).resizeBilinear([224, 224])

      const tensor = this.mobileNet.squeeze(pixels)

      return tensor
    })
  }

  dispose() {
    this.mobileNet.dispose()
  }
}