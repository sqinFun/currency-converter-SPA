import Router from './router'
import utils from './utils'
import api from './api'
import 'normalize.css'
import './css/style.css'


let routList = [
  {
    name: 'index',
    path: 'pages/index',
    title: 'Курс валют',
    link: '/',
  },
  {
    name: 'currency-converter',
    path: 'pages/currencyConverter',
    title: 'Конвертер',
    link: '/currency-converter',
  },
  {
    name: '404',
    path: 'pages/404',
    title: '404',
    link: '/404',
  }
]

window.$utils = utils
window.$api = api
window.Router = new Router(routList)