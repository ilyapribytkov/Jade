// Variables
const { put, overlay } = elementDOM_var
const {
  noteForm,
  allNoteInput,
  removeButton,
  editButton,
  filterButton,
  filterBlock,
  currencyElement,
} = expense_var

// Local Srorage
function saveToLS() {
  localStorage.setItem("dataNote", JSON.stringify(dataNote))
}

if (localStorage.getItem("dataNote")) {
  dataNote = JSON.parse(localStorage.getItem("dataNote"))
  renderExpenseField(dataNote)
}

if (localStorage.getItem("currency")) {
  currencyElement.textContent = JSON.parse(localStorage.getItem("currency"))
}

// Data
const mark = {
  id: 0,
  category: "",
  value: 0,
  date: "",
  description: "",
}

let markId = null
let modalOpenTime = null // Добавлено для GTM

// Toggle Note
function toggleNote() {
  noteForm.classList.toggle("none")
  overlay.classList.toggle("none")

  if (!noteForm.closest(".none")) {
    put.children[0].textContent = "x"

    // --- GTM: Открытие модалки (только для новых записей) ---
    if (markId === null) {
      modalOpenTime = Date.now()
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: "expense_modal_open",
      })
    }
    // --------------------------------------------------------

    markId !== null ? fillInputValue() : 0
  } else {
    put.children[0].textContent = "+"
    markId = null
    allNoteInput.forEach((input) => (input.value = ""))
  }
}

// Handlers form
function handleNoteForm(e) {
  e.preventDefault()

  if (markId !== null) return editMark()

  dataNote.push({ ...mark })

  // --- GTM: Успешное создание записи ---
  if (modalOpenTime) {
    const processingTime = (Date.now() - modalOpenTime) / 1000

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: "expense_add_success",
      expense_data: {
        value: mark.value,
        category: mark.category,
        currency: currencyElement.textContent.trim(), // Берем текущую валюту из элемента
        processing_time: processingTime,
      },
    })

    // Сбрасываем таймер, чтобы он не влиял на следующие действия
    modalOpenTime = null
  }
  // -------------------------------------

  allNoteInput.forEach((input) => (input.value = ""))
  addMark(mark)
  toggleNote()
  clearMark()
}

function handleNoteInput() {
  switch (this.dataset.id) {
    case "input-category":
      mark.category = this.value
      break
    case "input-value":
      mark.value = this.value
      break
    case "input-date":
      mark.date = new Date(this.value).toLocaleString()
      break
    case "input-description":
      mark.description = this.value
      break
  }
  markId !== null ? (mark.id = markId) : (mark.id = Date.now())
}

function fillInputValue() {
  const currentData = dataNote.filter((d) => d.id === markId)[0]

  mark.id = currentData.id
  mark.category = currentData.category
  mark.value = currentData.value
  mark.date = currentData.date
  mark.description = currentData.description

  const dataInput = dataNote.filter((d) => d.id === markId)[0]

  function convertTime(date) {
    const time = date.split(",").reduce((acc, word, i) => {
      i < 1
        ? (acc += word.trim().split(".").reverse().join("-") + "T")
        : (acc += word.trim())
      return acc
    }, "")

    return time
  }

  allNoteInput.forEach((input) => {
    switch (input.dataset.id) {
      case "input-category":
        input.value = dataInput.category.toLowerCase()
        break
      case "input-value":
        input.value = dataInput.value
        break
      case "input-date":
        input.value =
          convertTime(dataInput.date) !== "" ? convertTime(dataInput.date) : ""
        break
      case "input-description":
        input.value = dataInput.description
        break
    }
  })
}

// Render, add, edit note
function renderExpenseField(array) {
  const expenseContent = document.getElementById("expense-content")
  array.forEach(({ id, category, value, date, description }, i) => {
    const expenseField = `
    <div class="expense-field" id="${id}">
      <div class="expense-field__info" id="place">${i + 1}</div>
      <div class="expense-field__info">${category}</div>
      <div class="expense-field__info">${value}</div>
      <div class="expense-field__info expense-field__info-date">${date}</div>
      <div class="expense-field__info expense-field__button_description">${description}</div>
      <button class="expense-field__button expense-field__button_edit">Edit</button>
      <button class="expense-field__button expense-field__button_remove">Remove</button>
    </div>
  `
    expenseContent.insertAdjacentHTML("beforeend", expenseField)
  })
  haveMark()
}

function haveMark() {
  if (removeButton().length < 1) return

  // Remove and Edit
  removeButton().forEach((button) =>
    button.addEventListener("click", removeMark),
  )
  editButton().forEach((button) => button.addEventListener("click", findMarkId))

  // Filter
  filterButton().addEventListener("click", openFilter)
  filterBlock().addEventListener("click", closeFilter)
}

