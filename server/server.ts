import { Application } from 'jsr:@oak/oak/application';
import { oakCors } from 'cors';
import router from './rest/router.ts';

/**
 * Initialize API server
 */

const app = new Application();
app.use(router.allowedMethods());
app.use(oakCors({
  origin: 'http://localhost:3000',
}));

app.use(router.routes());

// app.listen({
app.listen({
  port: 4000,
  onListen({ port, hostname }) {
    console.log(`🍉 API server started on http://${hostname}:${port}`);
  },
});
