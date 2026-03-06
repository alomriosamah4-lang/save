import React from 'react';
import {TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator} from 'react-native';
import {Colors} from '../styles/theme';

type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
  loading?: boolean;
};

const PrimaryButton: React.FC<Props> = ({title, onPress, style, disabled, loading}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled ? styles.disabled : null, style as any]}
      onPress={disabled || loading ? undefined : onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{disabled: !!disabled}}>
      <React.Fragment>
        <View style={styles.gradientOverlay} pointerEvents="none" />
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
      </React.Fragment>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.dark.accent[0],
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  disabled: {
    opacity: 0.6,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    top: 0,
    height: '50%',
    backgroundColor: Colors.dark.accent[1],
    opacity: 0.12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PrimaryButton;
