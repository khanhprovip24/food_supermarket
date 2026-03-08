# Design Document: Food Chatbot n8n

## Overview

The food chatbot feature integrates a conversational AI into the fresh food e-commerce website using n8n workflow automation and Google Gemini 2.5 Flash. The system processes user queries, validates they are food-related, retrieves product data from the Django backend, and returns contextual responses through a React chat interface.

## Architecture

### System Components

```mermaid
graph TB
    User[User Browser] --> ChatUI[React Chat Interface]
    ChatUI --> Webhook[n8n Webhook Trigger]
    Webhook --> Classifier[Query Classification Node]
    Classifier --> Gemini[Gemini API Node]
    Classifier --> ProductAPI[Django Product API Node]
    ProductAPI --> Django[Django Backend]
    Gemini --> ResponseFormatter[Response Formatter Node]
    ProductAPI --> ResponseFormatter
    ResponseFormatter --> WebhookResponse[Webhook Response]
    WebhookResponse --> ChatUI
```

### Component Responsibilities

1. **React Chat Interface**: Captures user input, displays conversation history, handles loading states
2. **n8n Webhook Trigger**: Receives POST requests with user messages
3. **Query Classification Node**: Determines if query is food-related and what type (suggestion, price, availability)
4. **Gemini API Node**: Processes natural language queries and generates responses
5. **Django Product API Node**: Retrieves product data (prices, availability, categories)
6. **Response Formatter Node**: Combines Gemini output with product data into final response
7. **Webhook Response**: Returns formatted JSON response to chat interface

## Components and Interfaces

### n8n Workflow Nodes

#### 1. Webhook Trigger Node
```javascript
// Input Schema
{
  "message": string,      // User's query
  "sessionId": string,    // Optional session identifier
  "timestamp": number     // Unix timestamp
}

// Output
{
  "message": string,
  "sessionId": string,
  "timestamp": number
}
```

#### 2. Query Classification Node (Function Node)
```javascript
// Classifies query type and extracts intent
function classifyQuery(message) {
  const lowerMessage = message.toLowerCase();
  
  // Check for price queries
  if (lowerMessage.includes('giá') || lowerMessage.includes('bao nhiêu') || 
      lowerMessage.includes('price') || lowerMessage.includes('cost')) {
    return { type: 'price', needsProductData: true };
  }
  
  // Check for suggestion queries
  if (lowerMessage.includes('ăn gì') || lowerMessage.includes('ăn j') || 
      lowerMessage.includes('what should i eat') || lowerMessage.includes('suggest')) {
    return { type: 'suggestion', needsProductData: true };
  }
  
  // Check for availability queries
  if (lowerMessage.includes('còn') || lowerMessage.includes('available') || 
      lowerMessage.includes('in stock')) {
    return { type: 'availability', needsProductData: true };
  }
  
  // Default to general food query
  return { type: 'general', needsProductData: false };
}
```

#### 3. Gemini API Node (HTTP Request)
```javascript
// Configuration
{
  "method": "POST",
  "url": "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
  "authentication": "genericCredentialType",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "contents": [{
      "parts": [{
        "text": "{{$json.prompt}}"
      }]
    }],
    "generationConfig": {
      "temperature": 0.7,
      "maxOutputTokens": 256
    }
  },
  "queryParameters": {
    "key": "AIzaSyAKFH-hNkyiaGJxlzM9D4VB1Pwt0zt8tk0"
  }
}

// System Prompt Template
const systemPrompt = `You are a helpful food chatbot for a Vietnamese fresh food e-commerce website.

RULES:
1. ONLY answer questions related to food, cooking, recipes, and food products
2. If asked about non-food topics, politely decline and redirect to food topics
3. Keep responses concise and helpful
4. Use Vietnamese when the user speaks Vietnamese, English when they speak English
5. When suggesting dishes, prefer Vietnamese cuisine

User query: {{$json.message}}

${queryType === 'price' ? 'Available products: {{$json.products}}' : ''}
${queryType === 'suggestion' ? 'Available products: {{$json.products}}' : ''}
${queryType === 'availability' ? 'Product inventory: {{$json.products}}' : ''}

Respond naturally and helpfully.`;
```

