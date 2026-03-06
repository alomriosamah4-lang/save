import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from '../screens/Splash';
import Onboarding from '../screens/Onboarding';
import SecuritySetup from '../screens/SecuritySetup';
import VaultList from '../screens/VaultList';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  SecuritySetup: undefined;
  VaultList: undefined;
  SetupPin: undefined;
  SetupPassword: undefined;
  SetupPattern: undefined;
  SetupBiometric: {type?: string; vaultId?: string} | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Splash" component={Splash} />
    <Stack.Screen name="Onboarding" component={Onboarding} />
    <Stack.Screen name="SecuritySetup" component={SecuritySetup} />
    <Stack.Screen name="VaultList" component={VaultList} />
    <Stack.Screen name="SetupPin" component={require('../screens/SetupPin').default} />
    <Stack.Screen name="SetupPassword" component={require('../screens/SetupPassword').default} />
    <Stack.Screen name="SetupPattern" component={require('../screens/SetupPattern').default} />
    <Stack.Screen name="SetupBiometric" component={require('../screens/SetupBiometric').default} />
  </Stack.Navigator>
);

export default RootNavigator;
