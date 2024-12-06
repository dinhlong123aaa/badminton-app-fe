// HomeScreen.js
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        // Thay đổi URL logo của bạn(ở trong assets)
        source={require('../assets/images/logo.png')}
        style={styles.logo}
      />

      {/* Tiêu đề */}
      <Text style={styles.title}>Badminton L&L xin chào</Text>

      {/* Container chứa 2 nút */}
      <View style={styles.buttonContainer}>
        {/* Nút Đăng nhập */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Đăng Nhập</Text>
        </TouchableOpacity>

        {/* Nút Đăng ký */}
        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>Đăng Ký</Text>
        </TouchableOpacity>
      </View>
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
  logo: {
    width: 150,          // Kích thước của logo
    height: 150,         // Kích thước của logo
    marginBottom: 40,    // Khoảng cách giữa logo và tiêu đề
    borderRadius: 20,    // Bo góc logo
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',  // Đặt các nút cùng 1 hàng
    justifyContent: 'space-around', // Đảm bảo khoảng cách giữa các nút
    width: '100%',         // Chiếm toàn bộ chiều rộng của container
    marginTop: 20,         // Khoảng cách giữa nút và tiêu đề
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    width: '40%',          // Chiều rộng của nút
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#28a745', // Màu nền cho nút Đăng ký
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default HomeScreen;
