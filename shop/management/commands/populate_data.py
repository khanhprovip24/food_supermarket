from django.core.management.base import BaseCommand
from django.utils import timezone
from faker import Faker
from decimal import Decimal
import random
from shop.models import User, Category, Product, Order, OrderItem, Review, Discount, Recipe

class Command(BaseCommand):
    help = 'Populate database with sample data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Xóa dữ liệu mẫu cũ trước khi tạo mới',
        )

    def handle(self, *args, **options):
        fake = Faker('vi_VN')
        
        if options['clear']:
            self.stdout.write(self.style.WARNING('⚠️  Xóa dữ liệu mẫu cũ...'))
            Review.objects.all().delete()
            OrderItem.objects.all().delete()
            Order.objects.all().delete()
            Product.objects.all().delete()
            Category.objects.all().delete()
            Discount.objects.all().delete()
            Recipe.objects.all().delete()
            # Không xóa User vì có admin sẵn
            self.stdout.write('✅ Xóa hoàn tất')
        
        self.stdout.write('🌱 Bắt đầu tạo dữ liệu mẫu...')
        
        # 1. TẠO NGƯỜI DÙNG
        self.stdout.write('👥 Tạo người dùng...')
        
        # Chỉ tạo khách hàng, admin do bạn tạo sẵn
        users = []
        
        # Tạo khách hàng (10 người)
        for i in range(10):
            user, created = User.objects.get_or_create(
                username=f'user{i}',
                defaults={
                    'email': f'user{i}@shop.com',
                    'first_name': fake.first_name(),
                    'last_name': fake.last_name(),
                    'phone': fake.phone_number()[:15],
                    'address': fake.address(),
                }
            )
            user.set_password('user123')
            user.save()
            users.append(user)
            if created:
                self.stdout.write(f'  ➕ Tạo user{i}')
            else:
                self.stdout.write(f'  ℹ️  user{i} đã tồn tại')
        
        admin_user = User.objects.filter(is_superuser=True).first()
        if admin_user:
            self.stdout.write(f'✅ {len(users)} khách hàng + Admin sẵn ({admin_user.username})')
        else:
            self.stdout.write(self.style.WARNING('⚠️  Chưa có admin! Tạo admin bằng: python manage.py createsuperuser'))
        
        # 2. TẠO DANH MỤC HÀNG
        self.stdout.write('🏷️  Tạo danh mục...')
        
        categories_data = [
            'Thịt',
            'Rau Củ',
            'Hải Sản',
            'Trái Cây',
            'Sữa & Trứng',
            'Bánh & Thực Phẩm Khô'
        ]
        
        categories = []
        created_count = 0
        for cat_name in categories_data:
            cat, created = Category.objects.get_or_create(
                name=cat_name,
                defaults={'image': None}
            )
            categories.append(cat)
            if created:
                created_count += 1
        
        self.stdout.write(f'✅ {created_count} danh mục mới tạo, {len(categories) - created_count} danh mục đã tồn tại')
        
        # 3. TẠO SẢN PHẨM
        self.stdout.write('🛍️  Tạo sản phẩm...')
        
        products_data = {
            'Thịt': [
                'Thịt Cừu Úc',
                'Thịt Bò Mỹ',
                'Thịt Lợn Sạch',
                'Gà Tươi',
                'Cánh Gà',
            ],
            'Rau Củ': [
                'Cà Chua Tươi',
                'Dưa Chuột',
                'Bắp Cải',
                'Cà Rốt',
                'Hành Tây',
            ],
            'Hải Sản': [
                'Tôm Sú',
                'Cá Hồi',
                'Cua Hoàng Đế',
                'Mực Tươi',
                'Hàu Tươi',
            ],
            'Trái Cây': [
                'Dâu Tây',
                'Cam Sâm',
                'Xoài Cát Chu',
                'Nho Xanh',
                'Bưởi Đỏ',
            ],
            'Sữa & Trứng': [
                'Sữa Tươi Không Đường',
                'Sữa Chua Hy Lạp',
                'Trứng Gà Tươi',
                'Trứng Vịt Muối',
            ],
            'Bánh & Thực Phẩm Khô': [
                'Bánh Mì Tươi',
                'Bánh Quy Yến Mạch',
                'Mì Ý Spaghetti',
                'Gạo Lứt',
            ]
        }
        
        products = []
        created_count = 0
        for category in categories:
            if category.name in products_data:
                for product_name in products_data[category.name]:
                    product, created = Product.objects.get_or_create(
                        name=product_name,
                        category=category,
                        defaults={
                            'description': f'{product_name} tươi ngon, chất lượng cao, được chọn lựa kỹ từ các nhà cung cấp uy tín.',
                            'price': Decimal(str(random.uniform(10000, 500000))).quantize(Decimal('0.01')),
                            'stock': random.randint(10, 100),
                            'image': None,
                            'status': True,
                        }
                    )
                    products.append(product)
                    if created:
                        created_count += 1
        
        self.stdout.write(f'✅ {created_count} sản phẩm mới tạo, {len(products) - created_count} sản phẩm đã tồn tại')
        
        # 4. TẠO MÃ GIẢM GIÁ
        self.stdout.write('💰 Tạo mã giảm giá...')
        
        discounts = []
        discount_codes = ['FRESH10', 'SAVE20', 'SUMMER15', 'NEWUSER25']
        created_count = 0
        
        for code in discount_codes:
            discount, created = Discount.objects.get_or_create(
                code=code,
                defaults={
                    'value': random.choice([10, 15, 20, 25]),
                    'is_percentage': True,
                    'valid_from': timezone.now(),
                    'valid_to': timezone.now() + timezone.timedelta(days=30),
                    'usage_limit': 100,
                }
            )
            discounts.append(discount)
            if created:
                created_count += 1
        
        self.stdout.write(f'✅ {created_count} mã giảm giá mới tạo, {len(discounts) - created_count} mã đã tồn tại')
        
        # 5. TẠO ĐƠN HÀNG
        self.stdout.write('📦 Tạo đơn hàng...')
        
        orders = []
        created_count = 0
        for i in range(15):
            user = random.choice(users)
            order_key = f'{user.id}_{timezone.now().timestamp()}_{i}'
            
            order = Order.objects.create(
                user=user,
                discount=random.choice(discounts + [None]),
                total_amount=Decimal('0'),
                status=random.choice(['pending', 'processing', 'shipping', 'completed']),
                shipping_address=user.address,
                payment_method=random.choice(['COD', 'Online']),
                created_at=fake.date_time_this_month()
            )
            created_count += 1
            
            # Tạo chi tiết đơn hàng
            total = Decimal('0')
            for _ in range(random.randint(2, 5)):
                product = random.choice(products)
                quantity = random.randint(1, 5)
                item_price = product.price
                
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    quantity=quantity,
                    price=item_price
                )
                total += item_price * quantity
            
            order.total_amount = total
            order.save()
            orders.append(order)
        
        self.stdout.write(f'✅ Tạo {created_count} đơn hàng')
        
        # 6. TẠO ĐÁNH GIÁ
        self.stdout.write('⭐ Tạo đánh giá...')
        
        review_comments = [
            'Sản phẩm tươi, giao hàng nhanh, rất hài lòng!',
            'Chất lượng tốt, trái với mong đợi.',
            'Giá hơi cao nhưng sản phẩm chất lượng.',
            'Giao hàng nhanh, sản phẩm còn tươi Tốt.',
            'Sẽ tiếp tục mua lại',
            'Rất hài lòng với dịch vụ',
            'Khác kỳ vọng một chút',
        ]
        
        reviews_count = 0
        for product in random.sample(products, min(20, len(products))):
            for _ in range(random.randint(1, 3)):
                review, created = Review.objects.get_or_create(
                    user=random.choice(users),
                    product=product,
                    defaults={
                        'rating': random.randint(3, 5),
                        'comment': random.choice(review_comments),
                        'created_at': fake.date_time_this_month()
                    }
                )
                if created:
                    reviews_count += 1
        
        self.stdout.write(f'✅ Tạo {reviews_count} đánh giá mới')
        
        # 7. TẠO CÁC CÔNG THỨC NẤU ĂN
        self.stdout.write('👨‍🍳 Tạo công thức nấu ăn...')
        
        recipes_data = [
            {
                'name': 'Canh Chua Tôm',
                'instruction': '1. Đun sôi nước\n2. Cho tôm vào\n3. Thêm cà chua\n4. Nêm gia vị'
            },
            {
                'name': 'Gà Kho Gừng',
                'instruction': '1. Xào gừng\n2. Cho gà vào\n3. Nập chín\n4. Nêm nếm'
            },
            {
                'name': 'Salad Rau Trộn',
                'instruction': '1. Rửa rau\n2. Cắt nhỏ\n3. Trộn với nước xốt'
            },
        ]
        
        created_count = 0
        for recipe_data in recipes_data:
            recipe, created = Recipe.objects.get_or_create(
                name=recipe_data['name'],
                defaults={'instructions': recipe_data['instruction']}
            )
            # Thêm vài nguyên liệu ngẫu nhiên
            recipe.ingredients.set(random.sample(products, min(3, len(products))))
            if created:
                created_count += 1
        
        self.stdout.write(f'✅ {created_count} công thức mới tạo, {len(recipes_data) - created_count} công thức đã tồn tại')
        
        self.stdout.write(self.style.SUCCESS('✨ Hoàn thành! Dữ liệu mẫu đã được thêm vào.'))
