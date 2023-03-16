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
@apptension/saas-boilerplate-cli/0.0.0 darwin-x64 node-v16.15.1
$ @apptension/saas-boilerplate-cli --help [COMMAND]
USAGE
  $ @apptension/saas-boilerplate-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`@apptension/saas-boilerplate-cli hello PERSON`](#apptensionsaas-boilerplate-cli-hello-person)
* [`@apptension/saas-boilerplate-cli hello world`](#apptensionsaas-boilerplate-cli-hello-world)
* [`@apptension/saas-boilerplate-cli help [COMMANDS]`](#apptensionsaas-boilerplate-cli-help-commands)
* [`@apptension/saas-boilerplate-cli plugins`](#apptensionsaas-boilerplate-cli-plugins)
* [`@apptension/saas-boilerplate-cli plugins:install PLUGIN...`](#apptensionsaas-boilerplate-cli-pluginsinstall-plugin)
* [`@apptension/saas-boilerplate-cli plugins:inspect PLUGIN...`](#apptensionsaas-boilerplate-cli-pluginsinspect-plugin)
* [`@apptension/saas-boilerplate-cli plugins:install PLUGIN...`](#apptensionsaas-boilerplate-cli-pluginsinstall-plugin-1)
* [`@apptension/saas-boilerplate-cli plugins:link PLUGIN`](#apptensionsaas-boilerplate-cli-pluginslink-plugin)
* [`@apptension/saas-boilerplate-cli plugins:uninstall PLUGIN...`](#apptensionsaas-boilerplate-cli-pluginsuninstall-plugin)
* [`@apptension/saas-boilerplate-cli plugins:uninstall PLUGIN...`](#apptensionsaas-boilerplate-cli-pluginsuninstall-plugin-1)
* [`@apptension/saas-boilerplate-cli plugins:uninstall PLUGIN...`](#apptensionsaas-boilerplate-cli-pluginsuninstall-plugin-2)
* [`@apptension/saas-boilerplate-cli plugins update`](#apptensionsaas-boilerplate-cli-plugins-update)

## `@apptension/saas-boilerplate-cli hello PERSON`

Say hello

```
USAGE
  $ @apptension/saas-boilerplate-cli hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/apptension/saas-boilerplate-cli/blob/v0.0.0/dist/commands/hello/index.ts)_

## `@apptension/saas-boilerplate-cli hello world`

Say hello world

```
USAGE
  $ @apptension/saas-boilerplate-cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ @apptension/saas-boilerplate-cli hello world
  hello world! (./src/commands/hello/world.ts)
```

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

## `@apptension/saas-boilerplate-cli plugins`

List installed plugins.

```
USAGE
  $ @apptension/saas-boilerplate-cli plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ @apptension/saas-boilerplate-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.4.0/src/commands/plugins/index.ts)_

## `@apptension/saas-boilerplate-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ @apptension/saas-boilerplate-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ @apptension/saas-boilerplate-cli plugins add

EXAMPLES
  $ @apptension/saas-boilerplate-cli plugins:install myplugin 

  $ @apptension/saas-boilerplate-cli plugins:install https://github.com/someuser/someplugin

  $ @apptension/saas-boilerplate-cli plugins:install someuser/someplugin
```

## `@apptension/saas-boilerplate-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ @apptension/saas-boilerplate-cli plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ @apptension/saas-boilerplate-cli plugins:inspect myplugin
```

## `@apptension/saas-boilerplate-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ @apptension/saas-boilerplate-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ @apptension/saas-boilerplate-cli plugins add

EXAMPLES
  $ @apptension/saas-boilerplate-cli plugins:install myplugin 

  $ @apptension/saas-boilerplate-cli plugins:install https://github.com/someuser/someplugin

  $ @apptension/saas-boilerplate-cli plugins:install someuser/someplugin
```

## `@apptension/saas-boilerplate-cli plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ @apptension/saas-boilerplate-cli plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ @apptension/saas-boilerplate-cli plugins:link myplugin
```

## `@apptension/saas-boilerplate-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ @apptension/saas-boilerplate-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ @apptension/saas-boilerplate-cli plugins unlink
  $ @apptension/saas-boilerplate-cli plugins remove
```

## `@apptension/saas-boilerplate-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ @apptension/saas-boilerplate-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ @apptension/saas-boilerplate-cli plugins unlink
  $ @apptension/saas-boilerplate-cli plugins remove
```

## `@apptension/saas-boilerplate-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ @apptension/saas-boilerplate-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ @apptension/saas-boilerplate-cli plugins unlink
  $ @apptension/saas-boilerplate-cli plugins remove
```

## `@apptension/saas-boilerplate-cli plugins update`

Update installed plugins.

```
USAGE
  $ @apptension/saas-boilerplate-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
