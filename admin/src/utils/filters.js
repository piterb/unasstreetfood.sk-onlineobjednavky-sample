import moment from 'moment'
moment.locale('sk')

export const toGlobalDecimal = function(value) {
  if (!value) return ''
  return value.toString().replace(',', '.')
}

export const toLocaleDecimal = function(value) {
  if (!value && value != 0) return ''
  return parseFloat(value)
    .toFixed(2)
    .replace('.', ',')
}

export const toLocaleCurrency = function(value) {
  if (!value && value != 0) return ''
  return parseFloat(value).toLocaleString('sk-SK', {
    style: 'currency',
    currency: 'EUR'
  })
}

export const toLocaleDatetime = function(value) {
  if (!value && value != 0) return ''
  return moment(value).format('llll')
}
