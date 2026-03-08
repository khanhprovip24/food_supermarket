# Task 8.3: Deploy n8n Workflow - Manual Steps Required

## Status: Documentation Complete, Manual Deployment Required

Task 8.3 involves deploying the n8n workflow to a production environment. This is a **manual deployment task** that requires access to a production n8n instance.

## What Has Been Completed

✅ **Documentation**:
- Comprehensive deployment guide created (`DEPLOYMENT_GUIDE.md`)
- Environment variables documented (`n8n-environment-variables.md`)
- Quick start guide for development (`QUICK_START.md`)
- ChatWidget integration documented (`CHATWIDGET_INTEGRATION.md`)

✅ **Configuration Files**:
- n8n workflow JSON ready for import (`food-chatbot-workflow.json`)
- React environment variables configured (`.env.example`)
- Constants file properly set up (`src/utils/constants.js`)

✅ **Development Setup**:
- ChatWidget integrated in App.jsx
- All environment variables documented
- Testing procedures documented

## What Requires Manual Action

The following steps from task 8.3 require manual deployment to a production environment:

### 1. Activate workflow in n8n instance

**Action Required**: Import and activate the workflow in your production n8n instance

**Steps**:
1. Access your production n8n instance
2. Go to Workflows → Import from File
3. Select `food-chatbot-workflow.json`
4. Click Import
5. Set environment variable `DJANGO_API_URL` to production Django URL
6. Click "Active" toggle to activate the workflow

**Documentation**: See `DEPLOYMENT_GUIDE.md` → Step 2: Import and Configure n8n Workflow

### 2. Verify webhook URL is accessible

**Action Required**: Test the production webhook endpoint

**Steps**:
1. Note the webhook URL from n8n (e.g., `https://your-n8n-instance.com/webhook/food-chatbot`)
2. Test with curl:
   ```bash
   curl -X POST https://your-n8n-instance.com/webhook/food-chatbot \
     -H "Content-Type: application/json" \
     -d '{"message":"test","sessionId":"test","timestamp":1234567890}'
   ```
3. Verify you receive a valid JSON response

**Documentation**: See `DEPLOYMENT_GUIDE.md` → Step 2: Import and Configure n8n Workflow → Test the webhook

### 3. Test with production Django API

**Action Required**: Verify n8n can communicate with production Django API

**Steps**:
1. Set `DJANGO_API_URL` environment variable in n8n to production URL
2. Send a test message that requires product data (e.g., "Giá rau củ bao nhiêu?")
3. Check n8n execution logs to verify:
   - Django Product API node executes successfully
   - Product data is retrieved
   - Response includes product information

**Documentation**: See `DEPLOYMENT_GUIDE.md` → Troubleshooting → Product data not showing

### 4. Test with production Gemini API

**Action Required**: Verify Gemini API integration works in production

**Steps**:
1. Verify `GEMINI_API_KEY` is set correctly in the workflow
2. Send test messages through the webhook
3. Check n8n execution logs to verify:
   - Gemini API Request node executes successfully
   - Responses are received from Gemini
   - No authentication or rate limit errors

**Documentation**: See `DEPLOYMENT_GUIDE.md` → Troubleshooting → Gemini API errors

## Prerequisites for Deployment

Before deploying to production, ensure you have:

- [ ] Access to production n8n instance
- [ ] Production Django API URL
- [ ] Valid Gemini API key with sufficient quota
- [ ] CORS configured in Django to allow n8n requests
- [ ] HTTPS enabled for all endpoints (recommended)
- [ ] Monitoring and logging set up

## Deployment Checklist

Use this checklist when performing the manual deployment:

### Pre-Deployment
- [ ] Review `DEPLOYMENT_GUIDE.md`
- [ ] Verify all environment variables are documented
- [ ] Test workflow in development environment
- [ ] Backup existing n8n workflows (if any)

### Deployment
- [ ] Import `food-chatbot-workflow.json` to production n8n
- [ ] Set `DJANGO_API_URL` environment variable
- [ ] Verify `GEMINI_API_KEY` in workflow
- [ ] Activate the workflow
- [ ] Note the production webhook URL

### Testing
- [ ] Test webhook URL with curl
- [ ] Send test message requiring product data
- [ ] Verify Django API integration works
- [ ] Verify Gemini API integration works
- [ ] Test error scenarios (API failures, timeouts)
- [ ] Check n8n execution logs for errors

### Post-Deployment
- [ ] Update React app `.env` with production webhook URL
- [ ] Deploy React app with updated environment variable
- [ ] Test end-to-end from React app
- [ ] Monitor n8n execution logs
- [ ] Set up alerts for workflow failures

## Environment Variables Summary

### Production n8n
```bash
DJANGO_API_URL=https://api.yourproductiondomain.com
```

### Production React App
```bash
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/food-chatbot
```

### Gemini API Key
Currently hardcoded in workflow: `AIzaSyAKFH-hNkyiaGJxlzM9D4VB1Pwt0zt8tk0`

## Testing Commands

### Test Production Webhook
```bash
curl -X POST https://your-n8n-instance.com/webhook/food-chatbot \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Giá rau củ bao nhiêu?",
    "sessionId": "test-prod-123",
    "timestamp": 1234567890
  }'
```

### Test Django API from n8n Server
```bash
curl https://api.yourproductiondomain.com/api/products/
```

### Test Gemini API
```bash
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Test message"
      }]
    }]
  }'
```

## Monitoring

After deployment, monitor:

1. **n8n Execution Logs**
   - Check for failed executions
   - Monitor response times
   - Watch for API errors

2. **Django API Logs**
   - Monitor product API requests from n8n
   - Check for CORS errors
   - Watch for performance issues

3. **React Application**
   - Monitor browser console for errors
   - Track failed webhook requests
   - Collect user feedback

## Rollback Plan

If deployment fails:

1. Deactivate the workflow in n8n
2. Revert React app environment variable to previous value
3. Investigate errors in n8n execution logs
4. Fix issues and retry deployment

## Support Resources

- **Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Environment Variables**: `n8n-environment-variables.md`
- **Quick Start**: `QUICK_START.md`
- **Integration Docs**: `CHATWIDGET_INTEGRATION.md`
- **n8n Documentation**: https://docs.n8n.io/
- **Gemini API Docs**: https://ai.google.dev/docs

## Conclusion

Task 8.3 documentation is complete. The actual deployment requires:
1. Access to production infrastructure
2. Manual import and activation of the workflow
3. Configuration of production environment variables
4. Testing and verification

All necessary documentation and configuration files have been provided to support the deployment process.

## Next Steps

1. **For Development**: Use `QUICK_START.md` to test locally
2. **For Production**: Follow `DEPLOYMENT_GUIDE.md` step-by-step
3. **For Troubleshooting**: Refer to troubleshooting sections in guides
4. **For Customization**: See `CHATWIDGET_INTEGRATION.md`

The system is ready for deployment when you have access to production infrastructure.
