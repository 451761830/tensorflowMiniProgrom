import { exp } from "@tensorflow/tfjs-core"

const BASE_URL = "https://alfs.chigua.cn/chigua/mini-program/tensorflow/models/"
const FILE_NAME = "model.json"

export const POSENET_URL = `${BASE_URL}posenet/${FILE_NAME}`

export const BLAZEFACE_URL =  `${BASE_URL}blazeface/${FILE_NAME}`

export const BODYPIX_URL =  `${BASE_URL}body-pix/${FILE_NAME}`

export const COCOSSD_URL =  `${BASE_URL}coco-ssd/${FILE_NAME}`

export const MOBILENET_URL =  `${BASE_URL}mobilenet/${FILE_NAME}`