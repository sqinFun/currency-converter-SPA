import mockCurrency from "./mockCurrency"
export default {
  async getExchangeRates() {
    // const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js')
    // const { Valute } = await response.json()
    const { Valute } = mockCurrency
    return Valute
  }
}