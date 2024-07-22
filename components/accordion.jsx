import { StyleSheet, Text, TouchableWithoutFeedback, View, UIManager, Platform, LayoutAnimation } from 'react-native';
import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';

export default function Accordion({ title, details }) {
  const [opened, setOpened] = useState(false);

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  function toggleAccordion() {
    LayoutAnimation.configureNext({
      duration: 300,
      create: { type: 'easeIn', property: 'opacity' },
      update: { type: 'linear', springDamping: 0.3, duration: 250 },
    });
    setOpened(!opened);
  }

  return (
    <View className="w-full bg-white rounded-lg p-4 my-4" style={styles.container}>
      <TouchableWithoutFeedback onPress={toggleAccordion}>
        <View style={styles.header}>
          <Text style={styles.title}>Yoo title</Text>
          <AntDesign name={opened ? 'caretup' : 'caretdown'} size={16} />
        </View>
      </TouchableWithoutFeedback>

      {opened && (
        <View style={[styles.content]}>
          <Text style={styles.details}>1. Hello World 1. Hello World 1. Hello World 1. Hello World</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  details: {
    opacity: 0.65,
  },
  title: {
    textTransform: 'capitalize',
  },
  content: {
    marginTop: 8,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
