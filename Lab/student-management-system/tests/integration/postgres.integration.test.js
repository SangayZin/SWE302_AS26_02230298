const { Client } = require('pg');
const { PostgreSqlContainer } = require('@testcontainers/postgresql');

describe('PostgreSQL Testcontainers', () => {
    let container;
    let client;

    beforeAll(async () => {
        container = await new PostgreSqlContainer('postgres:16')
            .start();

        client = new Client({
            host: container.getHost(),
            port: container.getPort(),
            database: container.getDatabase(),
            user: container.getUsername(),
            password: container.getPassword()
        });

        await client.connect();
    }, 120000);

    afterAll(async () => {
        if (client) {
            await client.end();
        }

        if (container) {
            await container.stop();
        }
    });

    test('should connect to PostgreSQL and execute a query', async () => {
        const result = await client.query('SELECT 1');

        expect(result.rows[0]).toEqual({
            '?column?': 1
        });
    });
});