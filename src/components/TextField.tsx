import React from 'react';
import {TextInput, StyleSheet, View, KeyboardTypeOptions} from 'react-native';
import {Colors} from '../styles/theme';

type Props = {
  value?: string;
  onChangeText?: (t: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
};

const TextField: React.FC<Props> = ({value, onChangeText, placeholder, secureTextEntry, keyboardType}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        placeholderTextColor={'rgba(255,255,255,0.6)'}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  input: {
    backgroundColor: Colors.dark.glass,
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
});

export default TextField;
