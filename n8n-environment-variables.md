# n8n Environment Variables Configuration

This document describes the environment variables required for the Food Chatbot n8n workflow.

## Required Environment Variables

### 1. DJANGO_API_URL

**Purpose**: Base URL for the Django backend API to fetch product data

**Example Values:**
- Development: `http://localhost:8000`
- Production: `https://api.freshfoodshop.com`

**Used By**: Django Product API node in the workflow

**How to Set:**

#### Option A: n8n Environment Variables (Recommended)
1. Open n8n web interface
2. Go to Settings → Environment Variables
3. Click "Add Variable"
4. Name: `DJANGO_API_URL`
5. Value: Your Django API URL
6. Save

#### Option B: System Environment Variables
```bash
# Linux/Mac
export DJANGO_API_URL=http://localhost:8000

# Windows
set DJANGO_API_URL=http://localhost:8000
```

#### Option C: Docker Compose
```yaml
services:
  n8n:
    environment:
      - DJANGO_API_URL=http://django:8000
```

### 2. GEMINI_API_KEY

**Purpose**: Authentication key for Google Gemini 2.0 Flash API

**Current Value**: `AIzaSyAKFH-hNkyiaGJxlzM9D4VB1Pwt0zt8tk0`

**Status**: Currently hardcoded in the workflow JSON as a query parameter

**Used By**: Gemini API Request node

**Security Note**: For production, it's recommended to use n8n credentials instead of hardcoding the API key.

**How to Migrate to Environment Variable:**

1. Set the environment variable in n8n:
   ```bash
   GEMINI_API_KEY=AIzaSyAKFH-hNkyiaGJxlzM9D4VB1Pwt0zt8tk0
   ```

2. Update the Gemini API Request node:
   - Open the workflow in n8n editor
   - Select "Gemini API Request" node
   - In Query Parameters, change the `key` value from hardcoded string to:
     ```
     {{ $env.GEMINI_API_KEY }}
     ```
   - Save the workflow

**Alternative: Using n8n Credentials (Most Secure)**

1. Create a new credential in n8n:
   - Go to Credentials → Add Credential
   - Select "Header Auth" or "Generic Credential Type"
   - Add the API key

2. Update the node to use the credential instead of query parameter

## Verification

After setting environment variables, verify they are accessible:

1. Create a test workflow with a Function node:
   ```javascript
   return {
     json: {
       djangoUrl: $env.DJANGO_API_URL,
       geminiKeySet: !!$env.GEMINI_API_KEY
     }
   };
   ```

2. Execute the workflow and check the output

## Workflow Configuration Summary

| Node Name | Environment Variable | Default/Current Value | Required |
|-----------|---------------------|----------------------|----------|
| Django Product API | `DJANGO_API_URL` | `http://localhost:8000` | Yes |
| Gemini API Request | `GEMINI_API_KEY` | `AIzaSyAKFH-hNkyiaGJxlzM9D4VB1Pwt0zt8tk0` | Yes (hardcoded) |

## Troubleshooting

### Environment variable not found
- Restart n8n after setting environment variables
- Check variable name spelling (case-sensitive)
- Verify variable is set in the correct scope (system vs. n8n)

### Django API connection fails
- Verify `DJANGO_API_URL` is accessible from n8n instance
- Check network connectivity
- Verify CORS settings in Django allow n8n requests
- Test the URL manually: `curl $DJANGO_API_URL/api/products/`

### Gemini API authentication fails
- Verify API key is correct and active
- Check API key has not expired
- Verify API key has necessary permissions
- Check Google Cloud Console for API quota and limits

## Production Checklist

- [ ] Set `DJANGO_API_URL` to production Django API URL
- [ ] Verify Gemini API key is valid and has sufficient quota
- [ ] Consider migrating Gemini API key to n8n credentials
- [ ] Set up monitoring for API failures
- [ ] Configure rate limiting
- [ ] Enable HTTPS for all API endpoints
- [ ] Review and restrict CORS settings
- [ ] Set up backup API keys if available
- [ ] Document API key rotation procedure

## Related Documentation

- Main deployment guide: `DEPLOYMENT_GUIDE.md`
- n8n workflow file: `food-chatbot-workflow.json`
- React environment variables: `fresh-food-shop/.env.example`
