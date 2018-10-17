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
    includeYear: moment(date).year() !== moment().year(),
    relative: false
  }
  return Object.assign({}, defaults, options)
}

// given the specific date in question, and the value the caller has given for
// options.relative, return whether the date should be displayed as relative or not
function interpretRelativeOpt (m, relative) {
  switch (typeof relative) {
    case 'function': {
      return relative(m)
    }
    case 'string': {
      if (!['day', 'week', 'month', 'year'].includes(relative)) {
        throw Error('Invalid value `' + relative + '` supplied for options.relative')
      }
      const start = moment().subtract(1, relative)
      const end = moment().add(1, relative)
      return m.isBetween(start, end)
    }
    case 'boolean': {
      const start = moment().subtract(1, 'week')
      const end = moment().add(1, 'week')
      return relative && m.isBetween(start, end)
    }
    default: {
      throw Error('Invalid value `' + relative + '` supplied for options.relative')
    }
  }
}

function formatSingleDate (date, options) {
  const {includeTime, includeYear, relative} = applyDefaults(date, options)
  const m = moment(date)
  const shouldDisplayRelative = relative && interpretRelativeOpt(m, relative)
  if (shouldDisplayRelative) {
    const relativeString = m.fromNow()
    switch (relativeString) {
      case 'a day ago':
        return 'yesterday'
      case 'in a day':
        return 'tomorrow'
      default:
        return relativeString
    }
  }
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
