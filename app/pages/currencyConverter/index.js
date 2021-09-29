
import store from '_store'

const FROM_FIELD_NAME = 'from'
const TO_FIELD_NAME = 'to'

const DEFAULT_CURRENCY_CODE_FROM = 'RUB'
const DEFAULT_CURRENCY_CODE_TO = 'USD'
export default class CurrencyConverter {
  currencyList = store.currency.currencyList || []
  optionList = []
  selectNodes = {
    from: document.querySelector('#converter-type-from'),
    to: document.querySelector('#converter-type-to')
  }
  inputNodes = {
    from: document.querySelector('#converter-input-from'),
    to: document.querySelector('#converter-input-to')
  }
  selectedCurrencyType = {
    from: null,
    to: null,
  }
  currencyValue = {
    from: 0,
    to: 0,
  }

  handleSetCurrencyType(fieldName, e) {
    this.setCurrencyType(fieldName, e.target.value)
  }
  handleSetCurrencyValue(fieldName, e) {
    this.setCurrencyValue(fieldName, e.target.value)
  }
  bindedHandleSetCurrencyTypeFrom = this.handleSetCurrencyType.bind(this, FROM_FIELD_NAME)
  bindedHandleSetCurrencyTypeTo = this.handleSetCurrencyType.bind(this, TO_FIELD_NAME)
  bindedHandleSetCurrencyValueFrom = this.handleSetCurrencyValue.bind(this, FROM_FIELD_NAME)
  bindedHandleSetCurrencyValueTo = this.handleSetCurrencyValue.bind(this, TO_FIELD_NAME)


  async mounted() {
    if(!this.currencyList?.length)
      await this.fetchCurrencyList()

    this.setCurrencySelectOption()
    this.watchUpdateCurrencyType()
    this.watchUpdateCurrencyValue()
  }

  setCurrencySelectOption() {
    let optionFragment = new DocumentFragment()
    let fromSelectValue = $utils.getLocalStorage('currency-code-from') || DEFAULT_CURRENCY_CODE_FROM
    let toSelectValue = $utils.getLocalStorage('currency-code-to') || DEFAULT_CURRENCY_CODE_TO

    this.currencyList.forEach(currency => {
      optionFragment.append(new Option(currency.Name, currency.CharCode))
    })

    this.selectNodes.from.append(optionFragment.cloneNode(true))
    this.selectNodes.to.append(optionFragment)

    this.setCurrencyType(FROM_FIELD_NAME, fromSelectValue)
    this.setCurrencyType(TO_FIELD_NAME, toSelectValue)
  }

  async fetchCurrencyList() {
    await store.currency.fetchCurrencyList()
    this.currencyList = store.currency.currencyList
  }

  setCurrencyType(targetField, code) {
    this.selectedCurrencyType[targetField] = store.currency.currencyObject[code]

    $utils.setLocalStorage(`currency-code-${targetField}`, code)
    this.selectNodes[targetField].value = code

    this.setConvertValue(FROM_FIELD_NAME)
  }

  setCurrencyValue(targetField, value) {
    this.currencyValue[targetField] = value
    this.setConvertValue(targetField)
  }

  watchUpdateCurrencyType() {
    this.selectNodes.from.addEventListener('change', this.bindedHandleSetCurrencyTypeFrom)
    this.selectNodes.to.addEventListener('change', this.bindedHandleSetCurrencyTypeTo)
  }

  watchUpdateCurrencyValue() {
    this.inputNodes.from.addEventListener('input', this.bindedHandleSetCurrencyValueFrom)
    this.inputNodes.to.addEventListener('input', this.bindedHandleSetCurrencyValueTo)
  }

  unwatchUpdateCurrencyType() {
    this.selectNodes.from.removeEventListener('change', this.bindedHandleSetCurrencyTypeFrom)
    this.selectNodes.to.removeEventListener('change', this.bindedHandleSetCurrencyTypeTo)
  }
  unwatchUpdateCurrencyValue() {
    this.inputNodes.from.removeEventListener('input', this.bindedHandleSetCurrencyValueFrom)
    this.inputNodes.to.removeEventListener('input', this.bindedHandleSetCurrencyValueTo)
  }

  getConvertCurrency({selectedCurrencyValue, fromCurrency, toCurrency}) {
    if(!fromCurrency || !toCurrency)
      return 0
    const fromCurrencyUnitCost = fromCurrency.Value / fromCurrency.Nominal
    const toCurrencyUnitCost = toCurrency.Value / toCurrency.Nominal
    const resultCost = toCurrencyUnitCost / fromCurrencyUnitCost * selectedCurrencyValue
    return resultCost.toFixed(2)
  }

  setConvertValue(selectedFieldName) {
    const calculatedField = selectedFieldName === FROM_FIELD_NAME ? TO_FIELD_NAME : FROM_FIELD_NAME

    this.currencyValue[calculatedField] = this.getConvertCurrency({
      selectedCurrencyValue: this.currencyValue[selectedFieldName],
      fromCurrency: this.selectedCurrencyType[calculatedField],
      toCurrency: this.selectedCurrencyType[selectedFieldName],
    })

    this.inputNodes[calculatedField].value = this.currencyValue[calculatedField]
  }

  destroy() {
    this.unwatchUpdateCurrencyType()
    this.unwatchUpdateCurrencyValue()
  }
}