#### 4. Django Product API Node (HTTP Request)
```javascript
// Configuration
{
  "method": "GET",
  "url": "{{$env.DJANGO_API_URL}}/api/products/",
  "queryParameters": {
    "search": "{{$json.extractedKeywords}}",
    "category": "{{$json.category}}",
    "in_stock": "true"
  }
}

// Response Schema
{
  "products": [
    {
      "id": number,
      "name": string,
      "price": number,
      "currency": string,
      "unit": string,
      "category": string,
      "in_stock": boolean,
      "description": string
    }
  ]
}
```

#### 5. Response Formatter Node (Function Node)
```javascript
function formatResponse(geminiResponse, productData, queryType) {
  const response = {
    message: "",
    products: [],
    timestamp: Date.now()
  };
  
  // Extract Gemini's text response
  const geminiText = geminiResponse.candidates[0].content.parts[0].text;
  
  // Check if response indicates non-food query
  if (geminiText.includes('không thể trả lời') || 
      geminiText.includes('cannot answer') ||
      geminiText.includes('not related to food')) {
    response.message = "Xin lỗi, tôi chỉ có thể trả lời các câu hỏi về thực phẩm. Bạn có câu hỏi nào về sản phẩm thực phẩm của chúng tôi không?";
    return response;
  }
  
  // Format based on query type
  if (queryType === 'price' && productData && productData.products.length > 0) {
    response.message = geminiText;
    response.products = productData.products.slice(0, 5).map(p => ({
      name: p.name,
      price: `${p.price.toLocaleString()} ${p.currency}/${p.unit}`,
      available: p.in_stock
    }));
  } else if (queryType === 'suggestion' && productData && productData.products.length > 0) {
    response.message = geminiText;
    response.products = productData.products.slice(0, 3).map(p => ({
      name: p.name,
      category: p.category
    }));
  } else {
    response.message = geminiText;
  }
  
  return response;
}
```

### React Chat Interface Component

```typescript
// ChatWidget.tsx
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: number;
  products?: Array<{
    name: string;
    price?: string;
    category?: string;
    available?: boolean;
  }>;
}

interface ChatWidgetProps {
  n8nWebhookUrl: string;
}

// Component manages:
// - Message history state
// - Input field state
// - Loading state
// - Error state
// - API calls to n8n webhook
```

## Data Models

### Message Flow Data Structure

