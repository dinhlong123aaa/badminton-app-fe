// LoginScreen.js
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-simple-toast';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async () => {
    if (!username || !password) {
      Toast.show('Vui lòng nhập đầy đủ thông tin', Toast.LONG);
      return;
    }
  
    try {
      const response = await axios.post('http://10.0.2.2:8080/api/auth/login', {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Response:', response.status);
  
      if (response.status === 200 && response.data.message === 'Đăng nhập thành công') {
        const { id, fullName, email, phoneNumber, dateOfBirth } = response.data.data;
        
        // Verify we have the user ID
        if (!id) {
          Toast.show('Lỗi: Không nhận được ID người dùng', Toast.LONG);
          return;
        }
  
        Toast.show('Đăng nhập thành công', Toast.SHORT);
        
        // Navigate with all required params
        navigation.replace('StartScreen', {
          userId: id,
          username: username,
          fullName: fullName,
          email: email,
          phoneNumber: phoneNumber,
          dateOfBirth: dateOfBirth
        });
      } else {
        Toast.show(response.data.message || 'Đăng nhập thất bại', Toast.LONG);
      }
    } catch (error) {
      if (error.response) {
        Toast.show(error.response.data.message || 'Đăng nhập thất bại', Toast.LONG);
      } else if (error.request) {
        Toast.show('Không nhận được phản hồi từ máy chủ. Vui lòng thử lại.', Toast.LONG);
      } else {
        Toast.show('Đã xảy ra lỗi. Vui lòng thử lại.', Toast.LONG);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>

      {/* Trường nhập username */}
      <TextInput
        style={styles.input}
        placeholder="Tên tài khoản"
        value={username}
        onChangeText={setUsername}
      />

      {/* Trường nhập mật khẩu */}
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Nút Đăng nhập */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Đăng Nhập</Text>
      </TouchableOpacity>

      {/* Liên kết đến trang đăng ký */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.linkText}>Chưa có tài khoản? Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
};

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
    marginBottom: 30,
  },
  input: {
    width: '80%',
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 10,
  },
  button: {
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
  linkText: {
    color: '#007bff',
    marginTop: 10,
  },
});

export default LoginScreen;