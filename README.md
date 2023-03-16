oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @apptension/saas-boilerplate-cli
$ @apptension/saas-boilerplate-cli COMMAND
running command...
$ @apptension/saas-boilerplate-cli (--version)
@apptension/saas-boilerplate-cli/0.0.0 darwin-x64 node-v18.4.0
$ @apptension/saas-boilerplate-cli --help [COMMAND]
USAGE
  $ @apptension/saas-boilerplate-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`@apptension/saas-boilerplate-cli help [COMMANDS]`](#apptensionsaas-boilerplate-cli-help-commands)
* [`@apptension/saas-boilerplate-cli init PATH`](#apptensionsaas-boilerplate-cli-init-path)

## `@apptension/saas-boilerplate-cli help [COMMANDS]`

Display help for @apptension/saas-boilerplate-cli.

```
USAGE
  $ @apptension/saas-boilerplate-cli help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for @apptension/saas-boilerplate-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.7/src/commands/help.ts)_

## `@apptension/saas-boilerplate-cli init PATH`

Initialize new SaaS Boilerplate by Apptension project

```
USAGE
  $ @apptension/saas-boilerplate-cli init PATH

ARGUMENTS
  PATH  Directory name where to initialize project

DESCRIPTION
  Initialize new SaaS Boilerplate by Apptension project

EXAMPLES
  $ @apptension/saas-boilerplate-cli init
```

_See code: [dist/commands/init/index.ts](https://github.com/apptension/saas-boilerplate-cli/blob/v0.0.0/dist/commands/init/index.ts)_
<!-- commandsstop -->
