import { DiagConsoleLogger, DiagLogLevel, diag } from '@opentelemetry/api';
import { Resource } from '@opentelemetry/resources';
import { ConsoleSpanExporter, NodeTracerProvider, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);

export const provider = new NodeTracerProvider({
  resource: Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'create-saas-boilerplate',
    })
  ),
});

provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
