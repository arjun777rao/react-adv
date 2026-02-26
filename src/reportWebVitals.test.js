import reportWebVitals from './reportWebVitals';

describe('reportWebVitals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should do nothing when onPerfEntry is not provided', () => {
    expect(() => reportWebVitals()).not.toThrow();
  });

  test('should do nothing when onPerfEntry is null', () => {
    expect(() => reportWebVitals(null)).not.toThrow();
  });

  test('should do nothing when onPerfEntry is undefined', () => {
    expect(() => reportWebVitals(undefined)).not.toThrow();
  });

  test('should do nothing when onPerfEntry is not a function', () => {
    expect(() => reportWebVitals('not a function')).not.toThrow();
    expect(() => reportWebVitals({})).not.toThrow();
    expect(() => reportWebVitals(123)).not.toThrow();
    expect(() => reportWebVitals([])).not.toThrow();
  });

  test('should accept a callback function and attempt to load web-vitals', async () => {
    const mockCallback = jest.fn();
    
    // Mock web-vitals module before calling reportWebVitals
    jest.mock('web-vitals', () => ({
      getCLS: jest.fn(),
      getFID: jest.fn(),
      getFCP: jest.fn(),
      getLCP: jest.fn(),
      getTTFB: jest.fn(),
    }), { virtual: true });
    
    expect(() => reportWebVitals(mockCallback)).not.toThrow();
  });

  test('should be a function', () => {
    expect(typeof reportWebVitals).toBe('function');
  });

  test('should handle arrow function callback', () => {
    const callback = () => console.log('metric');
    expect(() => reportWebVitals(callback)).not.toThrow();
  });

  test('should handle regular function callback', () => {
    const callback = function(metric) { console.log(metric); };
    expect(() => reportWebVitals(callback)).not.toThrow();
  });

  test('should handle Function constructor', () => {
    const callback = new Function('metric', 'console.log(metric)');
    expect(() => reportWebVitals(callback)).not.toThrow();
  });

  test('should not throw with class constructor', () => {
    class MyCallable {
      constructor() {}
    }
    const callback = MyCallable;
    expect(() => reportWebVitals(callback)).not.toThrow();
  });

  test('should handle complex objects that are not functions', () => {
    expect(() => reportWebVitals({ call: () => {} })).not.toThrow();
    expect(() => reportWebVitals({ apply: () => {} })).not.toThrow();
  });
});

