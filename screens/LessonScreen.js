import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  ScrollView
} from 'react-native';
import Video from 'react-native-video';
import axios from 'axios';

const LessonScreen = ({ route }) => {
  const { lessonId } = route.params;
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLesson();
  }, []);

  const fetchLesson = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:8080/api/lessons/${lessonId}`);
      if (response.status === 200) {
        setLesson(response.data.data);
      }
    } catch (error) {
      console.error('Lỗi tải bài học:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          {lesson?.videoUrl && (
            <View style={styles.videoContainer}>
              <Video
                source={{ uri: lesson.videoUrl }}
                style={styles.video}
                controls={true}
                resizeMode="contain"
                useNativeControls
              />
            </View>
          )}
          <Text style={styles.title}>{lesson?.title}</Text>
          <Text style={styles.lessonContent}>{lesson?.content}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16/9,
    marginBottom: 16,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  lessonContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  }
});

export default LessonScreen;