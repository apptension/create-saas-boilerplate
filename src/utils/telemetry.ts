import { DiagConsoleLogger, DiagLogLevel, diag } from '@opentelemetry/api';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { Resource } from '@opentelemetry/resources';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

import { SB_TELEMETRY_DEBUG, SB_TELEMETRY_KEY, SB_TELEMETRY_URL } from '../config';

if (SB_TELEMETRY_DEBUG) {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);
}

export const traceExporter = new OTLPTraceExporter({
  url: SB_TELEMETRY_URL,
  headers: {
    'x-honeycomb-team': SB_TELEMETRY_KEY,
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