function addMark(mark) {
  const expenseContent = document.getElementById("expense-content")
  const { id, category, value, date, description } = mark
  if (!expenseContent) return

  const markHTML = `
    <div class="expense-field" id="${id}">
      <div class="expense-field__info" id="place">${dataNote.length}</div>
      <div class="expense-field__info">${category}</div>
      <div class="expense-field__info">${value}</div>
      <div class="expense-field__info expense-field__info-date">${date}</div>
      <div class="expense-field__info expense-field__button_description">${description}</div>
      <button class="expense-field__button expense-field__button_edit">Edit</button>
      <button class="expense-field__button expense-field__button_remove">Remove</button>
    </div>
  `

  expenseContent.insertAdjacentHTML("beforeend", markHTML)
  haveMark()
  saveToLS()
}

function removeMark() {
  const numFieldAll = document.querySelectorAll("#place")
  const currentField = this.closest(".expense-field")
  const currentFieldId = +currentField.id
  const currentFieldNum = +currentField.children[0].textContent

  currentField.remove()

  dataNote.forEach(({ id }, i) =>
    id === currentFieldId ? dataNote.splice(i, 1) : 0,
  )
  numFieldAll.forEach((num, i) =>
    i + 1 > currentFieldNum ? (num.innerText = i) : 0,
  )

  saveToLS()
}

function editMark() {
  const fields = Array.from(document.querySelectorAll(".expense-field"))
  const currentField = fields.filter((field) => +field.id === markId)[0]

  const fieldCategory = currentField.children[1]
  const fieldValue = currentField.children[2]
  const fieldDate = currentField.children[3]
  const fieldDescription = currentField.children[4]

  dataNote.forEach((obj, i) =>
    obj.id === markId ? dataNote.splice(i, 1, { ...mark }) : 0,
  )

  fieldCategory.textContent = mark.category
  fieldValue.textContent = mark.value
  fieldDate.textContent = mark.date
  fieldDescription.textContent = mark.description

  allNoteInput.forEach((input) => (input.value = ""))
  toggleNote()
  clearMark()
  saveToLS()
}

function clearMark() {
  mark.id = 0
  mark.category = ""
  mark.value = 0
  mark.date = ""
  mark.description = ""
}

function findMarkId() {
  markId = +this.closest(".expense-field").id
  toggleNote()
}

// Filter
function openFilter() {
  if (dataNote < 1) return
  filterBlock().classList.remove("none")

  const buttonValue = document.querySelectorAll(".value__button")
  const buttonTime = document.querySelectorAll(".category__button")
  const buttonDefault = document.querySelector(".default__button")

  buttonValue.forEach((bv) => bv.addEventListener("click", filtredValue))
  buttonTime.forEach((bt) => bt.addEventListener("click", filteredCategory))
  buttonDefault.onclick = () => {
    const acitveField = document.querySelectorAll(".expense-field")
    acitveField.forEach((field, i) => (i > 0 ? field.remove() : 0))
    renderExpenseField(dataNote)
    filterBlock().classList.add("none")
  }
}

function closeFilter({ target }) {
  if (!target.closest(".filter-container")) {
    filterBlock().classList.add("none")
  }
}

function filtredValue({ target }) {
  const acitveField = document.querySelectorAll(".expense-field")
  acitveField.forEach((field, i) => (i > 0 ? field.remove() : 0))

  let filteredArray = []
  switch (target.dataset.value) {
    case "low":
      filteredArray = [...dataNote].sort((a, b) => a.value - b.value)
      renderExpenseField(filteredArray)
      break
    case "high":
      filteredArray = [...dataNote].sort((a, b) => b.value - a.value)
      renderExpenseField(filteredArray)
      break
  }

  filterBlock().classList.add("none")
}

function filteredCategory({ target }) {
  const acitveField = document.querySelectorAll(".expense-field")
  acitveField.forEach((field, i) => (i > 0 ? field.remove() : 0))

  let filteredArray = []
  switch (target.dataset.category) {
    case "product":
      filteredArray = [...dataNote].filter(
        ({ category }) => category === "product",
      )
      renderExpenseField(filteredArray)
      break
    case "home":
      filteredArray = [...dataNote].filter(
        ({ category }) => category === "home",
      )
      renderExpenseField(filteredArray)
      break
    case "fun":
      filteredArray = [...dataNote].filter(({ category }) => category === "fun")
      renderExpenseField(filteredArray)
      break
    case "other":
      filteredArray = [...dataNote].filter(
        ({ category }) => category === "other",
      )
      renderExpenseField(filteredArray)
      break
  }

  filterBlock().classList.add("none")
}

// Events
put.addEventListener("click", toggleNote)
noteForm.addEventListener("submit", handleNoteForm)
allNoteInput.forEach((input) =>
  input.addEventListener("input", handleNoteInput),
)
