import store from './store';

describe('Redux Store', () => {
  test('store should be defined', () => {
    expect(store).toBeDefined();
  });

  test('store should have users reducer', () => {
    const state = store.getState();
    expect(state.users).toBeDefined();
  });

  test('store should have initial users state', () => {
    const state = store.getState();
    expect(state.users).toEqual({
      list: [],
      status: 'idle',
      error: null,
    });
  });

  test('store should have dispatch method', () => {
    expect(store.dispatch).toBeDefined();
    expect(typeof store.dispatch).toBe('function');
  });

  test('store should have getState method', () => {
    expect(store.getState).toBeDefined();
    expect(typeof store.getState).toBe('function');
  });

  test('store should have subscribe method', () => {
    expect(store.subscribe).toBeDefined();
    expect(typeof store.subscribe).toBe('function');
  });
});
