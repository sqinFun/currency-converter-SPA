import store from 'store'

export default class indexPage {
  currencies = {}
  nodeCurrency = document.querySelector('#exchange-rates')
  nodeFeatureCurrency = document.querySelector('#feature-exchange-rates')
  currencyList = []
  featureCurrencyCode = this.getFeatureCurrencyCode() || []
  currencyNodeItems = null
  bindedToggleFeatureCurrency = this.toggleFeatureCurrency.bind(this)

  async mounted() {
    if(!this.currencyList?.length)
      await this.fetchCurrencyList()

    this.appendCourses()
    this.currencyNodeItems = document.querySelectorAll('.currency-toggle-feature')
    this.watchToggleFeature()
  }

  appendCourses() {
    const nodeFeatureCurrencyList = []
    const nodeCurrencyList = []
    this.currencyList.forEach(currency => {
      let currencyUnitCost = currency.Value / currency.Nominal
      let nodeCurrencyItem = this.getCurrencyItem({ 
        name: currency.Name,
        currencyUnitCost: currencyUnitCost.toFixed(2),
        code: currency.CharCode,
        isFeature: this.featureCurrencyCode.includes(currency.CharCode)
       })
      if(this.featureCurrencyCode.includes(currency.CharCode)) 
        nodeFeatureCurrencyList.push(nodeCurrencyItem)
      else
        nodeCurrencyList.push(nodeCurrencyItem)
    })

    this.nodeCurrency.innerHTML = nodeCurrencyList.join('')
    this.nodeFeatureCurrency.innerHTML = nodeFeatureCurrencyList.join('')
  }

  toggleFeatureCurrency(e) {
    const target = e.target
    const targetCurrencyCode = target.dataset.currencyCode
    const targetItem = e.path.find(parent => parent.classList.contains('currency-item'))

    const featureIndex = this.featureCurrencyCode.findIndex(currencyCode => currencyCode === targetCurrencyCode)

    if(featureIndex === -1) {
      this.featureCurrencyCode.push(targetCurrencyCode)
      this.nodeFeatureCurrency.append(targetItem)
      target.classList.add('_active')
    } else {
      this.featureCurrencyCode.splice(featureIndex, 1)
      this.nodeCurrency.prepend(targetItem)
      target.classList.remove('_active')
    }
    $utils.setLocalStorage('feature-currency-code', this.featureCurrencyCode)
  }

  watchToggleFeature() {
    this.currencyNodeItems.forEach(currency => {
      currency.addEventListener('click', this.bindedToggleFeatureCurrency)
    })
  }

  unwatchToggleFeature() {
    this.currencyNodeItems.forEach(currency => {
      currency.removeEventListener('click', this.bindedToggleFeatureCurrency)
    })
  }

  async fetchCurrencyList() {
    await store.currency.fetchCurrencyList()
    this.currencyList = store.currency.currencyList
  }

  getFeatureCurrencyCode() {
    return $utils.getLocalStorage('feature-currency-code')
  }

  getCurrencyItem({name, currencyUnitCost, code, isFeature}) {
    return `
    <div class="feature-list__item currency-item">
      <div class="feature-list__item-content">
        <p class="feature-list__name">${name}:</p>
        <p class="feature-list__value">${currencyUnitCost}<span> руб.</span></p>
      </div>
      <div class="feature-list__control">
        <div data-currency-code="${code}" class="feature-icon currency-toggle-feature ${isFeature ? '_active' : ''}">★</div>
      </div>
    </div>
    `
  }

  destroy() {
    this.unwatchToggleFeature()
  }
}