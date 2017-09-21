#!/usr/bin/env node

const yargs = require('yargs')
const Stats = require('datadog-metrics')
const { isArray } = require('lodash')

const verbose = { alias: 'V', default: false }
const required = [ 'host', 'service', 'env' ]
const commands = [
  {
    name: 'gauge',
    description: 'Send gauge value',
    required: [ 'metric', 'value' ]
  },
  {
    name: 'count',
    description: 'Send count value',
    required: [ 'metric', 'value' ]
  },
  {
    name: 'increment',
    description: 'Increment by val or 1',
    required: [ 'metric' ]
  },
  {
    name: 'histogram',
    description: 'Send histogram value',
    required: [ 'metric', 'value' ]
  }
]

for (let command of commands) {
  yargs.command(command.name, command.description, (y) => {
    y.option('metric')
    .alias('m', 'metric')
    .describe('m', 'normalized metric name to register within datadog')
    .option('value')
    .alias('v', 'value')
    .describe('v', 'amount to send')
    .option('tag')
    .alias('t', 'tag')
    .describe('t', 'tag to list with it, multiples allowed')
    .demandOption(command.required, `Please provide the ${command.required.join(' and ')} argument${command.required.length > 1 ? 's' : ''} to work with this command`)
  }, (argv) => {
    const log = argv.verbose ? console.log : () => {}
    log(`sending ${command.name} for ${argv.service} in ${argv.env} from ${argv.host}...`)
    const apiKey = argv.key || process.env.DATADOG_API_KEY
    const stats = new Stats.BufferedMetricsLogger({
      apiKey,
      host: argv.host,
      prefix: `${argv.service}.`,
      flushIntervalSeconds: 0,
      defaultTags: [`env:${argv.env}`]
    })
    const action = command.name
    if (action === 'count') action = 'increment'
    const params = [argv.metric]
    if (argv.value && command.name !== 'increment') params.push(argv.value)
    if (argv.tag && action !== 'increment') {
      if (!isArray(argv.tag)) argv.tag = [argv.tag]
      params.push(argv.tag)
    }
    stats[action].apply(stats, params)
    stats.flush((results) => {
      console.log(results)
      log(`completed sending ${command.name} for ${argv.service} in ${argv.env} from ${argv.host}.`)
      process.exit()
    }, (error) => {
      console.log('an error occured')
      console.log(error)
      process.exit(1)
    })
  })
}
yargs.option('agent')
.alias('h', 'host')
.describe('h', 'the hostname reported with each metric')
.option('service')
.alias('s', 'service')
.describe('s', 'the name of the service, normalized')
.option('env')
.alias('e', 'env')
.describe('e', 'the name of the environment')
.option('key')
.alias('k', 'key')
.describe('k', 'your datadog api key')
.demandOption(required, `Please provide the ${required.join(' and ')} arguments to work with this command`)
.option('verbose', verbose)
.argv
