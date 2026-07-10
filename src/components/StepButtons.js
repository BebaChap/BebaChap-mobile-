import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const StepButtons = ({ onNext, onBack, nextText = 'Next', backText = 'Back' }) => {
  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity 
          style={[styles.button, styles.backButton]} 
          onPress={onBack}
        >
          <Text style={[styles.buttonText, styles.backButtonText]}>
            {backText}
          </Text>
        </TouchableOpacity>
      )}
      
      {onNext && (
        <TouchableOpacity 
          style={[styles.button, styles.nextButton]} 
          onPress={onNext}
        >
          <Text style={[styles.buttonText, styles.nextButtonText]}>
            {nextText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12, // Kama RN yako ni < 0.71, toa hii weka marginRight kwenye backButton
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#007AFF',
  },
  backButton: {
    backgroundColor: '#f2f2f2',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonText: {
    color: '#fff',
  },
  backButtonText: {
    color: '#000',
  },
});

export default StepButtons; // ✅ Default export