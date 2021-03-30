import * as tf from '@tensorflow/tfjs-core'
const blazeface = require('@tensorflow-models/blazeface');
Page({
  data: {
    result: "载入中...",
    _modelUrl: 'https://alfs.chigua.cn/chigua/mini-program/tensorflow/models/blazeface/model.json',
  },
  _model: null,
  async onReady(options){
    const model = await blazeface.load({modelUrl:this.data._modelUrl});
    this._model = model;
    const context = wx.createCameraContext();
    let count = 0;
    const listener = context.onCameraFrame((frame) => {
      count++;
      if (count === 30) {
        this.detectFace(frame);
        count = 0;
      }
    });
    listener.start();
  },
  async detectFace(frame) {
    console.log(frame)
    if (this._model) { 

      const image = {
        data: new Uint8Array(frame.data),
        width: frame.width,
        height: frame.height
      }
      const res = await this._model.estimateFaces(image);
      console.log(res)
      if(res.length>=1){
        this.setData({
          result:"检测到人脸"
        })
      }
      else{
        this.setData({
          result: "没有检测到人脸"
        })
      }
    }
  }
})