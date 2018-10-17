/* eslint-env mocha */
const {expect} = require('chai')
const sinon = require('sinon')
const moment = require('moment')
const smartDate = require('./index')
const {formatSingleDate, formatDateRange} = smartDate

const TODAY = '2016-06-30T00:00' // may not actually be today tomorrow

describe('formatSingleDate', () => {
  let clock

  beforeEach(() => {
    clock = sinon.useFakeTimers(new Date(TODAY).getTime())
  })

  afterEach(() => {
    clock.restore()
  })

  it('one date, this year', () => {
    expect(formatSingleDate('2016-07-04')).to.eql('July 4th')
  })

  it('one date, next year', () => {
    expect(formatSingleDate('2017-07-04')).to.eql('July 4th, 2017')
  })

  it('one date, with time', () => {
    expect(formatSingleDate('2016-07-04 09:30')).to.eql('July 4th, 9:30 am')
  })

  it('one date, next year, with time', () => {
    expect(formatSingleDate('2017-07-04 09:30')).to.eql('July 4th, 9:30 am, 2017')
  })

  it('respects the year override', () => {
    expect(formatSingleDate('2016-07-04')).to.eql('July 4th')
    expect(formatSingleDate('2016-07-04', {includeYear: true})).to.eql('July 4th, 2016')

    expect(formatSingleDate('2017-07-04')).to.eql('July 4th, 2017')
    expect(formatSingleDate('2017-07-04', {includeYear: false})).to.eql('July 4th')
  })

  it('respects the time override', () => {
    expect(formatSingleDate('2016-07-04 09:30')).to.eql('July 4th, 9:30 am')
    expect(formatSingleDate('2016-07-04 09:30', {includeTime: false})).to.eql('July 4th')

    expect(formatSingleDate('2016-07-04')).to.eql('July 4th')
    expect(formatSingleDate('2016-07-04', {includeTime: true})).to.eql('July 4th, 12:00 am')
  })

  it('accepts native Date objects', () => {
    expect(formatSingleDate(new Date('2016-07-04T00:00'))).to.eql('July 4th, 12:00 am')
  })

  it('accepts Moment objects', () => {
    expect(formatSingleDate(moment('2016-07-04T00:00'))).to.eql('July 4th, 12:00 am')
  })

  describe('relative option', () => {
    it('defaults to 1 week for {relative: true}', () => {
      expect(formatSingleDate('2016-06-22', {relative: true})).to.eql('June 22nd')
      expect(formatSingleDate('2016-06-23', {relative: true})).to.eql('June 23rd')
      expect(formatSingleDate('2016-06-24', {relative: true})).to.eql('6 days ago')
      expect(formatSingleDate('2016-06-25', {relative: true})).to.eql('5 days ago')
      expect(formatSingleDate('2016-06-26', {relative: true})).to.eql('4 days ago')
      expect(formatSingleDate('2016-06-27', {relative: true})).to.eql('3 days ago')
      expect(formatSingleDate('2016-06-28', {relative: true})).to.eql('2 days ago')
      expect(formatSingleDate('2016-06-29', {relative: true})).to.eql('yesterday')
      expect(formatSingleDate('2016-07-01', {relative: true})).to.eql('tomorrow')
      expect(formatSingleDate('2016-07-02', {relative: true})).to.eql('in 2 days')
      expect(formatSingleDate('2016-07-03', {relative: true})).to.eql('in 3 days')
      expect(formatSingleDate('2016-07-04', {relative: true})).to.eql('in 4 days')
      expect(formatSingleDate('2016-07-05', {relative: true})).to.eql('in 5 days')
      expect(formatSingleDate('2016-07-06', {relative: true})).to.eql('in 6 days')
      expect(formatSingleDate('2016-07-07', {relative: true})).to.eql('July 7th')
    })

    it('supports the `day` option', () => {
      const relative = 'day'
      expect(formatSingleDate('2016-06-29', {relative})).to.eql('June 29th')
      expect(formatSingleDate('2016-06-29T20:50', {relative})).to.eql('3 hours ago')
      expect(formatSingleDate('2016-06-29T23:50', {relative})).to.eql('10 minutes ago')
      expect(formatSingleDate('2016-06-30T10:00', {relative})).to.eql('in 10 hours')
      expect(formatSingleDate('2016-07-01', {relative})).to.eql('July 1st')
    })

    it('supports the `week` option', () => {
      const relative = 'week'
      expect(formatSingleDate('2016-06-22', {relative})).to.eql('June 22nd')
      expect(formatSingleDate('2016-06-23', {relative})).to.eql('June 23rd')
      expect(formatSingleDate('2016-06-24', {relative})).to.eql('6 days ago')
      expect(formatSingleDate('2016-06-25', {relative})).to.eql('5 days ago')
      expect(formatSingleDate('2016-06-26', {relative})).to.eql('4 days ago')
      expect(formatSingleDate('2016-06-27', {relative})).to.eql('3 days ago')
      expect(formatSingleDate('2016-06-28', {relative})).to.eql('2 days ago')
      expect(formatSingleDate('2016-06-29', {relative})).to.eql('yesterday')
      expect(formatSingleDate('2016-07-01', {relative})).to.eql('tomorrow')
      expect(formatSingleDate('2016-07-02', {relative})).to.eql('in 2 days')
      expect(formatSingleDate('2016-07-03', {relative})).to.eql('in 3 days')
      expect(formatSingleDate('2016-07-04', {relative})).to.eql('in 4 days')
      expect(formatSingleDate('2016-07-05', {relative})).to.eql('in 5 days')
      expect(formatSingleDate('2016-07-06', {relative})).to.eql('in 6 days')
      expect(formatSingleDate('2016-07-07', {relative})).to.eql('July 7th')
    })

    it('supports the `month` option', () => {
      const relative = 'month'
      expect(formatSingleDate('2016-05-30', {relative})).to.eql('May 30th')
      expect(formatSingleDate('2016-05-31', {relative})).to.eql('a month ago')
      expect(formatSingleDate('2016-06-15', {relative})).to.eql('15 days ago')
      expect(formatSingleDate('2016-06-29T23:50', {relative})).to.eql('10 minutes ago')
      expect(formatSingleDate('2016-07-15', {relative})).to.eql('in 15 days')
      expect(formatSingleDate('2016-07-29', {relative})).to.eql('in a month')
      expect(formatSingleDate('2016-07-30', {relative})).to.eql('July 30th')
    })

    it('supports the `year` option', () => {
      const relative = 'year'
      expect(formatSingleDate('2015-05-30', {relative})).to.eql('May 30th, 2015')
      expect(formatSingleDate('2016-04-30', {relative})).to.eql('2 months ago')
      expect(formatSingleDate('2016-06-15', {relative})).to.eql('15 days ago')
      expect(formatSingleDate('2016-06-29T23:50', {relative})).to.eql('10 minutes ago')
      expect(formatSingleDate('2016-08-15', {relative})).to.eql('in 2 months')
      expect(formatSingleDate('2016-12-29', {relative})).to.eql('in 6 months')
      expect(formatSingleDate('2017-07-30', {relative})).to.eql('July 30th, 2017')
    })

    it('accepts a custom function {relative: () => bool}', () => {
      const isEven = m => (m.date() % 2) === 0
      expect(formatSingleDate('2016-06-22', {relative: isEven})).to.eql('8 days ago')
      expect(formatSingleDate('2016-06-23', {relative: isEven})).to.eql('June 23rd')
      expect(formatSingleDate('2016-06-24', {relative: isEven})).to.eql('6 days ago')
      expect(formatSingleDate('2016-06-25', {relative: isEven})).to.eql('June 25th')
    })
  })
})

