import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// Also provide CommonJS export for setupTests.js
module.exports = { server };