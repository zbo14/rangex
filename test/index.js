const assert = require('assert')
const rangex = require('..')

describe('rangex', () => {
  it('matches numbers in range', () => {
    const str = '123 10 456 1 789 0'
    const pattern = rangex(11, 500)
    const regex = new RegExp(pattern, 'g')
    const matches = str.match(regex)

    assert.deepStrictEqual(matches, ['123', '456'])
  })

  it('matches number on lower boundary', () => {
    const str = '123 10 456 1 789 0 1234567891 10000010'
    const pattern = rangex(123, 1234567890)
    const regex = new RegExp(pattern, 'g')
    const matches = str.match(regex)

    assert.deepStrictEqual(matches, ['123', '456', '789', '10000010'])
  })

  it('matches number on upper boundary', () => {
    const str = '122 10 456 1 789 0 1234567890 10000010'
    const pattern = rangex(123, 1234567890)
    const regex = new RegExp(pattern, 'g')
    const matches = str.match(regex)

    assert.deepStrictEqual(matches, ['456', '789', '1234567890', '10000010'])
  })

  it('matches number with valid commas', () => {
    const str = '122 10 456 1 789 0 1234567890 10,000,010 100,00,010'
    const pattern = rangex(123, 1234567890)
    const regex = new RegExp(pattern, 'g')
    const matches = str.match(regex)

    assert.deepStrictEqual(matches, ['456', '789', '1234567890', '10,000,010'])
  })
})