describe('formatDateRange', () => {
  let clock

  beforeEach(() => {
    clock = sinon.useFakeTimers(new Date(TODAY).getTime())
  })

  afterEach(() => {
    clock.restore()
  })

  it('equal day, equal month, equal year, no times', () => {
    expect(formatDateRange('2016-07-04', '2016-07-04')).to.eql('July 4th')
  })

  it('equal day, equal month, equal year, no times, next year', () => {
    expect(formatDateRange('2017-07-04', '2017-07-04')).to.eql('July 4th, 2017')
  })

  it('equal month, equal year, no times', () => {
    expect(formatDateRange('2016-07-04', '2016-07-05')).to.eql('July 4-5')
  })

  it('equal month, equal year, no times, next year', () => {
    expect(formatDateRange('2017-07-04', '2017-07-05')).to.eql('July 4-5, 2017')
  })

  it('equal month, equal year, start time', () => {
    expect(formatDateRange('2016-07-04 09:30', '2016-07-05')).to.eql('July 4th, 9:30 am - July 5th')
  })

  it('equal month, equal year, start time, next year', () => {
    expect(formatDateRange('2017-07-04 09:30', '2017-07-05')).to.eql('July 4th, 9:30 am - July 5th, 2017')
  })

  it('equal month, equal year, end time', () => {
    expect(formatDateRange('2016-07-04', '2016-07-05 09:30')).to.eql('July 4th - July 5th, 9:30 am')
  })

  it('equal month, equal year, end time, next year', () => {
    expect(formatDateRange('2017-07-04', '2017-07-05 09:30')).to.eql('July 4th - July 5th, 9:30 am, 2017')
  })

  it('different month, equal year', () => {
    expect(formatDateRange('2016-07-04', '2016-08-05')).to.eql('July 4th - August 5th')
  })

  it('different month, equal year, next year', () => {
    expect(formatDateRange('2017-07-04', '2017-08-05')).to.eql('July 4th - August 5th, 2017')
  })

  it('different month, equal year, start time', () => {
    expect(formatDateRange('2016-07-04 09:30', '2016-08-05')).to.eql('July 4th, 9:30 am - August 5th')
  })

  it('different month, equal year, start time, next year', () => {
    expect(formatDateRange('2017-07-04 09:30', '2017-08-05')).to.eql('July 4th, 9:30 am - August 5th, 2017')
  })

  it('different month, equal year, end time', () => {
    expect(formatDateRange('2016-07-04', '2016-08-05 09:30')).to.eql('July 4th - August 5th, 9:30 am')
  })

  it('different month, equal year, end time, next year', () => {
    expect(formatDateRange('2017-07-04', '2017-08-05 09:30')).to.eql('July 4th - August 5th, 9:30 am, 2017')
  })

  it('different year', () => {
    expect(formatDateRange('2016-07-04', '2017-07-04')).to.eql('July 4th, 2016 - July 4th, 2017')
  })

  it('different year, start time', () => {
    expect(formatDateRange('2016-07-04 09:30', '2017-07-05')).to.eql('July 4th, 9:30 am, 2016 - July 5th, 2017')
  })

  it('different year, end time', () => {
    expect(formatDateRange('2016-07-04', '2017-07-05 09:30')).to.eql('July 4th, 2016 - July 5th, 9:30 am, 2017')
  })

  it('respects the time override', () => {
    expect(formatDateRange('2016-07-04', '2016-07-05')).to.eql('July 4-5')
    expect(formatDateRange('2016-07-04', '2016-07-05', {includeTime: true})).to.eql('July 4th, 12:00 am - July 5th, 12:00 am')
  })

  it('respects the year override', () => {
    expect(formatDateRange('2016-07-04', '2016-07-05')).to.eql('July 4-5')
    expect(formatDateRange('2016-07-04', '2016-07-05', {includeYear: true})).to.eql('July 4-5, 2016')
  })

  it('accepts native Date objects', () => {
    expect(
      formatDateRange(new Date('2016-07-04T00:00'), new Date('2016-07-05T00:00'))
    ).to.eql('July 4th, 12:00 am - July 5th, 12:00 am')
  })

  it('accepts Moment objects', () => {
    expect(
      formatDateRange(moment('2016-07-04T00:00'), moment('2016-07-05T00:00'))
    ).to.eql('July 4th, 12:00 am - July 5th, 12:00 am')
  })
})

