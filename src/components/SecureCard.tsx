import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {Colors} from '../styles/theme';

type Props = {
  title: string;
  desc?: string;
  selected?: boolean;
  onPress?: () => void;
};

const SecureCard: React.FC<Props> = ({title, desc, selected, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, selected ? styles.cardSelected : null]}
      accessibilityRole="button">
      <View>
        <Text style={styles.title}>{title}</Text>
        {desc ? <Text style={styles.desc}>{desc}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.glass,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  cardSelected: {
    borderColor: Colors.dark.accent[0],
    borderWidth: 2,
  },
  title: {color: '#fff', fontSize: 16, fontWeight: '600'},
  desc: {color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4},
});

export default SecureCard;
