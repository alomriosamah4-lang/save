import React from 'react';
import renderer from 'react-test-renderer';
import PrimaryButton from '../src/components/PrimaryButton';

test('PrimaryButton renders correctly', () => {
  const tree = renderer.create(<PrimaryButton title="Test" />).toJSON();
  expect(tree).toMatchSnapshot();
});
