# Food Chatbot Deployment Guide

This guide provides step-by-step instructions for deploying the food chatbot feature that integrates n8n workflow automation with the Fresh Food Shop application.

## Overview

The food chatbot system consists of three main components:
1. **React Frontend** (Fresh Food Shop) - User interface with ChatWidget
2. **n8n Workflow** - Orchestrates chatbot logic and API calls
3. **Django Backend** - Provides product data via REST API

## Prerequisites

- Node.js 16+ and npm/yarn
- n8n instance (self-hosted or cloud)
- Django backend running and accessible
- Google Gemini API key

## Environment Variables

### 1. React Application (Fresh Food Shop)

Create a `.env` file in the `fresh-food-shop` directory:

```bash
# n8n Webhook URL for Food Chatbot
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/food-chatbot
```

**Configuration Details:**
- **Variable**: `VITE_N8N_WEBHOOK_URL`
- **Purpose**: URL endpoint for the n8n webhook that processes chat messages
- **Default**: `http://localhost:5678/webhook/food-chatbot`
- **Production**: Replace with your deployed n8n webhook URL (e.g., `https://your-n8n-instance.com/webhook/food-chatbot`)
- **Used in**: `src/utils/constants.js` - imported by ChatWidget component

**How to set:**
1. Copy `.env.example` to `.env`:
   ```bash
   cd fresh-food-shop
   cp .env.example .env
   ```
2. Edit `.env` and update the URL to match your n8n instance
3. Restart the development server for changes to take effect

### 2. n8n Workflow

The n8n workflow requires two environment variables to be set in your n8n instance:

#### a. Django API URL

```bash
DJANGO_API_URL=http://localhost:8000
```

**Configuration Details:**
- **Variable**: `DJANGO_API_URL`
- **Purpose**: Base URL for the Django backend API to fetch product data
- **Default**: `http://localhost:8000`
- **Production**: Replace with your deployed Django API URL (e.g., `https://api.freshfoodshop.com`)
- **Used in**: "Django Product API" node in the workflow

**How to set in n8n:**
1. Go to n8n Settings → Environment Variables
2. Add new variable: `DJANGO_API_URL`
3. Set value to your Django backend URL
4. Save and restart n8n if required

#### b. Gemini API Key

```bash
GEMINI_API_KEY=AIzaSyAKFH-hNkyiaGJxlzM9D4VB1Pwt0zt8tk0
```

**Configuration Details:**
- **Variable**: `GEMINI_API_KEY`
- **Purpose**: Authentication key for Google Gemini 2.0 Flash API
- **Current Key**: `AIzaSyAKFH-hNkyiaGJxlzM9D4VB1Pwt0zt8tk0` (embedded in workflow)
- **Used in**: "Gemini API Request" node as query parameter
- **Note**: The API key is currently hardcoded in the workflow JSON. For better security, consider using n8n credentials or environment variables.

**How to update the API key:**
1. Open the n8n workflow editor
2. Select the "Gemini API Request" node
3. Update the `key` query parameter value
4. Save the workflow

**Alternative (using environment variable):**
1. Set `GEMINI_API_KEY` in n8n environment variables
2. Update the workflow node to use `{{ $env.GEMINI_API_KEY }}`
3. Save the workflow

## Deployment Steps

### Step 1: Deploy Django Backend

Ensure your Django backend is running and accessible:

1. Verify the `/api/products/` endpoint is working:
   ```bash
   curl http://localhost:8000/api/products/
   ```

2. Check that products have the required fields:
   - `name`, `price`, `currency`, `unit`, `category`, `in_stock`

3. Enable CORS if n8n and Django are on different domains:
   ```python
   # settings.py
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:5678",  # n8n
       "http://localhost:5173",  # React dev server
   ]
   ```

### Step 2: Import and Configure n8n Workflow

1. **Import the workflow:**
   - Open n8n web interface
   - Go to Workflows → Import from File
   - Select `food-chatbot-workflow.json`
   - Click Import

2. **Configure environment variables:**
   - Set `DJANGO_API_URL` in n8n settings (see above)
   - Verify `GEMINI_API_KEY` in the Gemini API Request node

3. **Activate the workflow:**
   - Open the imported workflow
   - Click "Active" toggle in the top right
   - Verify the webhook URL is displayed (e.g., `http://localhost:5678/webhook/food-chatbot`)

4. **Test the webhook:**
   ```bash
   curl -X POST http://localhost:5678/webhook/food-chatbot \
     -H "Content-Type: application/json" \
     -d '{
       "message": "Giá rau củ bao nhiêu?",
       "sessionId": "test-123",
       "timestamp": 1234567890
     }'
   ```

### Step 3: Configure React Application

