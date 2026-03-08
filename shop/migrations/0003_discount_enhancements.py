# Generated migration for Discount model enhancements

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0002_cart_cartitem'),
    ]

    operations = [
        migrations.AddField(
            model_name='discount',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='discount',
            name='usage_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='discount',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='discount',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]