```typescript
// Frontend to n8n
interface ChatRequest {
  message: string;
  sessionId?: string;
  timestamp: number;
}

// n8n to Frontend
interface ChatResponse {
  message: string;
  products?: Array<{
    name: string;
    price?: string;
    category?: string;
    available?: boolean;
  }>;
  timestamp: number;
  error?: string;
}

// n8n Internal: Product Query Result
interface ProductQueryResult {
  products: Array<{
    id: number;
    name: string;
    price: number;
    currency: string;
    unit: string;
    category: string;
    in_stock: boolean;
    description: string;
  }>;
}

// n8n Internal: Query Classification
interface QueryClassification {
  type: 'price' | 'suggestion' | 'availability' | 'general';
  needsProductData: boolean;
  extractedKeywords?: string[];
  category?: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Food Query Response Completeness
*For any* food-related query (suggestions, prices, availability), the chatbot should return a response that contains relevant information from the product database and addresses the user's question.
**Validates: Requirements 1.1, 1.2, 1.3, 1.4**

### Property 2: Non-Food Query Rejection
*For any* non-food-related query, the chatbot should reject it with a polite message and not provide information outside the food domain.
**Validates: Requirements 2.1**

### Property 3: Rejection Message Consistency
*For any* set of non-food queries, all rejection messages should follow the same format and tone.
**Validates: Requirements 2.3**

### Property 4: Webhook Message Reception
*For any* valid chat message sent to the webhook endpoint, the n8n workflow should successfully receive and process it.
**Validates: Requirements 3.1**

### Property 5: Response Format Validity
*For any* query processed by the workflow, the returned response should conform to the ChatResponse schema with required fields (message, timestamp).
**Validates: Requirements 3.4, 4.3**

### Property 6: Product Data Completeness
*For any* query requiring product information, the retrieved product data should include all required fields (name, price, currency, unit, category, in_stock).
**Validates: Requirements 5.1, 5.2**

### Property 7: Price Format Consistency
*For any* price query response, all listed prices should include currency symbols and units in a consistent format.
**Validates: Requirements 5.3, 7.2**

### Property 8: Alternative Product Suggestions
*For any* query about an unavailable product, the response should include suggestions for alternative products from the same category.
**Validates: Requirements 5.4**

### Property 9: Suggestion Availability
*For any* dish suggestion response, all recommended products should be currently in stock.
**Validates: Requirements 7.1**

### Property 10: Product List Limit
*For any* query that matches multiple products, the response should list at most 5 products.
**Validates: Requirements 7.4**

### Property 11: Error Logging
*For any* error that occurs in the workflow (API failures, validation errors, timeouts), the error should be logged with sufficient detail for debugging.
**Validates: Requirements 8.4**

## Error Handling

### Error Categories

1. **External API Errors**
   - Gemini API unavailable (503, timeout)
   - Gemini API authentication failure (401, 403)
   - Gemini API rate limiting (429)
   - Django backend API unavailable

2. **Validation Errors**
   - Empty user input
   - Invalid message format
   - Malformed product data from backend

3. **Workflow Errors**
   - Node execution failures
   - Data transformation errors
   - Response formatting errors

### Error Handling Strategy

```javascript
// n8n Error Handler Node
function handleError(error, context) {
  // Log error with context
  console.error({
    timestamp: Date.now(),
    errorType: error.type,
    message: error.message,
    context: context,
    stack: error.stack
  });
  
  // Determine user-facing message
  let userMessage = "";
  
  if (error.type === 'GEMINI_API_ERROR') {
    userMessage = "Xin lỗi, hệ thống tạm thời không khả dụng. Vui lòng thử lại sau.";
  } else if (error.type === 'PRODUCT_API_ERROR') {
    userMessage = "Xin lỗi, không thể lấy thông tin sản phẩm lúc này. Vui lòng thử lại.";
  } else if (error.type === 'VALIDATION_ERROR') {
    userMessage = "Vui lòng nhập câu hỏi hợp lệ về thực phẩm.";
  } else {
    userMessage = "Đã xảy ra lỗi. Vui lòng thử lại.";
  }
  
  return {
    message: userMessage,
    timestamp: Date.now(),
    error: true
  };
}
```

### Timeout Configuration

- Gemini API timeout: 10 seconds
- Django API timeout: 5 seconds
- Total workflow timeout: 15 seconds
- Frontend timeout: 20 seconds (allows for retries)

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage:

**Unit Tests** focus on:
- Specific example queries and expected responses
- Edge cases (empty input, special characters, very long queries)
- Error conditions (API failures, timeouts, invalid data)
- Integration points between React component and n8n webhook

**Property-Based Tests** focus on:
- Universal properties that hold for all food queries
- Response format consistency across random inputs
- Error handling behavior across various failure scenarios
- Data validation across randomly generated product data

### Property-Based Testing Configuration

- **Framework**: fast-check (JavaScript/TypeScript)
- **Minimum iterations**: 100 per property test
- **Test tagging format**: `Feature: food-chatbot-n8n, Property {number}: {property_text}`

### Test Coverage Areas

1. **n8n Workflow Logic**
   - Query classification accuracy
   - Product data retrieval
   - Response formatting
   - Error handling paths

2. **React Chat Interface**
   - Message sending and receiving
   - Loading state management
   - Error display
   - Message history rendering

3. **Integration Tests**
   - End-to-end message flow
   - Webhook communication
   - Product API integration
   - Gemini API integration

### Example Property Test Structure

```typescript
// Property Test Example
import fc from 'fast-check';

// Feature: food-chatbot-n8n, Property 1: Food Query Response Completeness
describe('Food Query Response Completeness', () => {
  it('should return relevant responses for all food queries', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('what should I eat today'),
          fc.constant('how much are vegetables'),
          fc.constant('is chicken available'),
          fc.string().filter(s => s.includes('food') || s.includes('price'))
        ),
        async (query) => {
          const response = await sendChatMessage(query);
          expect(response.message).toBeDefined();
          expect(response.message.length).toBeGreaterThan(0);
          expect(response.timestamp).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Manual Testing Checklist

Since this involves n8n workflow configuration and external APIs, manual testing is required for:

- [ ] n8n workflow deployment and activation
- [ ] Gemini API key configuration
- [ ] Django backend API connectivity
- [ ] Chat widget UI/UX validation
- [ ] Vietnamese language response quality
- [ ] Mobile responsiveness

### Test Data Requirements

- Sample product database with various categories
- Test queries in both Vietnamese and English
- Edge case inputs (empty, very long, special characters)
- Mock responses for Gemini API (for unit tests)
- Mock product data (for isolated testing)
