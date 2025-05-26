import Fastify from 'fastify';

const fastify = Fastify({ logger: true });

fastify.get('/', async () => {
  debugger;
  return { hello: 'postgres' };
});

const port = Number(process.env.PORT ?? 8080);

const start = async () => {
  try {
    await fastify.listen({ port, host: '0.0.0.0' });
  } catch (err: unknown) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
