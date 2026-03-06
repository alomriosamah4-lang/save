import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import * as RN from 'react-native';

// Navigation mock
const navigateMock = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({navigate: navigateMock}),
}));

// Mock native SecurityModule wrapper
const createVaultMock = jest.fn();
const enableBiometricMock = jest.fn();
const isDeviceSecureMock = jest.fn();

jest.mock('../src/native/SecurityModule', () => ({
  __esModule: true,
  default: {
    createVault: (...args: any[]) => createVaultMock(...args),
    enableBiometric: (...args: any[]) => enableBiometricMock(...args),
    isDeviceSecure: (...args: any[]) => isDeviceSecureMock(...args),
  },
}));

// Prevent native Alert from failing tests
jest.spyOn(RN.Alert, 'alert').mockImplementation(() => {});

import SetupPin from '../src/screens/SetupPin';
import SetupPassword from '../src/screens/SetupPassword';

describe('Setup flows', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates vault and enables biometric when toggled (SetupPin)', async () => {
    createVaultMock.mockResolvedValueOnce({vaultId: 'vault123'});
    enableBiometricMock.mockResolvedValueOnce(true);

    const {getByPlaceholderText, getByText, getByRole} = render(<SetupPin />);

    const pinInput = getByPlaceholderText('أدخل رمز PIN');
    const confirmInput = getByPlaceholderText('تأكيد رمز PIN');
    const saveButton = getByText('حفظ');

    fireEvent.changeText(pinInput, '1234');
    fireEvent.changeText(confirmInput, '1234');

    // toggle biometric switch: find the switch by role and trigger onValueChange
    const switches = getByRole('switch');
    fireEvent(switches, 'onValueChange', true);

    fireEvent.press(saveButton);

    await waitFor(() => expect(createVaultMock).toHaveBeenCalledWith('default', '1234', {useBiometric: true}));
    await waitFor(() => expect(enableBiometricMock).toHaveBeenCalledWith('vault123'));
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('VaultList'));
  });

  it('shows error when createVault fails (SetupPassword)', async () => {
    createVaultMock.mockRejectedValueOnce(new Error('create failed'));

    const {getByPlaceholderText, getByText} = render(<SetupPassword />);
    const pwdInput = getByPlaceholderText('أدخل كلمة المرور');
    const confirmInput = getByPlaceholderText('تأكيد كلمة المرور');
    const saveButton = getByText('حفظ');

    fireEvent.changeText(pwdInput, 'strongpassword');
    fireEvent.changeText(confirmInput, 'strongpassword');
    fireEvent.press(saveButton);

    await waitFor(() => expect(createVaultMock).toHaveBeenCalled());
    await waitFor(() => expect(navigateMock).not.toHaveBeenCalled());
  });
});
