import '@babel/polyfill'
import { accAdd } from '@/utils/utils'
const version = '1.01'
// debugger
// if (
//   window.location.href.indexOf('http://') > -1 &&
//   window.location.href.indexOf('http://1') === -1 &&
//   window.location.href.indexOf('http://localhost') === -1
// ) {
//   //http重定向到https
//   localStorage.setItem('version', version)
//   window.location.href = window.location.href.replace('http://', 'https://')
// } else if (localStorage.version !== version) {
//   localStorage.setItem('version', version)
//   window.location.reload()
// }

Number.prototype.accurateAdd = function(arg) {
  const a = [].slice.call(arguments)
  return accAdd(a, this)
}
