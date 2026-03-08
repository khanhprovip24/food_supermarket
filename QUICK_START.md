# Food Chatbot - Quick Start Guide

Get the food chatbot up and running in 5 minutes.

## Prerequisites

- Node.js 16+ installed
- Python 3.8+ installed
- n8n installed (or Docker)
- Git

## Step 1: Start Django Backend (2 minutes)

```bash
# Navigate to Django project
cd backend

# Install dependencies (if not already done)
pip install -r requirements.txt

# Run migrations (if needed)
python manage.py migrate

# Start the server
python manage.py runserver
```

**Verify**: Open http://localhost:8000/api/products/ - you should see product data

## Step 2: Start n8n and Import Workflow (2 minutes)

### Option A: Using npx (Recommended for testing)

```bash
# Start n8n
npx n8n

# n8n will start on http://localhost:5678
```

### Option B: Using Docker

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Import the Workflow

1. Open http://localhost:5678
2. Create an account (first time only)
3. Click "Workflows" → "Import from File"
4. Select `food-chatbot-workflow.json`
5. Click "Import"
6. Click "Active" toggle to activate the workflow
7. Note the webhook URL: `http://localhost:5678/webhook/food-chatbot`

**Verify**: Test the webhook
```bash
curl -X POST http://localhost:5678/webhook/food-chatbot \
  -H "Content-Type: application/json" \
  -d '{"message":"Giá rau củ bao nhiêu?","sessionId":"test","timestamp":1234567890}'
```

## Step 3: Start React Application (1 minute)

```bash
# Navigate to React app
cd fresh-food-shop

# Install dependencies (first time only)
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

**Verify**: Open http://localhost:5173

## Step 4: Test the Chatbot

1. Click the chat button (💬) in the bottom-right corner
2. Type a message: "Giá rau củ bao nhiêu?"
3. Press "Gửi" (Send)
4. You should receive a response from the bot with product information

## Test Queries

Try these queries to test different features:

**Vietnamese:**
- "Giá rau củ bao nhiêu?" → Price query
- "Hôm nay ăn gì?" → Suggestion query
- "Còn thịt gà không?" → Availability query
- "Thời tiết hôm nay?" → Non-food query (should be rejected)

**English:**
- "How much are vegetables?" → Price query
- "What should I eat today?" → Suggestion query
- "Is chicken available?" → Availability query
- "What's the weather?" → Non-food query (should be rejected)

## Troubleshooting

### Chat button not appearing
```bash
# Check that all services are running
# Check browser console for errors
# Verify .env file exists with correct URL
```

### No response from bot
```bash
# Check n8n workflow is active (green toggle)
# Check n8n execution logs for errors
# Verify Django backend is running
# Test webhook URL with curl
```

### CORS errors
```bash
# Add to Django settings.py:
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5678",  # n8n
    "http://localhost:5173",  # React
]
```

### Product data not showing
```bash
# Verify Django API is accessible:
curl http://localhost:8000/api/products/

# Check that products exist in database:
python manage.py shell
>>> from products.models import Product
>>> Product.objects.all()
```

## Environment Variables Summary

### React (.env)
```bash
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/food-chatbot
```

### n8n (Environment Variables)
```bash
DJANGO_API_URL=http://localhost:8000
```

### n8n (Hardcoded in workflow)
```bash
GEMINI_API_KEY=AIzaSyAKFH-hNkyiaGJxlzM9D4VB1Pwt0zt8tk0
```

## Architecture Overview

```
User Browser (React)
    ↓ POST /webhook/food-chatbot
n8n Workflow
    ↓ GET /api/products/
Django Backend
    ↓ Query
Database

n8n Workflow
    ↓ POST /v1beta/models/gemini-2.0-flash-exp:generateContent
Google Gemini API
```

## Next Steps

- Read `DEPLOYMENT_GUIDE.md` for production deployment
- Read `CHATWIDGET_INTEGRATION.md` for customization options
- Read `n8n-environment-variables.md` for detailed configuration
- Review the spec files in `.kiro/specs/food-chatbot-n8n/`

## Common Commands

```bash
# Start Django
cd backend && python manage.py runserver

# Start n8n
npx n8n

# Start React
cd fresh-food-shop && npm run dev

# Test webhook
curl -X POST http://localhost:5678/webhook/food-chatbot \
  -H "Content-Type: application/json" \
  -d '{"message":"test","sessionId":"test","timestamp":1234567890}'

# Check Django products
curl http://localhost:8000/api/products/
```

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the detailed guides in the documentation
3. Check n8n execution logs for workflow errors
4. Check browser console for frontend errors
5. Check Django logs for backend errors

## Success Checklist

- [ ] Django backend running on port 8000
- [ ] n8n running on port 5678
- [ ] n8n workflow imported and active
- [ ] React app running on port 5173
- [ ] Chat button visible on the page
- [ ] Chat window opens when clicked
- [ ] Bot responds to messages
- [ ] Product data displays correctly

If all items are checked, you're ready to go! 🎉
