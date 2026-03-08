# Food Chatbot Feature - Complete Documentation

## Overview

This is a comprehensive AI-powered food chatbot feature for the Fresh Food Shop e-commerce platform. The chatbot answers food-related questions, provides product prices, suggests dishes, and checks product availability using n8n workflow automation and Google Gemini 2.0 Flash API.

## 🎯 Features

- **Food Query Processing**: Answers questions about food products, prices, and availability
- **Dish Suggestions**: Recommends Vietnamese dishes based on available products
- **Price Information**: Provides current pricing with currency and units
- **Smart Filtering**: Only responds to food-related queries, politely rejects others
- **Product Integration**: Real-time data from Django backend
- **Error Handling**: Graceful error handling with user-friendly messages
- **Bilingual Support**: Works with both Vietnamese and English queries

## 📁 Documentation Structure

This feature includes comprehensive documentation organized by purpose:

### Quick Start
- **[QUICK_START.md](QUICK_START.md)** - Get up and running in 5 minutes
  - Prerequisites and setup
  - Step-by-step instructions
  - Test queries
  - Troubleshooting

### Deployment
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete deployment guide
  - Environment variables configuration
  - Production deployment steps
  - Testing procedures
  - Security considerations
  - Monitoring and maintenance

- **[TASK_8.3_DEPLOYMENT_NOTES.md](TASK_8.3_DEPLOYMENT_NOTES.md)** - Manual deployment checklist
  - What's completed vs. what requires manual action
  - Deployment checklist
  - Testing commands
  - Rollback plan

### Configuration
- **[n8n-environment-variables.md](n8n-environment-variables.md)** - n8n configuration
  - Required environment variables
  - How to set them
  - Verification steps
  - Troubleshooting

### Integration
- **[CHATWIDGET_INTEGRATION.md](CHATWIDGET_INTEGRATION.md)** - ChatWidget documentation
  - Integration details
  - Component features
  - Customization options
  - Testing procedures
  - Accessibility and performance

### Specification
- **[.kiro/specs/food-chatbot-n8n/](/.kiro/specs/food-chatbot-n8n/)** - Complete specification
  - `requirements.md` - Functional requirements
  - `design.md` - System architecture and design
  - `tasks.md` - Implementation tasks and progress

## 🏗️ Architecture

```
┌─────────────────┐
│  User Browser   │
│  (React App)    │
└────────┬────────┘
         │ POST /webhook/food-chatbot
         ↓
┌─────────────────┐
│  n8n Workflow   │
│  - Query Class. │
│  - Gemini API   │
│  - Product API  │
│  - Response Fmt │
└────┬───────┬────┘
     │       │
     │       └──────→ ┌──────────────┐
     │                │ Gemini API   │
     │                │ (Google)     │
     │                └──────────────┘
     ↓
┌─────────────────┐
│ Django Backend  │
│ /api/products/  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Database      │
│   (Products)    │
└─────────────────┘
```

## 🚀 Quick Start

### 1. Start All Services

```bash
# Terminal 1: Django Backend
cd backend
python manage.py runserver

# Terminal 2: n8n
npx n8n

# Terminal 3: React App
cd fresh-food-shop
npm run dev
```

### 2. Import n8n Workflow

1. Open http://localhost:5678
2. Import `food-chatbot-workflow.json`
3. Activate the workflow

### 3. Test the Chatbot

1. Open http://localhost:5173
2. Click the chat button (💬)
3. Send a message: "Giá rau củ bao nhiêu?"

**See [QUICK_START.md](QUICK_START.md) for detailed instructions.**

## 📋 Environment Variables

### React Application

```bash
# fresh-food-shop/.env
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/food-chatbot
```

### n8n Workflow

```bash
# n8n environment variables
DJANGO_API_URL=http://localhost:8000
```

### Gemini API

Currently hardcoded in workflow:
```
GEMINI_API_KEY=AIzaSyAKFH-hNkyiaGJxlzM9D4VB1Pwt0zt8tk0
```

**See [n8n-environment-variables.md](n8n-environment-variables.md) for detailed configuration.**

## 🧪 Testing

### Test Queries

**Vietnamese:**
- "Giá rau củ bao nhiêu?" - Price query
- "Hôm nay ăn gì?" - Suggestion query
- "Còn thịt gà không?" - Availability query
- "Thời tiết hôm nay?" - Non-food (should reject)

**English:**
- "How much are vegetables?" - Price query
- "What should I eat today?" - Suggestion query
- "Is chicken available?" - Availability query
- "What's the weather?" - Non-food (should reject)

### Manual Testing Checklist

- [ ] Chat widget appears on all pages
- [ ] Chat window opens/closes smoothly
- [ ] Messages send and receive successfully
- [ ] Loading indicator shows during API calls
- [ ] Bot responds with relevant information
- [ ] Product data displays correctly
- [ ] Error messages show when APIs fail
- [ ] Retry button works after errors
- [ ] Non-food queries are rejected politely

## 📦 Project Files

### Core Files

