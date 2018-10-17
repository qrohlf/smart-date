/* eslint-env mocha */
const {expect} = require('chai')
const sinon = require('sinon')
const moment = require('moment')
const smartDate = require('./index')
const {formatSingleDate, formatDateRange} = smartDate

const TODAY = '2016-06-30' // may not actually be today tomorrow

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
