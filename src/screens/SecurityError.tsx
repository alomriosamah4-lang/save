import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import NativeSecurity from '../native/SecurityModule';
import {useNavigation} from '@react-navigation/native';

const SecurityError: React.FC = () => {
  const navigation = useNavigation();

  const retry = async () => {
    try {
      const ok = await NativeSecurity.nativeSelfTest();
      if (ok) {
        // go to onboarding if native checks pass
        navigation.navigate('Onboarding' as any);
      }
    } catch (e) {
      // noop - remain on error screen
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>خطأ أمني</Text>
      <Text style={styles.msg}>فشل التحقق من مكونات التشفير الأصلية. يرجى إعادة المحاولة.</Text>
      <Button title="إعادة المحاولة" onPress={retry} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24},
  title: {fontSize: 22, fontWeight: '700', marginBottom: 12},
  msg: {fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center'},
});

export default SecurityError;