| File | Description |
|------|-------------|
| `food-chatbot-workflow.json` | n8n workflow definition |
| `fresh-food-shop/src/components/chat/ChatWidget.jsx` | React chat component |
| `fresh-food-shop/src/App.jsx` | ChatWidget integration |
| `fresh-food-shop/src/utils/constants.js` | Configuration constants |
| `fresh-food-shop/.env.example` | Environment variable template |

### Documentation Files

| File | Purpose |
|------|---------|
| `QUICK_START.md` | 5-minute setup guide |
| `DEPLOYMENT_GUIDE.md` | Production deployment |
| `CHATWIDGET_INTEGRATION.md` | Component documentation |
| `n8n-environment-variables.md` | n8n configuration |
| `TASK_8.3_DEPLOYMENT_NOTES.md` | Deployment checklist |
| `FOOD_CHATBOT_README.md` | This file |

### Specification Files

| File | Content |
|------|---------|
| `.kiro/specs/food-chatbot-n8n/requirements.md` | Functional requirements |
| `.kiro/specs/food-chatbot-n8n/design.md` | System design |
| `.kiro/specs/food-chatbot-n8n/tasks.md` | Implementation tasks |

## 🔧 Customization

### Change Chat Widget Colors

Edit `ChatWidget.jsx`:
```jsx
// Change from green to blue
className="bg-green-600" → className="bg-blue-600"
```

### Change Welcome Message

Edit `ChatWidget.jsx`:
```javascript
const [messages, setMessages] = useState([
  {
    id: "welcome-1",
    text: "Your custom welcome message",
    sender: "bot",
    timestamp: Date.now(),
  },
]);
```

### Change Timeout Duration

Edit `ChatWidget.jsx`:
```javascript
// Change from 20 seconds to 30 seconds
setTimeout(() => controller.abort(), 20000) → setTimeout(() => controller.abort(), 30000)
```

**See [CHATWIDGET_INTEGRATION.md](CHATWIDGET_INTEGRATION.md) for more customization options.**

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Chat button not appearing | Check ChatWidget import in App.jsx |
| No response from bot | Verify n8n workflow is active |
| CORS errors | Add n8n URL to Django CORS settings |
| Product data not showing | Check Django API is accessible |
| Timeout errors | Increase timeout values in n8n nodes |

**See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) → Troubleshooting for detailed solutions.**

## 📊 Implementation Status

### Completed Tasks ✅

- [x] n8n workflow foundation
- [x] Query classification
- [x] Gemini API integration
- [x] Django product API integration
- [x] Response formatting
- [x] Error handling
- [x] React ChatWidget component
- [x] ChatWidget integration in App.jsx
- [x] Environment variables configuration
- [x] Documentation

### Pending Tasks 📝

- [ ] Deploy n8n workflow to production (manual)
- [ ] Write integration tests (optional)
- [ ] Write property-based tests (optional)
- [ ] Write unit tests (optional)

**See [.kiro/specs/food-chatbot-n8n/tasks.md](.kiro/specs/food-chatbot-n8n/tasks.md) for complete task list.**

## 🔒 Security Considerations

1. **API Keys**: Store securely, rotate periodically
2. **CORS**: Only allow trusted domains
3. **Rate Limiting**: Implement on webhook endpoint
4. **Input Validation**: Validate all user inputs
5. **HTTPS**: Use HTTPS in production

**See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) → Security Considerations for details.**

## 📈 Monitoring

### What to Monitor

1. **n8n Execution Logs**: Check for failed executions
2. **Django API Logs**: Monitor product API requests
3. **React Application**: Track failed webhook requests
4. **Gemini API**: Monitor quota and rate limits

**See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) → Monitoring and Maintenance for details.**

## 🎓 Learning Resources

- **n8n Documentation**: https://docs.n8n.io/
- **Gemini API Documentation**: https://ai.google.dev/docs
- **Django REST Framework**: https://www.django-rest-framework.org/
- **React Documentation**: https://react.dev/
- **Vite Documentation**: https://vitejs.dev/

## 🤝 Contributing

When making changes to the chatbot:

1. Update the relevant documentation
2. Test in development environment
3. Update the workflow JSON if needed
4. Document any new environment variables
5. Update the task list in `tasks.md`

## 📞 Support

For issues or questions:

1. Check the troubleshooting sections in the guides
2. Review n8n execution logs
3. Check browser console for errors
4. Review Django logs for API errors
5. Consult the specification documents

## 🎉 Success Criteria

The chatbot is working correctly when:

- ✅ Chat widget appears on all pages
- ✅ Users can send and receive messages
- ✅ Bot responds to food-related queries
- ✅ Bot rejects non-food queries politely
- ✅ Product information displays correctly
- ✅ Errors are handled gracefully
- ✅ Loading states are shown appropriately

## 📝 License

This feature is part of the Fresh Food Shop project.

## 🙏 Acknowledgments

- **n8n**: Workflow automation platform
- **Google Gemini**: AI language model
- **Django**: Backend framework
- **React**: Frontend framework

---

**Ready to get started?** → See [QUICK_START.md](QUICK_START.md)

**Ready to deploy?** → See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

**Need help?** → Check the troubleshooting sections in each guide
