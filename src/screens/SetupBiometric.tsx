import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Colors} from '../styles/theme';
import NativeSecurity from '../native/SecurityModule';

const SetupBiometric: React.FC = () => {
  const navigation = useNavigation();
  const route: any = useRoute();
  const type = route.params?.type || 'fingerprint';
  const vaultId = route.params?.vaultId as string | undefined;
  const [loading, setLoading] = useState(false);

  const handleEnable = async () => {
    try {
      setLoading(true);
      const secure = await NativeSecurity.isDeviceSecure();
      if (!secure) {
        setLoading(false);
        return Alert.alert('غير متاح', 'الميزة غير مدعومة على هذا الجهاز.');
      }
      // In a real flow we would enable on an existing vault; here we call enableBiometric on a default vault if exists.
      // For now, call enableBiometric and handle errors.
      await NativeSecurity.enableBiometric(vaultId || 'default');
      setLoading(false);
      Alert.alert('تم', 'تم تفعيل المصادقة البيومترية');
      (navigation as any).navigate('VaultList');
    } catch (err: any) {
      setLoading(false);
      Alert.alert('خطأ', err?.message || 'فشل تفعيل المصادقة البيومترية');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تفعيل {type === 'face' ? 'بصمة الوجه' : 'بصمة الإصبع'}</Text>
      <Text style={styles.desc}>سنستخدم بيانات الجهاز للتعرف البيومتري. يمكنك استخدام PIN كبديل.</Text>
      <PrimaryButton title="تفعيل" onPress={handleEnable} style={{marginTop: 12}} loading={loading} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: Colors.dark.background},
  title: {fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 12},
  desc: {color: 'rgba(255,255,255,0.8)'},
});

export default SetupBiometric;
