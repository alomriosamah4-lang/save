import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import ErrorBoundary from './components/ErrorBoundary';
import SecurityError from './screens/SecurityError';
import NativeSecurity from './native/SecurityModule';

const App: React.FC = () => {
  const [checked, setChecked] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const result = await NativeSecurity.nativeSelfTest();
        if (mounted) {
          setOk(!!result);
        }
      } catch (e) {
        if (mounted) setOk(false);
      } finally {
        if (mounted) setChecked(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!checked) return null; // keep splash handled by native splash screen

  if (!ok) return <SecurityError />;

  return (
    <ErrorBoundary>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </ErrorBoundary>
  );
};

export default App;
