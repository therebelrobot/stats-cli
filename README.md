# stats-cli
A command line utility to send data events into a datadog agent. Powered by [dog-statsy](https://github.com/segmentio/dog-statsy)

## installation

```
npm install -g @therebel/stats-cli
```

## Usage

```
$ stats --help                                                                          
Commands:
  gauge      Send gauge value
  count      Send count value
  increment  Increment by val or 1
  histogram  Send histogram value

Options:
  --help         Show help                                             [boolean]
  --version      Show version number                                   [boolean]
  -h, --host     the hostname reported with each metric               [required]
  -s, --service  the name of the service, normalized                  [required]
  -e, --env      the name of the environment                          [required]
  -k, --key      your datadog api key
  --verbose, -V                                                 [default: false]
```

Additional Options:
```
  -m, --metric   normalized metric name to register within datadog    [required]
  -v, --value    amount to send                                       [required (except for incr and decr)]
  -t, --tag      tag to list with it, multiples allowed
```
