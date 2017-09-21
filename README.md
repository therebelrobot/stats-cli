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
  meter      Send meter value
  set        Send set value
  count      Send count value
  incr       Increment by val or 1
  decr       Decrement by val or 1
  histogram  Send histogram value

Options:
  --help         Show help                                             [boolean]
  --version      Show version number                                   [boolean]
  -a, --agent    the datadog agent url                                [required]
  -s, --service  the name of the service, normalized                  [required]
  -e, --env      the name of the environment                          [required]
  --verbose, -V                                                 [default: false]
```

Additional Options:
```
  -m, --metric   normalized metric name to register within datadog    [required]
  -v, --value    amount to send                                       [required (except for incr and decr)]
  -t, --tag      tag to list with it, multiples allowed
```
