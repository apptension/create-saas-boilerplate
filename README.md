Create SaaS Boilerplate
=================

[![Version](https://img.shields.io/npm/v/create-saas-boilerplate.svg?style=for-the-badge&logo=npm)](https://npmjs.org/package/create-saas-boilerplate)
[![Downloads/week](https://img.shields.io/npm/dw/create-saas-boilerplate.svg?style=for-the-badge)](https://npmjs.org/package/create-saas-boilerplate)
[![License](https://img.shields.io/npm/l/create-saas-boilerplate.svg?style=for-the-badge)](https://github.com/apptension/create-saas-boilerplate/blob/master/package.json)

Create SaaS Boilerplate is a CLI tool designed to quickly set up a new local instance of the SaaS Boilerplate. It is a specialized tool that allows users to get started with the SaaS Boilerplate as quickly as possible. 

---

📖 [**SaaS Boilerplate Documentation**](https://docs.demo.saas.apptoku.com/)

🌟 [**SaaS Boilerplate Page**](https://www.apptension.com/saas-boilerplate)

---

## Initialize new SaaS Boilerplate project

```
USAGE
  $ yarn create saas-boilerplate PATH [--skipSystemCheck]
  $ pnpm create saas-boilerplate PATH [--skipSystemCheck]
  $ npm init saas-boilerplate PATH [--skipSystemCheck]
ARGUMENTS
  PATH  [default: .] Directory name where to initialize project
FLAGS
  --skipSystemCheck  Skip system check
DESCRIPTION
  Initialize new SaaS Boilerplate project
```
_See code: [dist/commands/init/index.ts](https://github.com/apptension/create-saas-boilerplate/blob/v0.0.1/dist/commands/init/index.ts)_

## Usage

The usage for Create SaaS Boilerplate starts with installing the tool globally using npm. Once the tool is installed, it can be used by running the command `create-saas-boilerplate` followed by a specific command or flag. This will run the specified command and perform the necessary actions.
- If the `--version` flag is used, the tool will display the version number for the Create SaaS Boilerplate, along with information about the platform it is running on.
- If the `--help` flag is used, the tool will display general usage information along with a list of available commands.

<!-- usage -->
```sh-session
$ npm install -g create-saas-boilerplate
$ create-saas-boilerplate COMMAND
running command...
$ create-saas-boilerplate (--version)
create-saas-boilerplate/0.0.1 darwin-x64 node-v18.4.0
$ create-saas-boilerplate --help [COMMAND]
USAGE
  $ create-saas-boilerplate COMMAND
...
```
<!-- usagestop -->

## Commands
<!-- commands -->
* [`create-saas-boilerplate help [COMMANDS]`](#create-saas-boilerplate-help-commands)
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
