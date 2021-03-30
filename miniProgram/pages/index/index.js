Page({
  data: {
    list: [
      {
        id: 'view',
        name: '相机模块',
        open: true,
        pages: [{
          name: '人脸检测',
          url: 'cameraFaceDetection'
        }, {
          name: '人体姿态识别',
          url: 'cameraFaceRecognition'
        }, {
          name: '人体检测',
          url: 'cameraBodyDetection'
        }, {
          name: '物品识别',
          url: 'cameraItemIdentification'
        }, {
          name: '目标检测',
          url: 'cameraTargetDetection'
        }, {
          name: '样本采集识别',
          url: 'SampleCollectionIdentification'
        }]
      }
    ]
  },
  onLoad: function (options) {
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  }
})