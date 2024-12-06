// RegisterScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    dateOfBirth: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const validateForm = () => {
    if (!formData.username.trim()) {
      Toast.show('Tên tài khoản không được để trống', Toast.LONG);
      return false;
    }
    if (!formData.email.trim()) {
      Toast.show('Email không được để trống', Toast.LONG);
      return false;
    }
    if (!formData.password.trim()) {
      Toast.show('Mật khẩu không được để trống', Toast.LONG);
      return false;
    }
    if (!formData.fullName.trim()) {
      Toast.show('Họ tên không được để trống', Toast.LONG);
      return false;
    }
    if (!formData.phoneNumber.trim()) {
      Toast.show('Số điện thoại không được để trống', Toast.LONG);
      return false;
    }
    if (!formData.dateOfBirth) {
      Toast.show('Ngày sinh không được để trống', Toast.LONG);
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post('http://10.0.2.2:8080/api/auth/register', {
        ...formData,
        role: 'STUDENT'
      });

      if (response.status === 200) {
        Toast.show('Đăng ký thành công', Toast.SHORT);
        navigation.replace('Login');
      }
    } catch (error) {
      Toast.show(error.response?.data?.message || 'Đăng ký thất bại', Toast.LONG);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString('en-GB');
      setFormData(prev => ({ ...prev, dateOfBirth: formattedDate }));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Đăng Ký</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Tên tài khoản"
          value={formData.username}
          onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={formData.password}
          onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Họ và tên"
          value={formData.fullName}
          onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
        />

        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          value={formData.phoneNumber}
          onChangeText={(text) => setFormData(prev => ({ ...prev, phoneNumber: text }))}
          keyboardType="phone-pad"
        />

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {formData.dateOfBirth || 'Chọn ngày sinh'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Đăng Ký</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginLinkText}>
            Đã có tài khoản? Đăng nhập ngay
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateButtonText: {
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLink: {
    marginTop: 20,
  },
  loginLinkText: {
    color: '#007AFF',
    textAlign: 'center',
  }
});

export default RegisterScreen;