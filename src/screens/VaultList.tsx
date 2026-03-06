import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity, I18nManager} from 'react-native';
import {Colors} from '../styles/theme';

const TABS = ['Photos', 'Videos', 'Files', 'Documents', 'Audio'];

const SAMPLE = Array.from({length: 12}).map((_, i) => ({id: String(i + 1), name: `ملف_${i + 1}.jpg`}));

const VaultList: React.FC = () => {
  const [tab, setTab] = useState(0);
  const isRTL = I18nManager.isRTL;

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {TABS.map((t, i) => (
          <TouchableOpacity key={t} onPress={() => setTab(i)} style={[styles.tabItem, tab === i ? styles.tabActive : null]}>
            <Text style={[styles.tabText, tab === i ? styles.tabTextActive : null]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={SAMPLE}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{padding: 16}}
        renderItem={({item}) => (
          <View style={[styles.row, isRTL ? {flexDirection: 'row-reverse'} : null]}>
            <View style={styles.thumb} />
            <View style={styles.meta}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sub}>2.1 MB • 2026</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.dark.background},
  tabBar: {flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 10, backgroundColor: Colors.dark.surface},
  tabItem: {paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, marginHorizontal: 6},
  tabActive: {backgroundColor: Colors.dark.glass},
  tabText: {color: 'rgba(255,255,255,0.7)'},
  tabTextActive: {color: '#fff', fontWeight: '700'},
  row: {flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: Colors.dark.surface, borderRadius: 10, marginBottom: 10},
  thumb: {width: 64, height: 64, borderRadius: 8, backgroundColor: Colors.dark.glass, marginRight: 12},
  meta: {flex: 1},
  name: {color: '#fff', fontSize: 16, fontWeight: '600'},
  sub: {color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 4},
});

export default VaultList;
