import React from 'react';
import {View, Text, StyleSheet, I18nManager} from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../styles/theme';

const Splash: React.FC = () => {
  const navigation = useNavigation();

  const isRTL = I18nManager.isRTL;

  return (
    <View style={styles.container}>
      <View style={styles.logoPlaceholder}>
        <Text style={styles.logoChar}>خ</Text>
      </View>
      <Text style={[styles.title, isRTL ? {textAlign: 'right'} : null]}>خزنتي</Text>
      <Text style={[styles.tagline, isRTL ? {textAlign: 'right'} : null]}>خزنة آمنة لملفاتك</Text>

      <View style={styles.footer}>
        <PrimaryButton title="بدء الاستخدام" onPress={() => (navigation as any).navigate('Onboarding')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: Colors.dark.background},
  logoPlaceholder: {width: 120, height: 120, marginBottom: 16, borderRadius: 60, backgroundColor: Colors.dark.surface, alignItems: 'center', justifyContent: 'center'},
  logoChar: {fontSize: 48, color: Colors.dark.accent[0], fontWeight: '700'},
  title: {fontSize: 28, fontWeight: '700', color: '#fff'},
  tagline: {fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 8, textAlign: 'center'},
  footer: {position: 'absolute', left: 20, right: 20, bottom: 40},
});

export default Splash;
