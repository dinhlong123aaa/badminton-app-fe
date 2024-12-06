// screens/StartScreen.js
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import TabNavigator from '../navigation/TabNavigator';
const StartScreen = ({ route }) => {
  const { userId, username, fullName, email, phoneNumber, dateOfBirth } = route.params || {};
  console.log('StartScreen params:', route.params);
  return (
    <View style={styles.container}>
    <TabNavigator 
      screenProps={{
        userId: userId,
        username: username,
        userInfo: {
          fullName,
          email,
          phoneNumber,
          dateOfBirth
        }
      }}
    />
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default StartScreen;