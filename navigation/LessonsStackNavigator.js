// navigation/LessonsStackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListCourse from '../screens/ListCourse';
import CourseLessons from '../screens/CourseLessons';
import LessonScreen from '../screens/LessonScreen';

const LessonsStack = createNativeStackNavigator();

export default function LessonsStackNavigator() {
  return (
    <LessonsStack.Navigator>
      <LessonsStack.Screen 
        name="ListCourse" 
        component={ListCourse}
        options={{ title: 'Danh sách khóa học' }}
      />
      <LessonsStack.Screen 
        name="CourseLessons" 
        component={CourseLessons}
        options={({ route }) => ({ title: route.params?.courseName })}
      />
      <LessonsStack.Screen 
        name="LessonScreen" 
        component={LessonScreen}
        options={({ route }) => ({ title: route.params?.title })}
      />
    </LessonsStack.Navigator>
  );
}