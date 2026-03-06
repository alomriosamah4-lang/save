import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert, Switch} from 'react-native';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../styles/theme';
import NativeSecurity from '../native/SecurityModule';

const SetupPassword: React.FC = () => {
  const navigation = useNavigation();
  const [pwd, setPwd] = useState('');
  const [confirm, setConfirm] = useState('');

  const [loading, setLoading] = useState(false);
  const [useBiometric, setUseBiometric] = useState(false);

  const handleSave = async () => {
    if (pwd.length < 8) return Alert.alert('خطأ', 'كلمة المرور قصيرة جدًا.');
    if (pwd !== confirm) return Alert.alert('خطأ', 'كلمتا المرور غير متطابقتين.');
    setLoading(true);
    try {
      const res = await NativeSecurity.createVault('default', pwd, {useBiometric: useBiometric});
      const vaultId = res?.vaultId;
      if (useBiometric && vaultId) {
        try {
          await NativeSecurity.enableBiometric(vaultId);
        } catch (e: any) {
          Alert.alert('تنبيه', e?.message || 'تعذّر تفعيل المصادقة البيومترية');
        }
      }
      setLoading(false);
      (navigation as any).navigate('VaultList');
    } catch (err: any) {
      setLoading(false);
      Alert.alert('خطأ', err?.message || 'فشل إنشاء الخزنة');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>إنشاء كلمة مرور</Text>
      <TextField placeholder="أدخل كلمة المرور" value={pwd} onChangeText={setPwd} secureTextEntry />
      <TextField placeholder="تأكيد كلمة المرور" value={confirm} onChangeText={setConfirm} secureTextEntry />
      <PrimaryButton title="حفظ" onPress={handleSave} style={{marginTop: 12}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: Colors.dark.background},
  title: {fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 12},
  switchRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8},
  switchLabel: {color: 'rgba(255,255,255,0.9)'},
});

export default SetupPassword;
