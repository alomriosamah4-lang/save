// Web stub for SecurityModule - used when running via react-native-web
import type {CreateVaultResult, OpenVaultResult} from './SecurityModule';

const WebSecurity = {
  nativeSelfTest(): Promise<boolean> {
    return Promise.resolve(true);
  },
  isDeviceSecure(): Promise<boolean> {
    return Promise.resolve(false);
  },
  createVault(name: string, password: string, options?: object): Promise<CreateVaultResult> {
    return Promise.resolve({vaultId: `web-${Date.now()}`});
  },
  openVault(vaultId: string, passwordOrToken: string): Promise<OpenVaultResult> {
    return Promise.resolve({sessionToken: `session-${vaultId}`});
  },
  closeVault(sessionToken: string): Promise<void> {
    return Promise.resolve();
  },
  enableBiometric(vaultId: string): Promise<boolean> {
    return Promise.resolve(false);
  },
};

export default WebSecurity;
