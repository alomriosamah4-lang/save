import {NativeModules} from 'react-native';

type CreateVaultResult = {vaultId: string};
type OpenVaultResult = {sessionToken: string};

const {SecurityModule} = NativeModules as {SecurityModule?: any};

function ensureModule(): any {
  if (!SecurityModule) throw new Error('Native SecurityModule not available');
  return SecurityModule;
}

const NativeSecurity = {
  nativeSelfTest(): Promise<boolean> {
    try {
      return ensureModule().nativeSelfTest();
    } catch (e) {
      return Promise.resolve(false);
    }
  },
  isDeviceSecure(): Promise<boolean> {
    try {
      return ensureModule().isDeviceSecure();
    } catch (e) {
      return Promise.resolve(false);
    }
  },
  createVault(name: string, password: string, options?: object): Promise<CreateVaultResult> {
    return ensureModule().createVault(name, password, options || {});
  },
  openVault(vaultId: string, passwordOrToken: string): Promise<OpenVaultResult> {
    return ensureModule().openVault(vaultId, passwordOrToken);
  },
  closeVault(sessionToken: string): Promise<void> {
    return ensureModule().closeVault(sessionToken);
  },
  enableBiometric(vaultId: string): Promise<boolean> {
    return ensureModule().enableBiometric(vaultId);
  },
};

export type {CreateVaultResult, OpenVaultResult};
export default NativeSecurity;
