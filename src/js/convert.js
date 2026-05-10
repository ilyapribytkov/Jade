// Variables
const {
  store,
  fromSelect,
  toSelect,
  inputValue,
  convertForm,
  convertValue,
  convertCurrency,
  switchButton,
} = convert_var

// Store
const { url } = store
let { from, to, amount } = store

// Request to server
async function getCurrency() {
  try {
    const response = await fetch(`${url}/codes`)
    const data = await response.json()
    return data.supported_codes
  } catch (err) {
    console.log(
      `Пожалуйста, проверьте подключение к интеренету или ожидайте ответа от сервера.\nВ текущий момент данные валют не могут быть получены\n${err}`,
    )
  }
}

async function sendRequest(e) {
  e.preventDefault()
  try {
    const response = await fetch(`${url}/pair/${from}/${to}/${amount}`)
    const data = await response.json()

    // --- GTM: Успешная конвертация ---
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: "currency_conversion",
      conversion_data: {
        from_currency: from,
        to_currency: to,
        amount: amount,
        result_value: data.conversion_result, // на всякий случай сохраним и результат
      },
    })
    // --------------------------------

    renderConversionResult(data)
  } catch (err) {
    console.log(
      `Какие-то неполадки при запросе данных с сервера. Пока налейте чашечку чая и передохните, все будет хорошо\n${err}`,
    )
  }
}

// Handlers form
const handleFromSelect = ({ target }) => (from = target.value)
const handleToSelect = ({ target }) => (to = target.value)
const handleInputValue = ({ target }) => (amount = target.value)

// Render
async function renderOptionHTML() {
  const data = await getCurrency()

  data.forEach((currency) => {
    const option = `<option value="${currency[0]}">${currency[0]}</option>`

    fromSelect().insertAdjacentHTML("beforeend", option)
    toSelect().insertAdjacentHTML("beforeend", option)
  })
}

function renderConversionResult({ conversion_result }) {
  convertValue().textContent = `${+conversion_result.toFixed(2)}`
  convertCurrency().textContent = `${to}`
}

function switchCurrency() {
  if (!fromSelect().value || !toSelect().value) return

  fromSelect().value = to
  toSelect().value = from

  from = fromSelect().value
  to = toSelect().value
}

// Start
function startConvert() {
  renderOptionHTML()

  // Events
  fromSelect().addEventListener("change", handleFromSelect)
  toSelect().addEventListener("change", handleToSelect)
  inputValue().addEventListener("input", handleInputValue)
  convertForm().addEventListener("submit", sendRequest)
  switchButton().addEventListener("click", switchCurrency)
}
