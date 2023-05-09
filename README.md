Create SaaS Boilerplate
=================

[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg?style=for-the-badge&logo=npm)](https://npmjs.org/package/oclif-hello-world)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg?style=for-the-badge)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg?style=for-the-badge)](https://github.com/apptension/saas-boilerplate-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g create-saas-boilerplate
$ create-saas-boilerplate COMMAND
running command...
$ create-saas-boilerplate (--version)
create-saas-boilerplate/0.0.0 darwin-x64 node-v18.4.0
$ create-saas-boilerplate --help [COMMAND]
USAGE
  $ create-saas-boilerplate COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`create-saas-boilerplate help [COMMANDS]`](#create-saas-boilerplate-help-commands)
* [`create-saas-boilerplate init PATH`](#create-saas-boilerplate-init-path)
* [`create-saas-boilerplate version`](#create-saas-boilerplate-version)

## `create-saas-boilerplate help [COMMANDS]`

Display help for create-saas-boilerplate.

```
USAGE
  $ create-saas-boilerplate help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for create-saas-boilerplate.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.7/src/commands/help.ts)_

## `create-saas-boilerplate init PATH`

Initialize new SaaS Boilerplate by Apptension project

```
USAGE
  $ create-saas-boilerplate init PATH [--skipSystemCheck]

ARGUMENTS
  PATH  Directory name where to initialize project

FLAGS
  --skipSystemCheck  Skip system check

DESCRIPTION
  Initialize new SaaS Boilerplate by Apptension project

EXAMPLES
  $ create-saas-boilerplate init
```

_See code: [dist/commands/init/index.ts](https://github.com/apptension/create-saas-boilerplate/blob/v0.0.0/dist/commands/init/index.ts)_

## `create-saas-boilerplate version`

```
USAGE
  $ create-saas-boilerplate version [--json] [--verbose]

FLAGS
  --verbose  Show additional information about the CLI.

GLOBAL FLAGS
  --json  Format output as json.

FLAG DESCRIPTIONS
  --verbose  Show additional information about the CLI.

    Additionally shows the architecture, node version, operating system, and versions of plugins that the CLI is using.
```

_See code: [@oclif/plugin-version](https://github.com/oclif/plugin-version/blob/v1.3.4/src/commands/version.ts)_
<!-- commandsstop -->
