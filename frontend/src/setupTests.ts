import '@testing-library/jest-dom';
import 'whatwg-fetch'; // for fetch API in tests 
import { server } from '../tests/setup/mocks/server';

// Add TextEncoder polyfill
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock matchMedia for react-hot-toast
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close()); 