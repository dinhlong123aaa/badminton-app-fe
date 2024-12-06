// navigation/ManagementStackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ManagementScreen from '../screens/ManagementScreen';
import UserManagerScreen from '../screens/UserManagerScreen';
import CourseManagerScreen from '../screens/CourseManagerScreen';
import StatisticsScreen from '../screens/StatisticsScreen';

const ManagementStack = createNativeStackNavigator();

const ManagementStackNavigator = () => {
  return (
    <ManagementStack.Navigator>
      <ManagementStack.Screen 
        name="ManagementHome"
        component={ManagementScreen}
        options={{ title: 'Quản lý' }}
      />
      <ManagementStack.Screen 
        name="UserManager"
        component={UserManagerScreen}
        options={{ title: 'Quản lý học viên' }}
      />
      <ManagementStack.Screen 
        name="CourseManager"
        component={CourseManagerScreen}
        options={{ title: 'Quản lý khóa học' }}
      />
      <ManagementStack.Screen 
        name="Statistics"
        component={StatisticsScreen}
        options={{ title: 'Thống kê' }}
      />
    </ManagementStack.Navigator>
  );
};

export default ManagementStackNavigator;