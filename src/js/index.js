let dataNote = []
let currency = "USD"

const demoData = [
  {
    id: 1706535641550,
    category: "product",
    value: "250",
    date: "26.01.2024, 18:40:00",
    description: "",
  },
  {
    id: 1706535662820,
    category: "home",
    value: "450",
    date: "28.01.2024, 11:40:00",
    description: "",
  },
  {
    id: 1706535682693,
    category: "fun",
    value: "100",
    date: "27.01.2024, 18:41:00",
    description: "",
  },
  {
    id: 1706535707533,
    category: "other",
    value: "180",
    date: "25.01.2024, 16:41:00",
    description: "",
  },
  {
    id: 1706535468816,
    category: "product",
    value: "300",
    date: "01.01.2024, 16:37:00",
    description: "",
  },
  {
    id: 1706535478803,
    category: "home",
    value: "200",
    date: "02.01.2024, 16:37:00",
    description: "",
  },
  {
    id: 1706535496485,
    category: "fun",
    value: "130",
    date: "04.01.2024, 16:38:00",
    description: "",
  },
  {
    id: 1706535511799,
    category: "other",
    value: "90",
    date: "07.01.2024, 16:38:00",
    description: "",
  },
  {
    id: 1706535228257,
    category: "product",
    value: "200",
    date: "29.03.2023, 13:34:00",
    description: "chocolates and candi",
  },
  {
    id: 1706535323403,
    category: "fun",
    value: "400",
    date: "29.05.2023, 19:34:00",
    description: "parks and attraction",
  },
  {
    id: 1706535352047,
    category: "home",
    value: "100",
    date: "29.06.2023, 19:38:00",
    description: "",
  },
  {
    id: 1706535377099,
    category: "other",
    value: "150",
    date: "29.12.2023, 16:36:00",
    description: "",
  },
  {
    id: 1706534859911,
    category: "product",
    value: "100",
    date: "29.01.2022, 16:26:00",
    description: "vkusno pokushat",
  },
  {
    id: 1706534897951,
    category: "home",
    value: "300",
    date: "29.01.2023, 16:27:00",
    description: "",
  },
  {
    id: 1706534956973,
    category: "fun",
    value: "150",
    date: "29.04.2022, 16:28:00",
    description: "snow slides",
  },
  {
    id: 1706535034175,
    category: "other",
    value: "190",
    date: "16.12.2022, 20:29:00",
    description: "something else",
  },
]

if (!localStorage.getItem("dataNote")) {
  localStorage.setItem("dataNote", JSON.stringify(demoData))
}

// Get currency
if (localStorage.getItem("currency")) {
  currency = JSON.parse(localStorage.getItem("currency"))
}
