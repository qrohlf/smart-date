const moment = require('moment')

function smartDate (dates, options) {
  if (!Array.isArray(dates)) { dates = [dates] }
  if (dates.length === 1) {
    return formatSingleDate(dates[0], options)
  } else if (dates.length === 2) {
    return formatDateRange(...dates, options)
  } else {
    throw TypeError('smartDate only accepts 0-2 dates')
  }
}

function applyDefaults (date, options) {
  // if the date being passed in is an ISO8601 string, try to sniff
  // whether we should include the time or not based on the presence
  // of the 'T' (time) parameter
  const includeTime = typeof date === 'string'
    ? date.includes(' ') || date.includes('T')
    : true
  const defaults = {
    includeTime,
    includeYear: moment(date).year() !== moment().year()
  }
  return Object.assign({}, defaults, options)
}

function formatSingleDate (date, options) {
  const {includeTime, includeYear} = applyDefaults(date, options)
  const m = moment(date)
  const format = [
    'MMMM Do',
    includeTime && 'h:mm a',
    includeYear && 'YYYY'
  ].filter(f => f).join(', ')
  return m.format(format)
}

function formatDateRange (start, end, options) {
  const m1 = moment(start)
  const m2 = moment(end)

  // only include the year in the first date if it doesn't match the second date
  const _startOpts = Object.assign({}, options, {includeYear: m1.year() !== m2.year()})
  const startOpts = applyDefaults(start, _startOpts)
  const endOpts = applyDefaults(end, options)
  const anyTimes = startOpts.includeTime || endOpts.includeTime

  // If the dates are identical, return one date
  if (m1.isSame(m2)) {
    return formatSingleDate(start, options)
  }

  // If the dates are in the same month,
  if (m1.isSame(m2, 'month') && !anyTimes) {
    const endFormat = [
      'D',
      endOpts.includeTime && 'h:mm a',
      endOpts.includeYear && 'YYYY'
    ].filter(f => f).join(', ')
    return `${m1.format('MMMM D')}-${m2.format(endFormat)}`
  }

  return `${formatSingleDate(start, startOpts)} - ${formatSingleDate(end, endOpts)}`
}

module.exports = smartDate
module.exports.formatSingleDate = formatSingleDate
module.exports.formatDateRange = formatDateRange
