const myTest = () => { return 'test'};

test('test', () => {
  expect(myTest()).toBe('test');
});


