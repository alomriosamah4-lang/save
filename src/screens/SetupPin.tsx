import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert, Switch} from 'react-native';
import TextField from '../components/TextField';
import PrimaryButton from '../components/PrimaryButton';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../styles/theme';
import NativeSecurity from '../native/SecurityModule';

const SetupPin: React.FC = () => {
  const navigation = useNavigation();
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const [useBiometric, setUseBiometric] = useState(false);

  const handleSave = async () => {
    if (pin.length < 4) return Alert.alert('خطأ', 'الرجاء إدخال رمز PIN مكوّن من 4 أو 6 أرقام.');
    if (pin !== confirm) return Alert.alert('خطأ', 'الرمزان غير متطابقين.');
    setLoading(true);
    try {
      const res = await NativeSecurity.createVault('default', pin, {useBiometric: useBiometric});
      const vaultId = res?.vaultId;
      if (useBiometric && vaultId) {
        try {
          await NativeSecurity.enableBiometric(vaultId);
        } catch (e: any) {
          // biometric enable failed; notify user but continue
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
      <Text style={styles.title}>إنشاء رمز PIN</Text>
      <TextField placeholder="أدخل رمز PIN" value={pin} onChangeText={setPin} secureTextEntry keyboardType="numeric" />
      <TextField placeholder="تأكيد رمز PIN" value={confirm} onChangeText={setConfirm} secureTextEntry keyboardType="numeric" />
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>تفعيل المصادقة البيومترية بعد الإنشاء</Text>
        <Switch value={useBiometric} onValueChange={setUseBiometric} />
      </View>
      <PrimaryButton title="حفظ" onPress={handleSave} style={{marginTop: 12}} loading={loading} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: Colors.dark.background},
  title: {fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 12},
  switchRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8},
  switchLabel: {color: 'rgba(255,255,255,0.9)'},
});

export default SetupPin;
