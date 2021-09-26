export default {
  currencyObject: {},
  currencyList: [],
  async fetchCurrencyList() {
    this.currencyObject = await $api.currency.getExchangeRates()

    let entriesCurrencies = Object.entries(this.currencyObject)
    this.currencyList = entriesCurrencies.map(([currencyCode, currency]) => {
      return currency
    })
  }

}