1. **Set environment variable:**
   ```bash
   cd fresh-food-shop
   cp .env.example .env
   # Edit .env and set VITE_N8N_WEBHOOK_URL
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Verify ChatWidget integration:**
   - Open http://localhost:5173
   - Click the chat button (💬) in the bottom right
   - Send a test message
   - Verify the response from the chatbot

### Step 4: Production Deployment

#### React Application

1. **Update environment variable for production:**
   ```bash
   # .env.production
   VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/food-chatbot
   ```

2. **Build for production:**
   ```bash
   npm run build
   ```

3. **Deploy the `dist` folder** to your hosting service (Vercel, Netlify, etc.)

#### n8n Workflow

1. **Update DJANGO_API_URL** to production Django URL
2. **Ensure webhook is accessible** from the internet
3. **Configure HTTPS** for secure communication
4. **Set up monitoring** for workflow execution errors

#### Django Backend

1. **Update CORS settings** to allow production domains:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "https://your-n8n-instance.com",
       "https://your-frontend-domain.com",
   ]
   ```

2. **Ensure API is accessible** from n8n instance
3. **Configure rate limiting** to prevent abuse

## Testing

### Manual Testing Checklist

- [ ] Chat widget appears on the page
- [ ] Chat widget opens when clicked
- [ ] User can send messages
- [ ] Loading indicator appears while waiting for response
- [ ] Bot responds to food-related queries
- [ ] Bot rejects non-food queries with polite message
- [ ] Product suggestions display correctly
- [ ] Price information displays with currency and units
- [ ] Error messages display when APIs fail
- [ ] Retry button works after errors

### Test Queries

**Vietnamese:**
- "Giá rau củ bao nhiêu?" (Price query)
- "Hôm nay ăn gì?" (Suggestion query)
- "Còn thịt gà không?" (Availability query)
- "Thời tiết hôm nay thế nào?" (Non-food query - should be rejected)

**English:**
- "How much are vegetables?" (Price query)
- "What should I eat today?" (Suggestion query)
- "Is chicken available?" (Availability query)
- "What's the weather like?" (Non-food query - should be rejected)

## Troubleshooting

### ChatWidget not appearing
- Check that ChatWidget is imported in App.jsx
- Verify N8N_WEBHOOK_URL is set in .env
- Check browser console for errors

### No response from chatbot
- Verify n8n workflow is active
- Check n8n execution logs for errors
- Test webhook URL directly with curl
- Verify DJANGO_API_URL is correct

### Product data not showing
- Check Django API is accessible from n8n
- Verify products exist in database
- Check n8n execution logs for Product API errors
- Verify CORS settings allow n8n requests

### Gemini API errors
- Verify API key is correct and active
- Check API quota and rate limits
- Review n8n execution logs for specific error codes
- Ensure internet connectivity from n8n instance

### Timeout errors
- Increase timeout values in n8n nodes (currently 10s for Gemini, 5s for Django)
- Check network latency between services
- Verify APIs are responding within timeout limits

## Monitoring and Maintenance

### n8n Workflow Monitoring

1. **Check execution history:**
   - Go to Executions tab in n8n
   - Review failed executions
   - Check error logs

2. **Set up alerts:**
   - Configure n8n to send notifications on workflow failures
   - Monitor webhook response times

### Application Monitoring

1. **Frontend errors:**
   - Monitor browser console errors
   - Track failed API calls
   - Monitor user feedback

2. **Backend performance:**
   - Monitor Django API response times
   - Track product API query performance
   - Monitor database query efficiency

## Security Considerations

1. **API Keys:**
   - Store Gemini API key securely (use n8n credentials)
   - Rotate API keys periodically
   - Monitor API usage for anomalies

2. **CORS Configuration:**
   - Only allow trusted domains
   - Use specific origins instead of wildcards
   - Review CORS settings regularly

3. **Rate Limiting:**
   - Implement rate limiting on webhook endpoint
   - Limit requests per user/session
   - Monitor for abuse patterns

4. **Input Validation:**
   - Validate all user inputs in the workflow
   - Sanitize data before passing to APIs
   - Implement message length limits

## Support and Resources

- **n8n Documentation**: https://docs.n8n.io/
- **Gemini API Documentation**: https://ai.google.dev/docs
- **Django REST Framework**: https://www.django-rest-framework.org/
- **Vite Environment Variables**: https://vitejs.dev/guide/env-and-mode.html

## Summary

The food chatbot is now integrated and ready for deployment. The key configuration points are:

1. **React App**: Set `VITE_N8N_WEBHOOK_URL` in `.env`
2. **n8n Workflow**: Set `DJANGO_API_URL` environment variable
3. **n8n Workflow**: Verify `GEMINI_API_KEY` in Gemini API Request node
4. **ChatWidget**: Already integrated in `App.jsx` with proper props

All environment variables are documented and the deployment process is straightforward. Follow the testing checklist to verify everything works correctly before going to production.
