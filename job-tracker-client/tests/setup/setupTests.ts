import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { server } from './mocks/server';

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
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close()); 