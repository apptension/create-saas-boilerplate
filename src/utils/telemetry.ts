import telemetryConfig from '@apptension/saas-boilerplate-telemetry';
import { DiagConsoleLogger, DiagLogLevel, diag } from '@opentelemetry/api';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { Resource } from '@opentelemetry/resources';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

import { SB_TELEMETRY_DEBUG } from '../config';

const [telemetryUrl, telemetryKey] = telemetryConfig;

if (SB_TELEMETRY_DEBUG) {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);
}

export const traceExporter = new OTLPTraceExporter({
  url: telemetryUrl,
  headers: {
    'x-honeycomb-team': telemetryKey,
  },
});

export const provider = new NodeTracerProvider({
  resource: Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'create-saas-boilerplate',
    })
  ),
});

provider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));
