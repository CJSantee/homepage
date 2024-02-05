import type {Config} from 'jest';

const config: Config = {
  verbose: true,
  testPathIgnorePatterns: ["/node_modules/", "/client/"],
};

export default config;