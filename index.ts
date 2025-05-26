import { PrismaClient } from '@prisma/client';
import Fastify from 'fastify';

const db = new PrismaClient();
const fastify = Fastify({ logger: true });

fastify.get('/', async () => {
  const posts = await db.post.findMany({ where: { published: true } });
  return { hello: 'postgres', posts };
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
