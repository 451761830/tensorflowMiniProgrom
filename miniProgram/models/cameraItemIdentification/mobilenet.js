import * as tfc from '@tensorflow/tfjs-converter'
import * as tf from '@tensorflow/tfjs-core'

import { MOBILENET_URL } from '../utils/url'

const PREPROCESS_DIVISOR = 255 / 2

export class MobileNet {
  model

  constructor() { }

  load(modelUrl) {
    return new Promise((resolve, reject) => {
      tfc.loadGraphModel(modelUrl ? modelUrl : MOBILENET_URL).then(model => {
        this.model = model
        resolve()
      }).catch(err => {
        reject(err)
      })
    })
  }

  dispose() {
    if (this.model) {
      this.model.dispose()
    }
  }

  predict(input) {
    const preprocessedInput = tf.div(
      tf.sub(input.asType('float32'), PREPROCESS_DIVISOR),
      PREPROCESS_DIVISOR)
    const reshapedInput =
      preprocessedInput.reshape([1, ...preprocessedInput.shape])
    return this.model.predict({ 'input': reshapedInput })
  }
}