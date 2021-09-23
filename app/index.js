import Router from './router'
import utils from './utils'



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

window._utils = utils
window.Router = new Router(routList)