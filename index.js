'use strict'

const digits = x => Array.from('' + x).map(s => +s)
const isNumber = x => typeof x === 'number' && !Number.isNaN(x)
const splitTokens = str => str.split(/(\[.*?\]|\d)/g).filter(Boolean)

const addCommas = pattern => {
  const tokens = splitTokens(pattern).reverse()
  const newTokens = []

  for (let i = 0; i < tokens.length; i++) {
    newTokens.push(tokens[i])

    if (!((i + 1) % 3)) {
      newTokens.push(',?')
    }
  }

  pattern = newTokens.reverse().join('')

  if (pattern.startsWith(',?')) {
    pattern = pattern.slice(2)
  }

  return pattern
}

const generatePatterns = (min, max, patterns = []) => {
  const minDigs = digits(min).reverse()
  const maxDigs = digits(max).reverse()
  const samePow10 = minDigs.length === maxDigs.length

  let done = false
  let i = 0
  let pattern = ''
  let range = ''

  for (; i < minDigs.length; i++) {
    if (samePow10 && maxDigs[i]) {
      done = i === maxDigs.length - 1

      if (done) {
        switch (maxDigs[i]) {
          case 1:
            break

          case 2:
            range = '1'
            break

          default:
            range = `[1-${maxDigs[i] - 1}]`
        }
      } else if (i) {
        range = maxDigs[i] === 1 ? '0' : `[0-${maxDigs[i] - 1}]`
      } else {
        range = `[0-${maxDigs[i]}]`
      }

      if (range) {
        pattern = maxDigs.slice(i + 1).reverse().join('') + range + pattern
      } else {
        pattern = ''
      }

      break
    } else if (!samePow10 && minDigs[i]) {
      range = minDigs[i] === 9 ? '9' : `[${minDigs[i]}-9]`
      pattern = minDigs.slice(i + 1).reverse().join('') + range + pattern
      break
    }

    pattern = '[0-9]' + pattern
  }

  pattern = pattern && addCommas(pattern)

  if (samePow10) {
    const newDigs = [
      ...Array
        .from({ length: i + 1 })
        .map(_ => 0),

      ...maxDigs.slice(i + 1)
    ]

    const nextMax = +newDigs.reverse().join('')

    pattern && patterns.unshift(pattern)

    return done
      ? patterns
      : generatePatterns(min, nextMax, patterns)
  }

  const newDigs = [
    ...Array
      .from({ length: i + 1 })
      .map(_ => 0),

    ...minDigs.slice(i + 1)
  ]

  const nextMin = +newDigs.reverse().join('') + Math.pow(10, i + 1)

  patterns.unshift(pattern)

  return generatePatterns(nextMin, max, patterns)
}

/**
 * @param  {Number} min
 * @param  {Number} max
 *
 * @return {String}
 */
const generatePattern = (min, max) => {
  if (!isNumber(min)) {
    throw new Error('Expected min to be a number')
  }

  if (!isNumber(max)) {
    throw new Error('Expected max to be a number')
  }

  if (min >= max) {
    throw new Error('Expected min to be less than max')
  }

  const patterns = generatePatterns(min, max)

  if (!(max % 10)) {
    patterns.unshift(addCommas(max + ''))
  }

  return `\\b(${patterns.join('|')})\\b`
}

module.exports = generatePattern
