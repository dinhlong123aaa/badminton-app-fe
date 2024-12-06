// ListCourse.js
import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import axios from 'axios';

const ListCourse = ({ navigation }) => {
  const route = useRoute();
  const { userId } = route.params || {};
  
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://10.0.2.2:8080/api/courses/all');
      if (response.status === 200) {
        setCourses(response.data.data);
      }
    } catch (error) {
      setError('Không thể tải danh sách khóa học');
      Toast.show('Không thể tải danh sách khóa học', Toast.LONG);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'cơ bản':
        return '#28a745';
      case 'trung bình':
        return '#ffc107';
      case 'nâng cao':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const renderCourseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => {
        if (!userId) {
          Toast.show('Vui lòng đăng nhập để xem bài học', Toast.LONG);
          return;
        }
        navigation.navigate('CourseLessons', {
          courseId: item.id,
          courseName: item.courseName,
          studentId: userId
        });
      }}
    >
      <Text style={styles.courseName}>{item.courseName}</Text>
      <View style={styles.courseDetails}>
        <Text style={[styles.level, { color: getLevelColor(item.level) }]}>
          Cấp độ: {item.level}
        </Text>
        <Text style={styles.fee}>Học phí: {item.fee}k VNĐ</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchCourses}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        renderItem={renderCourseItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không có khóa học nào</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContainer: {
    padding: 16,
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  courseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  courseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  level: {
    fontSize: 14,
    fontWeight: '500',
  },
  fee: {
    fontSize: 14,
    fontWeight: '500',
    color: '#dc3545',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  }
});

export default ListCourse;