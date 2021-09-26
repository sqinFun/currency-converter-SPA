import store from '../../store/index'

export default class indexPage {
  currencies = {}
  nodeCurrency = document.querySelector('#exchange-rates')
  nodeFeatureCurrency = document.querySelector('#feature-exchange-rates')
  currencyList = []
  featureCurrencyCode = ['USD']

  async mounted() {
    if(!this.currencyList?.length)
      await this.fetchCurrencyList()

    this.appendCourses()
  }

  appendCourses() {
    const nodeFeatureCurrencyList = []
    const nodeCurrencyList = []
    this.currencyList.forEach(currency => {
      let nodeCurrencyItem = this.getCurrencyItem({ name: currency.Name, value: currency.Value, code: currency.CharCode })
      if(this.featureCurrencyCode.includes(currency.CharCode)) 
        nodeFeatureCurrencyList.push(nodeCurrencyItem)
      else
        nodeCurrencyList.push(nodeCurrencyItem)
    })

    this.nodeCurrency.innerHTML = nodeCurrencyList.join('')
    this.nodeFeatureCurrency.innerHTML = nodeFeatureCurrencyList.join('')
  }

  async fetchCurrencyList() {
    await store.currency.fetchCurrencyList()
    this.currencyList = store.currency.currencyList
  }

  getCurrencyItem({name, value, code}) {
    return `
    <div class="feature-list__item">
      <div class="feature-list__item-content">
        <p class="feature-list__name">${name}:</p>
        <p class="feature-list__value">${value}<span> руб.</span></p>
      </div>
      <div class="feature-list__control">
        <div data-currency-code="${code}" class="feature-icon">★</div>
      </div>
    </div>
    `
  }
}