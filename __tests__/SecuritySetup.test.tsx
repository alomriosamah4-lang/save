import React from 'react';
import renderer from 'react-test-renderer';
import SecuritySetup from '../src/screens/SecuritySetup';

// Mock navigation used by the component
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

test('SecuritySetup renders correctly', () => {
  const tree = renderer.create(<SecuritySetup />).toJSON();
  expect(tree).toMatchSnapshot();
});
