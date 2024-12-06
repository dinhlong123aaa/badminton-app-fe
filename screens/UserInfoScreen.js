// UserInfoScreen.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Modal, TextInput } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-simple-toast';

const UserInfoScreen = ({ route }) => {
  const { username } = route.params || {};
  console.log('Username:', username);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Add useEffect to fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`http://10.0.2.2:8080/api/auth/users/username/${username}`);
        if (response.status === 200) {
          setUserInfo(response.data.data);
        }
      } catch (error) {
        Toast.show('Không thể tải thông tin người dùng');
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [username]);

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Toast.show('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show('Mật khẩu mới không khớp');
      return;
    }

    try {
      const response = await axios.put(`http://10.0.2.2:8080/api/auth/users/change-password/${username}`, {
        password: newPassword
      });

      if (response.status === 200) {
        Toast.show('Đổi mật khẩu thành công');
        setModalVisible(false);
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      Toast.show(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!userInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Không tìm thấy thông tin người dùng</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin cá nhân</Text>
      <Text style={styles.info}>Tên tài khoản: {userInfo.username}</Text>
      <Text style={styles.info}>Họ và tên: {userInfo.fullName}</Text>
      <Text style={styles.info}>Email: {userInfo.email}</Text>
      <Text style={styles.info}>Số điện thoại: {userInfo.phoneNumber}</Text>
      <Text style={styles.info}>Ngày sinh: {userInfo.dateOfBirth}</Text>

      <TouchableOpacity 
        style={styles.changePasswordButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Đổi mật khẩu</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đổi mật khẩu</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu mới"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Xác nhận mật khẩu mới"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setNewPassword('');
                  setConfirmPassword('');
                }}
              >
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleChangePassword}
              >
                <Text style={styles.buttonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ... rest of the styles remain the same

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
  changePasswordButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
});

export default UserInfoScreen;