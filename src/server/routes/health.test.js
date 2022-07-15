import request from 'supertest';
import createApp from '../app';
import setup from '../setup';

describe('/health', () => {

  describe('Request to /liveness', () => {
    let app;

    beforeEach(async () => {
      const conf = await setup();
      app = createApp(conf);
    });

    it('should return a 200 status code', async () => {
      await request(app)
        .get('/liveness')
        .expect(res => {
          expect(res.status).toEqual(200);
          expect(res.body).toEqual({
            status: 'UP',
          });
        });
    });
  });

  describe('Request to /readiness', () => {
    let app;

    beforeEach(async () => {
      const conf = await setup();
      app = createApp(conf);
    });

    it('should return a 200 status code', async () => {
      await request(app)
        .get('/readiness')
        .expect(res => {
          expect(res.status).toEqual(200);
          expect(res.body).toEqual({
            status: 'UP',
          });
        });
    });
  });

  describe('Request to /health', () => {
    let app;

    beforeEach(async () => {
      const conf = await setup();
      app = createApp(conf);
    });

    it('should return a 200 status code', async () => {
      await request(app)
        .get('/health')
        .expect(res => {
          expect(res.status).toEqual(200);
          expect(res.body).toEqual({
            status: 'UP',
          });
        });
    });
  });
});
