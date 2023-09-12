import { Command } from '@oclif/core';
import { ExitError } from '@oclif/core/lib/errors';
import { Span, SpanStatusCode, Tracer, trace } from '@opentelemetry/api';

import './utils/telemetry';

const formatAttrs = (obj: { [k: string]: string } = {}, prefix = '') => {
  return Object.fromEntries(
    Object.keys(obj).map((key: string) => {
      return [[prefix, key].join('.'), obj[key]];
    })
  );
};

export abstract class BaseCommand extends Command {
  protected tracer: Tracer | null = null;
  protected span: Span | null = null;

  public async init(): Promise<void> {
    await super.init();
    const { args, flags } = await this.parse({
      flags: this.ctor.flags,
      baseFlags: (super.ctor as typeof BaseCommand).baseFlags,
      args: this.ctor.args,
      strict: this.ctor.strict,
    });
    this.tracer = trace.getTracer('create-saas-boilerplate', this.config.version);

    this.span = this.tracer.startSpan(`command.${this.ctor.id}`, {
      attributes: {
        ...formatAttrs(flags, 'flags'),
        ...formatAttrs(args, 'args'),
      },
    });
  }

  protected async catch(err: (Error & { exitCode?: number }) | ExitError): Promise<any> {
    if (!(err instanceof ExitError) || err.oclif.exit !== 0) {
      this.span?.recordException(err);
      this.span?.setStatus({ code: SpanStatusCode.ERROR });
    }

    return super.catch(err);
  }

  protected async finally(_: Error | undefined): Promise<any> {
    this.span?.addEvent('Command finished');
    this.span?.end();

    return super.finally(_);
  }
}
