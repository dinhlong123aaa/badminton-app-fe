// TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from '../screens/HomeScreen';
import ListCourse from '../screens/ListCourse';
import UserInfoScreen from '../screens/UserInfoScreen';
import UserManagerScreen from '../screens/UserManagerScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = ({ screenProps }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Trang chủ':
              iconName = 'home';
              break;
            case 'Bài học':
              iconName = 'book';
              break;
            case 'Thông tin cá nhân':
              iconName = 'user';
              break;
            case 'Quản lý':
              iconName = 'users';
              break;
            default:
              iconName = 'circle';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Trang chủ"
        component={HomeScreen}
      />
      <Tab.Screen
        name="Bài học"
        component={ListCourse}
        initialParams={{
          userId: screenProps?.userId,
          username: screenProps?.username
        }}
      />
      <Tab.Screen
        name="Thông tin cá nhân"
        component={UserInfoScreen}
        initialParams={{ username: screenProps?.username }}
      />
      <Tab.Screen
        name="Quản lý"
        component={UserManagerScreen}
        options={{ title: 'Quản lý học viên' }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;