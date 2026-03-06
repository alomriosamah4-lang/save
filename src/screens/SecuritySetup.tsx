import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import SecureCard from '../components/SecureCard';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../styles/theme';

const OPTIONS = [
  {key: 'pin', title: 'رمز PIN (4/6)', desc: 'رمز رقمي مكوّن من 4 أو 6 أرقام'},
  {key: 'password', title: 'كلمة مرور نصية', desc: 'كلمة مرور قوية بطول مناسب'},
  {key: 'pattern', title: 'رسم نمط', desc: 'ارسم نمط لقفل التطبيق'},
  {key: 'fingerprint', title: 'بصمة الإصبع', desc: 'استخدم بصمة الجهاز لفتح الخزنة'},
  {key: 'face', title: 'بصمة الوجه', desc: 'استخدم التعرف على الوجه إن توفر'},
];

const SecuritySetup: React.FC = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = () => {
    if (!selected) return;
    switch (selected) {
      case 'pin':
        (navigation as any).navigate('SetupPin');
        break;
      case 'password':
        (navigation as any).navigate('SetupPassword');
        break;
      case 'pattern':
        (navigation as any).navigate('SetupPattern');
        break;
      case 'fingerprint':
      case 'face':
        (navigation as any).navigate('SetupBiometric', {type: selected});
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>إعداد نظام الحماية</Text>
      <Text style={styles.subtitle}>اختر طريقة القفل التي تفضّلها</Text>

      <FlatList
        data={OPTIONS}
        keyExtractor={(i) => i.key}
        renderItem={({item}) => (
          <SecureCard
            title={item.title}
            desc={item.desc}
            selected={selected === item.key}
            onPress={() => setSelected(item.key)}
          />
        )}
      />

      <PrimaryButton title="متابعة" onPress={handleContinue} style={{marginTop: 12}} disabled={!selected} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: Colors.dark.background},
  title: {fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 6},
  subtitle: {fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 12},
});

export default SecuritySetup;
