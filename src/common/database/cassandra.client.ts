import { Client } from 'cassandra-driver';
import { Provider } from '@nestjs/common';
import { loadEnv } from '../config/env';

export const CASSANDRA_CLIENT = 'CASSANDRA_CLIENT';

export type CassandraClient = Client;

export const cassandraClientProvider: Provider = {
  provide: CASSANDRA_CLIENT,
  useFactory: (): CassandraClient => {
    const env = loadEnv();
    const contactPoints = env.CASSANDRA_CONTACT_POINTS.split(',').map((s) => s.trim());
    const client = new Client({
      contactPoints,
      localDataCenter: env.CASSANDRA_LOCAL_DATACENTER,
      protocolOptions: { port: parseInt(env.CASSANDRA_PORT, 10) },
      keyspace: env.CASSANDRA_KEYSPACE,
    });
    return client;
  },
};
