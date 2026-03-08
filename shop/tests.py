from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from shop.models import User


class UserAuthenticationTests(TestCase):
    """Unit Tests cho Authentication API"""
    
    def setUp(self):
        """Chuẩn bị dữ liệu test"""
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
        self.login_url = '/api/auth/login/'
        self.profile_url = '/api/auth/profile/'
        self.me_url = '/api/auth/me/'
        
        # Tạo user test
        self.test_user = User.objects.create_user(
            username='testuser',
            email='testuser@gmail.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
    
    def test_user_registration_success(self):
        """Test đăng ký thành công"""
        data = {
            'username': 'newuser',
            'email': 'newuser@gmail.com',
            'password': 'newpass123',
            'password2': 'newpass123',
            'first_name': 'New',
            'last_name': 'User'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['success'])
        self.assertEqual(User.objects.count(), 2)
    
    def test_user_registration_password_mismatch(self):
        """Test đăng ký với password không match"""
        data = {
            'username': 'newuser',
            'email': 'newuser@gmail.com',
            'password': 'newpass123',
            'password2': 'differentpass123',
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
    
    def test_user_registration_duplicate_username(self):
        """Test đăng ký với username đã tồn tại"""
        data = {
            'username': 'testuser',  # Username đã tồn tại
            'email': 'newemail@gmail.com',
            'password': 'newpass123',
            'password2': 'newpass123',
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data['errors'])
    
    def test_user_login_success(self):
        """Test đăng nhập thành công"""
        data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertIn('access', response.data)  # JWT token
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['username'], 'testuser')
    
    def test_user_login_invalid_password(self):
        """Test đăng nhập với password sai"""
        data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data['success'])
    
    def test_user_login_nonexistent_user(self):
        """Test đăng nhập user không tồn tại"""
        data = {
            'username': 'nonexistent',
            'password': 'anypassword'
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_get_profile_authenticated(self):
        """Test lấy profile khi đã đăng nhập"""
        # Đăng nhập trước
        login_data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        token = login_response.data['access']
        
        # Lấy profile với token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get(self.me_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['user']['username'], 'testuser')
    
    def test_get_profile_unauthenticated(self):
        """Test lấy profile khi chưa đăng nhập"""
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_update_profile_success(self):
        """Test cập nhật profile thành công"""
        # Đăng nhập trước
        login_data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        token = login_response.data['access']
        
        # Cập nhật profile
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        update_data = {
            'first_name': 'Updated',
            'last_name': 'Name',
            'phone': '0901234567',
            'address': 'Hà Nội, Việt Nam'
        }
        response = self.client.put(self.profile_url, update_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['user']['first_name'], 'Updated')
        self.assertEqual(response.data['user']['phone'], '0901234567')
    
    def test_update_profile_partial(self):
        """Test cập nhật partial profile (chỉ 1 field)"""
        login_data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        token = login_response.data['access']
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        update_data = {
            'phone': '0909999999'
        }
        response = self.client.put(self.profile_url, update_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['phone'], '0909999999')
        # first_name vẫn giữ nguyên
        self.assertEqual(response.data['user']['first_name'], 'Test')


class UserModelTests(TestCase):
    """Unit Tests cho User Model"""
    
    def test_create_user_success(self):
        """Test tạo user thành công"""
        user = User.objects.create_user(
            username='modeltest',
            email='modeltest@gmail.com',
            password='modelpass123'
        )
        self.assertEqual(user.username, 'modeltest')
        self.assertEqual(user.email, 'modeltest@gmail.com')
        self.assertTrue(user.check_password('modelpass123'))
    
    def test_user_string_representation(self):
        """Test string representation của User"""
        user = User.objects.create_user(
            username='strtest',
            email='strtest@gmail.com'
        )
        self.assertEqual(str(user), 'strtest')
    
    def test_user_fields(self):
        """Test các fields của User"""
        user = User.objects.create_user(
            username='fieldtest',
            email='fieldtest@gmail.com',
            first_name='Field',
            last_name='Test',
            phone='0901234567',
            address='Test Address'
        )
        self.assertEqual(user.first_name, 'Field')
        self.assertEqual(user.last_name, 'Test')
        self.assertEqual(user.phone, '0901234567')
        self.assertEqual(user.address, 'Test Address')
