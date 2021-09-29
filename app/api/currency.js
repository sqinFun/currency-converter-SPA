import mockCurrency from "./mockCurrency"

// В апишке не было рубля
// Так конечно делать не стоит
const RUBCurrency = {
  "ID": "_RUB",
  "NumCode": "643",
  "CharCode": "RUB",
  "Nominal": 1,
  "Name": "Российский рубль",
  "Value": 1,
  "Previous": 1
}

export default {
  async getExchangeRates() {
    // const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js')
    // const { Valute } = await response.json()
    const { Valute } = mockCurrency
    return {...Valute, RUB: RUBCurrency }
  }
}