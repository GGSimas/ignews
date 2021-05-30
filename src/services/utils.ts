//#region CURRENCYS 

export const formatCurrency = (value: number, lang='en-US', currency='USD') => {
  return new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

//#endregion

//#region DATES

export const formatToLongDate = (value: Date| string , lang='pt-BR') => {
  return new Date(value).toLocaleDateString(lang, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

//#endregion