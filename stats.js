#!/usr/bin/env node

const yargs = require('yargs')
const Stats = require('dog-statsy')

const verbose = { alias: 'V', default: false }
const required = [ 'agent', 'service', 'env' ]
const commands = [
  {
    name: 'gauge',
    description: 'Send gauge value',
    required: [ 'metric', 'value' ]
  },
  {
    name: 'meter',
    description: 'Send meter value',
    required: [ 'metric', 'value' ]
  },
  {
    name: 'set',
    description: 'Send set value',
    required: [ 'metric', 'value' ]
  },
  {
    name: 'count',
    description: 'Send count value',
    required: [ 'metric', 'value' ]
  },
  {
    name: 'incr',
    description: 'Increment by val or 1',
    required: [ 'metric' ]
  },
  {
    name: 'decr',
    description: 'Decrement by val or 1',
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
    log(`sending ${command.name} for ${argv.service} in ${argv.env} to ${argv.agent}...`)
    const [ddHost, ddPort] = (argv.agent).split(':');
    const stats = new Stats({
      host: ddHost,
      port: ddPort,
      prefix: argv.service,
      tags: [`env:${argv.env}`],
    });
    const params = [argv.metric]
    if (argv.value) params.push(argv.value)
    if (argv.tag) params.push(argv.tag)
    try {
      stats[command.name].apply(stats, params)
    } catch(e) {
      console.log('an error occured')
      console.log(e)
      process.exit(1)
    }
    log(`completed sending ${command.name} for ${argv.service} in ${argv.env} to ${argv.agent}.`)
    process.exit()
  })
}
yargs.option('agent')
.alias('a', 'agent')
.describe('a', 'the datadog agent url')
.option('service')
.alias('s', 'service')
.describe('s', 'the name of the service, normalized')
.option('env')
.alias('e', 'env')
.describe('e', 'the name of the environment')
.demandOption(required, `Please provide the ${required.join(' and ')} arguments to work with this command`)
.option('verbose', verbose)
.argv
