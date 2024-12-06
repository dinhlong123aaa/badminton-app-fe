// CourseLessons.js
import React, { useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Modal,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';

const RatingStars = ({ rating, onRatingChange, disabled }) => {
  const stars = [1, 2, 3, 4, 5];
  
  return (
    <View style={styles.ratingContainer}>
      {stars.map((star) => (
        <TouchableOpacity
          key={star}
          disabled={disabled}
          onPress={() => !disabled && onRatingChange(star)}
        >
          <Icon
            name={star <= rating ? 'star' : 'star-o'}
            size={24}
            color="#FFD700"
            style={styles.star}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const CourseLessons = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { courseId, courseName, studentId } = route.params || {};

  const [lessons, setLessons] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    content: '',
    rating: 5
  });


  useEffect(() => {
    if (!courseId || !studentId) {
      Toast.show('Thiếu thông tin khóa học hoặc người dùng', Toast.LONG);
      navigation.goBack();
      return;
    }
    fetchLessons();
    fetchFeedbacks();
  }, [courseId, studentId]);

  const fetchLessons = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:8080/api/lessons/course/${courseId}`);
      if (response.status === 200) {
        setLessons(response.data.data);
      }
    } catch (error) {
      Toast.show('Không thể tải danh sách bài học', Toast.LONG);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`http://10.0.2.2:8080/api/feedbacks/course/${courseId}`);
      if (response.status === 200) {
        setFeedbacks(response.data.data);
      }
    } catch (error) {
      Toast.show('Không thể tải phản hồi', Toast.LONG);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeedback = async () => {
    if (!newFeedback.content.trim()) {
      Toast.show('Vui lòng nhập nội dung phản hồi', Toast.LONG);
      return;
    }

    try {
      const feedbackData = {
        studentId: studentId,
        courseId: courseId,
        content: newFeedback.content,
        rating: newFeedback.rating,
        feedbackDate: new Date().toISOString().split('T')[0]
      };

      const response = await axios.post('http://10.0.2.2:8080/api/feedbacks', feedbackData);
      if (response.status === 200) {
        Toast.show('Đã thêm phản hồi thành công', Toast.SHORT);
        fetchFeedbacks();
        setNewFeedback({ content: '', rating: 5 });
      }
    } catch (error) {
      Toast.show('Không thể thêm phản hồi', Toast.LONG);
    }
  };

  const handleUpdateFeedback = async () => {
    try {
      const response = await axios.put('http://10.0.2.2:8080/api/feedbacks', {
        id: selectedFeedback.id,
        studentId: studentId,
        courseId: courseId,
        content: newFeedback.content,
        rating: newFeedback.rating,
        feedbackDate: new Date().toISOString().split('T')[0]
      });

      if (response.status === 200) {
        Toast.show('Đã cập nhật phản hồi', Toast.SHORT);
        fetchFeedbacks();
        setIsModalVisible(false);
        setSelectedFeedback(null);
      }
    } catch (error) {
      Toast.show('Không thể cập nhật phản hồi', Toast.LONG);
    }
  };

  const handleDeleteFeedback = async () => {
    try {
      const response = await axios.delete(`http://10.0.2.2:8080/api/feedbacks/${selectedFeedback.id}`);
      if (response.status === 200) {
        Toast.show('Đã xóa phản hồi', Toast.SHORT);
        fetchFeedbacks();
        setIsModalVisible(false);
        setSelectedFeedback(null);
      }
    } catch (error) {
      Toast.show('Không thể xóa phản hồi', Toast.LONG);
    }
  };

  const handleFeedbackLongPress = (feedback) => {
    if (feedback.studentId === studentId) {
      setSelectedFeedback(feedback);
      setNewFeedback({
        content: feedback.content,
        rating: feedback.rating
      });
      setIsModalVisible(true);
    }
  };

  const renderLessonItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.lessonCard}
      onPress={() => navigation.navigate('LessonScreen', {
        lessonId: item.id,
        title: item.title
      })}
    >
      <Text style={styles.lessonTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderFeedbackItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.feedbackCard}
      onLongPress={() => handleFeedbackLongPress(item)}
    >
      <View style={styles.feedbackHeader}>
        <Text style={styles.studentName}>{item.studentName}</Text>
        <Text style={styles.feedbackDate}>{item.feedbackDate}</Text>
      </View>
      <RatingStars rating={item.rating} disabled={true} />
      <Text style={styles.feedbackContent}>{item.content}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.courseTitle}>{courseName}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh sách bài học</Text>
          <FlatList
            data={lessons}
            renderItem={renderLessonItem}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phản hồi từ học viên</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <FlatList
              data={feedbacks}
              renderItem={renderFeedbackItem}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Chưa có phản hồi nào</Text>
              }
            />
          )}
        </View>

        <View style={styles.feedbackForm}>
          <Text style={styles.sectionTitle}>
            {selectedFeedback ? 'Chỉnh sửa phản hồi' : 'Thêm phản hồi của bạn'}
          </Text>
          <Text style={styles.label}>Đánh giá</Text>
          <RatingStars
            rating={newFeedback.rating}
            onRatingChange={(rating) => setNewFeedback({...newFeedback, rating})}
          />
          <Text style={styles.label}>Nội dung</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={4}
            value={newFeedback.content}
            onChangeText={(text) => setNewFeedback({...newFeedback, content: text})}
            placeholder="Nhập phản hồi của bạn..."
          />
          <View style={styles.buttonContainer}>
            {selectedFeedback ? (
              <>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setSelectedFeedback(null);
                    setNewFeedback({ content: '', rating: 5 });
                  }}
                >
                  <Text style={styles.buttonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => {
                    Alert.alert(
                      'Xác nhận xóa',
                      'Bạn có chắc chắn muốn xóa phản hồi này?',
                      [
                        { text: 'Hủy', style: 'cancel' },
                        { 
                          text: 'Xóa',
                          style: 'destructive',
                          onPress: handleDeleteFeedback
                        }
                      ]
                    );
                  }}
                >
                  <Text style={styles.buttonText}>Xóa</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.button, styles.updateButton]}
                  onPress={handleUpdateFeedback}
                >
                  <Text style={styles.buttonText}>Cập nhật</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity 
                style={[styles.button, styles.submitButton]}
                onPress={handleAddFeedback}
              >
                <Text style={styles.buttonText}>Gửi phản hồi</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    elevation: 2,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1A1A1A',
  },
  lessonCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lessonTitle: {
    fontSize: 16,
    color: '#333',
  },
  feedbackForm: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#1A1A1A',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  updateButton: {
    backgroundColor: '#28a745',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  feedbackCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  feedbackDate: {
    fontSize: 14,
    color: '#666',
  },
  feedbackContent: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginTop: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  star: {
    marginRight: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
    fontStyle: 'italic',
  }
});

export default CourseLessons;