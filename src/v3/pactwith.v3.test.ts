import { MatchersV3, V3MockServer } from '@pact-foundation/pact';
import { agent } from 'supertest';
import { pactWith } from './index';

const getClient = (mock: V3MockServer) => agent(mock.url);

pactWith(
  { consumer: 'MyConsumer', provider: 'pactWith v3', logLevel: 'debug' },
  (interaction) => {
    interaction('pact integration', ({ provider, execute }) => {
      beforeEach(() =>
        provider
          .given('A pet 1845563262948980200 exists')
          .uponReceiving('A get request to get a pet 1845563262948980200')
          .withRequest({
            method: 'GET',
            path: '/v2/pet/1845563262948980200',
            headers: { api_key: '[]' },
          })
          .willRespondWith({
            status: 200,
            // Hypothetical response from an API
            // body: {
            //   options: {
            //     'DEFAULT': {
            //       value: MatchersV3.integer(12),
            //       selected: MatchersV3.boolean(false)
            //     },
            //     'SUPER': {
            //       value: MatchersV3.integer(120),
            //       selected: MatchersV3.boolean(true)
            //     },
            //     'LUXERY': {
            //       value: MatchersV3.integer(12000),
            //       selected: MatchersV3.boolean(false)
            //     }
            //   }
            // }

            // Pact for this API
            body: {
              options: MatchersV3.eachKeyLike('SUPER', {
                value: MatchersV3.integer(120),
                selected: MatchersV3.boolean(true),
              }),
              optionArray: MatchersV3.eachLike({
                value: MatchersV3.integer(120),
                selected: MatchersV3.boolean(true),
              }),
            },
          })
      );

      execute('A pact test that returns 200', (mock) =>
        getClient(mock)
          .get('/v2/pet/1845563262948980200')
          .set('api_key', '[]')
          .expect(200)
      );
    });

    interaction('another pact integration', ({ provider, execute }) => {
      beforeEach(() =>
        provider
          .given('No pets exist')
          .uponReceiving('A get request to get a pet 1845563262948980200')
          .withRequest({
            method: 'GET',
            path: '/v2/pet/1845563262948980200',
            headers: { api_key: '[]' },
          })
          .willRespondWith({
            status: 404,
          })
      );

      execute('A pact test that returns 404', (mock) =>
        getClient(mock)
          .get('/v2/pet/1845563262948980200')
          .set('api_key', '[]')
          .expect(404)
      );
    });
  }
);
