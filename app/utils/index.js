export default {
  clone(obj) {
    return JSON.parse(JSON.stringify(obj))
  },

  setLocalStorage(field, value) {
    localStorage.setItem(field, JSON.stringify(value));
  },
  
  getLocalStorage(field) {
    return JSON.parse(localStorage.getItem(field));
  }
}