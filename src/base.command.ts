import { Command, Flags, Interfaces } from '@oclif/core';
import { ExitError } from '@oclif/core/lib/errors';
import { Span, SpanStatusCode, Tracer, trace } from '@opentelemetry/api';

import { SB_TELEMETRY_DISABLED } from './config';
import { traceExporter } from './utils/telemetry';

const formatAttrs = (obj: { [k: string]: string } = {}, prefix = '') => {
  return Object.fromEntries(
    Object.keys(obj).map((key: string) => {
      return [[prefix, key].join('.'), obj[key]];
    })
  );
};

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<(typeof BaseCommand)['baseFlags'] & T['flags']>;
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>;

export abstract class BaseCommand<T extends typeof Command> extends Command {
  protected tracer: Tracer | null = null;
  protected span: Span | null = null;

  protected flags!: Flags<T>;
  protected args!: Args<T>;

  public async init(): Promise<void> {
    await super.init();
    const { args, flags } = await this.parse({
      flags: this.ctor.flags,
      baseFlags: (super.ctor as typeof BaseCommand).baseFlags,
      args: this.ctor.args,
      strict: this.ctor.strict,
    });
    this.flags = flags as Flags<T>;
    this.args = args as Args<T>;

    if (!SB_TELEMETRY_DISABLED) {
      this.printTelemetryInfo();
      this.tracer = trace.getTracer('create-saas-boilerplate', this.config.version);
    }
  }

  async _run<T>() {
    let err;
    let result;
    try {
      // remove redirected env var to allow subsessions to run autoupdated client
      delete process.env[this.config.scopedEnvVarKey('REDIRECTED')];
      await this.init();

      result = await (!SB_TELEMETRY_DISABLED && this.tracer
        ? this.tracer.startActiveSpan(
            `command.${this.ctor.id}`,
            {
              attributes: {
                ...formatAttrs(this.flags, 'flags'),
                ...formatAttrs(this.args, 'args'),
              },
            },
            async (span) => {
              this.span = span;

              return this.run();
            }
          )
        : this.run());
    } catch (error: any) {
      err = error;
      await this.catch(error);
    } finally {
      await this.finally(err);
    }

    if (result && this.jsonEnabled()) this.logJson(this.toSuccessJson(result));
    return result;
  }

  protected async catch(err: Error & { exitCode?: number }): Promise<any> {
    if (!(err instanceof ExitError) || err.oclif.exit !== 0) {
      this.span?.addEvent('Command error');
      this.span?.recordException(err);
      this.span?.setStatus({ code: SpanStatusCode.ERROR });
    }

    return super.catch(err);
  }

  protected async finally(_: Error | undefined): Promise<any> {
    if (!SB_TELEMETRY_DISABLED) {
      this.span?.addEvent('Command finished');
      this.span?.end();

      // Need to wait en event loop for the internal promise in exporter to be visible
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        });
      });
      // wait for the exporter to send data
      await traceExporter.forceFlush();
    }

    return super.finally(_);
  }

  protected printTelemetryInfo(): void {
    this.log(`\u001B[2m
------ Notice ------
This CLI collects various anonymous events, warnings, and errors to improve the CLI tool and enhance your user experience.
Read more: https://docs.demo.saas.apptoku.com/working-with-sb/dev-tools/telemetry
If you want to opt out of telemetry, you can set the environment variable SB_TELEMETRY_DISABLED to 1 in your shell.
For example:
   export SB_TELEMETRY_DISABLED=1
    \u001B[0m`);
  }
}
