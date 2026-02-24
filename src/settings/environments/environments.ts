import * as dotenv from 'dotenv';
import * as Joi from 'joi';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

interface EnvironmentsVariables {
  NODE_ENV: 'development' | 'production' | 'test' | 'provision';
  DATABASE_PORT: number;
  DATABASE_HOST: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_NAME: string;
  DEBUG: boolean;
  ALLOWED_HOSTS: string;
  SECRET_KEY: string;
  KAFKA_BROKER_URL: string;
  KAFKA_TOPIC: string;
  AUTHENTICATION_KAFKA_CLIENT_ID: string;
  AUTHENTICATION_KAFKA_GROUP_ID: string;
  AUTHENTICATION_KAFKA_CLIENT: string;
  KAFKA_BROKER_INTERNAL: string;
  KAFKA_BROKER_EXTERNAL: string;
  // Roles Kafka Clients
  ROLES_KAFKA_CLIENT_ID: string;
  ROLES_KAFKA_CLIENT: string;
  ROLES_KAFKA_GROUP_ID: string;
  // JWT Settings
  JWT_SECRET: string;
  JWT_ACCESS_EXPIRATION: string;
  JWT_REFRESH_EXPIRATION: string;
}

const environmentsSchema = Joi.object<EnvironmentsVariables>({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .required(),
  DATABASE_PORT: Joi.number().default(5432),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DEBUG: Joi.boolean().default(false),
  ALLOWED_HOSTS: Joi.string().required(),
  SECRET_KEY: Joi.string().required(),
  KAFKA_BROKER_URL: Joi.string().required(),
  KAFKA_TOPIC: Joi.string().required(),
  AUTHENTICATION_KAFKA_CLIENT_ID: Joi.string().required(),
  AUTHENTICATION_KAFKA_GROUP_ID: Joi.string().required(),
  AUTHENTICATION_KAFKA_CLIENT: Joi.string().required(),
  KAFKA_BROKER_INTERNAL: Joi.string().required(),
  KAFKA_BROKER_EXTERNAL: Joi.string().required(),
  // Roles Kafka Clients
  ROLES_KAFKA_CLIENT_ID: Joi.string().required(),
  ROLES_KAFKA_CLIENT: Joi.string().required(),
  ROLES_KAFKA_GROUP_ID: Joi.string().required(),
  // JWT Settings
  JWT_SECRET: Joi.string().required(),
  JWT_ACCESS_EXPIRATION: Joi.string().required(),
  JWT_REFRESH_EXPIRATION: Joi.string().required(),
}).unknown(true);

const { error, value: envVars } = environmentsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const environments: EnvironmentsVariables = {
  NODE_ENV: envVars.NODE_ENV,
  DATABASE_PORT: Number(envVars.DATABASE_PORT),
  DATABASE_HOST: envVars.DATABASE_HOST,
  DATABASE_USER: envVars.DATABASE_USER,
  DATABASE_PASSWORD: envVars.DATABASE_PASSWORD,
  DATABASE_NAME: envVars.DATABASE_NAME,
  DEBUG: envVars.DEBUG === true,
  ALLOWED_HOSTS: envVars.ALLOWED_HOSTS,
  SECRET_KEY: envVars.SECRET_KEY,
  KAFKA_BROKER_URL:
    envVars.KAFKA_BROKER_INTERNAL || envVars.KAFKA_BROKER_EXTERNAL,
  KAFKA_TOPIC: envVars.KAFKA_TOPIC,
  AUTHENTICATION_KAFKA_CLIENT_ID: envVars.AUTHENTICATION_KAFKA_CLIENT_ID,
  AUTHENTICATION_KAFKA_GROUP_ID: envVars.AUTHENTICATION_KAFKA_GROUP_ID,
  AUTHENTICATION_KAFKA_CLIENT: envVars.AUTHENTICATION_KAFKA_CLIENT,
  KAFKA_BROKER_EXTERNAL: envVars.KAFKA_BROKER_EXTERNAL,
  KAFKA_BROKER_INTERNAL: envVars.KAFKA_BROKER_INTERNAL,
  // Roles Kafka Clients
  ROLES_KAFKA_CLIENT_ID: envVars.ROLES_KAFKA_CLIENT_ID,
  ROLES_KAFKA_CLIENT: envVars.ROLES_KAFKA_CLIENT,
  ROLES_KAFKA_GROUP_ID: envVars.ROLES_KAFKA_GROUP_ID,
  // JWT Settings
  JWT_SECRET: envVars.JWT_SECRET,
  JWT_ACCESS_EXPIRATION: envVars.JWT_ACCESS_EXPIRATION,
  JWT_REFRESH_EXPIRATION: envVars.JWT_REFRESH_EXPIRATION,
};
