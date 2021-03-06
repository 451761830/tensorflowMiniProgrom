import { Classifier } from '../../models/cameraItemIdentification/classifier.js'

const app = getApp()
const { appWidth, appHeight } = app.globalData

Page({

  classifier: null,

  data: {
    predictionBlockHeight: appHeight - 250,
    predicting: false,
    predictionRate: 0,
    preditionResults: [],
    result: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.initClassifier()

    // Start the camera API to feed the captured images to the models.
    const context = wx.createCameraContext(this)

    let count = 0
    const listener = context.onCameraFrame((frame) => {
      count = count + 1
      if (count === 3) {
        count = 0
        this.frame = frame

        this.executeClassify(frame)
      }
    })
    listener.start()
  },

  initClassifier() {
    this.showLoadingToast()

    this.classifier = new Classifier('back', {
      width: appWidth,
      height: appHeight
    })

    this.classifier.load().then(_ => {
      this.hideLoadingToast()
    }).catch(err => {
      console.log(err)
      wx.showToast({
        title: '网络连接异常',
        icon: 'none'
      })
    })
  },

  showLoadingToast() {
    wx.showLoading({
      title: '拼命加载模型',
    })
  },

  hideLoadingToast() {
    wx.hideLoading()
  },

  executeClassify: function (frame) {
    if (this.classifier && this.classifier.isReady() && !this.data.predicting) {
      this.setData({
        predicting: true
      }, () => {
        const start = Date.now()
        const predictionResults = this.classifier.classify(frame)
        const end = Date.now()

        this.setData({
          predicting: false,
          predictionRate: (1000 / (end - start)).toFixed(2),
          predictionResults: predictionResults
        })
      })
    }
  },

  onUnload() {
    if (this.classifier) {
      this.classifier.dispose()
    }
  }
})
