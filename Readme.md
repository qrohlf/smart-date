# smart-date

A small utility to format ISO8601 dates and date ranges into nice human-readable strings.

## quickstart

```
npm i @qrohlf/smart-date
```

```
const smartDate = require('@qrohlf/smart-date')

smartDate('2015-07-04') // => 'July 4th, 2017'

smartDate(['2017-07-04', '2017-07-05 09:30']) // => 'July 4th - July 5th, 9:30 am, 2017'
```

## all features

see the [tests](./tests.js) for the full range of input & options that smartDate can handle