describe('smartDate', () => {
  let clock

  beforeEach(() => {
    clock = sinon.useFakeTimers(new Date(TODAY).getTime())
  })

  afterEach(() => {
    clock.restore()
  })

  it('accepts a single date string', () => {
    expect(smartDate('2016-07-04')).to.eql('July 4th')
  })

  it('passes through options for single dates', () => {
    expect(smartDate('2016-07-04')).to.eql('July 4th')
    expect(smartDate('2016-07-04', {includeTime: true})).to.eql('July 4th, 12:00 am')
    expect(smartDate('2016-07-04', {includeYear: true})).to.eql('July 4th, 2016')
  })

  it('accepts a single date array', () => {
    expect(smartDate(['2016-07-04'])).to.eql('July 4th')
  })

  it('accepts a date range', () => {
    expect(smartDate(['2016-07-04 09:30', '2016-07-05'])).to.eql('July 4th, 9:30 am - July 5th')
  })

  it('passes through options for date ranges', () => {
    expect(smartDate(['2016-07-04', '2016-07-05'])).to.eql('July 4-5')
    expect(smartDate(['2016-07-04', '2016-07-05'], {includeTime: true})).to.eql('July 4th, 12:00 am - July 5th, 12:00 am')
    expect(smartDate(['2016-07-04', '2016-07-05'])).to.eql('July 4-5')
    expect(smartDate(['2016-07-04', '2016-07-05'], {includeYear: true})).to.eql('July 4-5, 2016')
  })
})
