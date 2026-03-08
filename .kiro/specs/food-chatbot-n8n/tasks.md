# Implementation Plan: Food Chatbot n8n

## Overview

This implementation plan breaks down the food chatbot feature into discrete coding tasks. The approach follows an incremental build: first establishing the n8n workflow structure, then implementing the React chat interface, and finally integrating with external APIs and adding comprehensive testing.

## Tasks

- [x] 1. Set up n8n workflow foundation
  - [x] 1.1 Create n8n workflow with webhook trigger node
    - Configure webhook to accept POST requests with JSON body
    - Set webhook path to `/webhook/food-chatbot`
    - Define input schema: `{ message: string, sessionId?: string, timestamp: number }`
    - _Requirements: 3.1_
  
  - [x] 1.2 Implement query classification function node
    - Create JavaScript function to classify query types (price, suggestion, availability, general)
    - Extract keywords from user messages
    - Detect Vietnamese and English food-related terms
    - Output classification result with `needsProductData` flag
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  
  - [ ]* 1.3 Write unit tests for query classification
    - Test Vietnamese queries: "giá rau", "hôm nay ăn gì", "còn thịt không"
    - Test English queries: "vegetable price", "what to eat", "chicken available"
    - Test edge cases: empty strings, special characters, very long queries
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Integrate Gemini API
  - [x] 2.1 Create Gemini API HTTP request node
    - Configure POST request to `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
    - Add API key as query parameter: `AIzaSyAKFH-hNkyiaGJxlzM9D4VB1Pwt0zt8tk0`
    - Set request headers: `Content-Type: application/json`
    - Configure request body with system prompt and user message
    - _Requirements: 4.1, 4.2_
  
  - [x] 2.2 Implement system prompt template
    - Create prompt that constrains responses to food topics only
    - Include instructions to reject non-food queries politely
    - Support both Vietnamese and English responses
    - Include product data in prompt when available
    - _Requirements: 2.1, 4.2_
  
  - [x] 2.3 Add Gemini response validation
    - Parse Gemini API response JSON
    - Extract text from `candidates[0].content.parts[0].text`
    - Validate response structure
    - Handle missing or malformed responses
    - _Requirements: 4.3_
  
  - [ ]* 2.4 Write property test for non-food query rejection
    - **Property 2: Non-Food Query Rejection**
    - **Validates: Requirements 2.1**
    - Generate random non-food queries (weather, sports, politics, math)
    - Verify all responses contain rejection messages
    - _Requirements: 2.1_
  
  - [ ]* 2.5 Write property test for rejection message consistency
    - **Property 3: Rejection Message Consistency**
    - **Validates: Requirements 2.3**
    - Generate multiple non-food queries
    - Verify all rejection messages follow same format
    - _Requirements: 2.3_

- [x] 3. Integrate Django product API
  - [x] 3.1 Create product API HTTP request node
    - Configure GET request to Django backend `/api/products/`
    - Add query parameters: `search`, `category`, `in_stock`
    - Set timeout to 5 seconds
    - Parse response JSON into product array
    - _Requirements: 5.1, 5.2_
  
  - [x] 3.2 Implement conditional routing for product queries
    - Add IF node to check `needsProductData` flag
    - Route to product API node when flag is true
    - Skip product API for general queries
    - _Requirements: 3.3, 5.1_
  
  - [ ]* 3.3 Write property test for product data completeness
    - **Property 6: Product Data Completeness**
    - **Validates: Requirements 5.1, 5.2**
    - Generate random product queries
    - Verify all retrieved products have required fields (name, price, currency, unit, category, in_stock)
    - _Requirements: 5.1, 5.2_

- [x] 4. Implement response formatting
  - [x] 4.1 Create response formatter function node
    - Combine Gemini response with product data
    - Format prices with currency and units
    - Limit product lists to maximum 5 items
    - Structure output as ChatResponse schema
    - _Requirements: 3.4, 5.3, 7.2, 7.4_
  
  - [x] 4.2 Add product availability filtering
    - Filter suggested products to only include in-stock items
    - For unavailable products, find alternatives in same category
    - _Requirements: 5.4, 7.1_
  
  - [ ]* 4.3 Write property test for price format consistency
    - **Property 7: Price Format Consistency**
    - **Validates: Requirements 5.3, 7.2**
    - Generate random price queries
    - Verify all prices include currency symbols and units
    - Verify consistent formatting across responses
    - _Requirements: 5.3, 7.2_
  
  - [ ]* 4.4 Write property test for product list limit
    - **Property 10: Product List Limit**
    - **Validates: Requirements 7.4**
    - Generate queries that match many products
    - Verify responses contain at most 5 products
    - _Requirements: 7.4_
  
  - [ ]* 4.5 Write property test for suggestion availability
    - **Property 9: Suggestion Availability**
    - **Validates: Requirements 7.1**
    - Generate random suggestion queries
    - Verify all recommended products are in stock
    - _Requirements: 7.1_

- [ ] 5. Checkpoint - Test n8n workflow end-to-end
  - Manually test workflow with sample queries
  - Verify webhook receives and processes messages
  - Verify Gemini API integration works
  - Verify product API integration works
  - Ensure all tests pass, ask the user if questions arise

- [x] 6. Implement error handling
  - [x] 6.1 Add error handler nodes for Gemini API failures
    - Catch HTTP errors (503, 401, 403, 429)
    - Catch timeout errors (> 10 seconds)
    - Return user-friendly Vietnamese error message
    - Log error details for debugging
    - _Requirements: 4.4, 8.1, 8.4_
  
  - [x] 6.2 Add error handler nodes for product API failures
    - Catch HTTP errors and timeouts (> 5 seconds)
    - Return apology message suggesting retry
    - Log error details
    - _Requirements: 8.2, 8.4_
  
  - [x] 6.3 Add input validation
    - Check for empty or whitespace-only messages
    - Return prompt for valid question
    - Handle special characters and encoding issues
    - _Requirements: 8.3_
  
  - [ ]* 6.4 Write property test for error logging
    - **Property 11: Error Logging**
    - **Validates: Requirements 8.4**
    - Simulate various error conditions
    - Verify all errors are logged with sufficient detail
    - _Requirements: 8.4_

- [x] 7. Create React chat interface component
  - [x] 7.1 Create ChatWidget component with TypeScript
    - Define Message and ChatWidgetProps interfaces
    - Implement component state: messages array, input value, loading, error
    - Create JSX structure: message list, input field, send button
    - Style with CSS for conversation layout
    - _Requirements: 6.1_
  
  - [x] 7.2 Implement message sending functionality
    - Create async function to POST to n8n webhook
    - Add user message to state immediately
    - Show loading indicator while waiting
    - Handle response and add bot message to state
    - _Requirements: 6.2, 6.3, 6.4_
  
  - [x] 7.3 Add timeout and error handling
    - Set 20-second timeout for webhook requests
    - Display error message on timeout or failure
    - Allow retry on error
    - _Requirements: 6.5_
  
  - [x] 7.4 Implement product display in messages
    - Render product lists when present in response
    - Format prices clearly
    - Show availability status
    - _Requirements: 6.1, 7.2_
  
  - [ ]* 7.5 Write unit tests for ChatWidget component
    - Test message rendering
    - Test input handling and validation
    - Test loading state display
    - Test error state display
    - Mock webhook API calls
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 7.6 Write property test for response format validity
    - **Property 5: Response Format Validity**
    - **Validates: Requirements 3.4, 4.3**
    - Generate random queries
    - Verify all responses conform to ChatResponse schema
    - Verify required fields are present (message, timestamp)
    - _Requirements: 3.4, 4.3_

- [-] 8. Integration and deployment
  - [x] 8.1 Configure environment variables
    - Set `N8N_WEBHOOK_URL` in React app
    - Set `DJANGO_API_URL` in n8n workflow
    - Set `GEMINI_API_KEY` in n8n workflow
    - _Requirements: 3.1, 4.1, 5.1_
  
  - [x] 8.2 Integrate ChatWidget into main application
    - Import ChatWidget component
    - Add to appropriate page/layout
    - Pass n8n webhook URL as prop
    - Test in development environment
    - _Requirements: 6.1, 6.2_
  
  - [ ] 8.3 Deploy n8n workflow
    - Activate workflow in n8n instance
    - Verify webhook URL is accessible
    - Test with production Django API
    - Test with production Gemini API
    - _Requirements: 3.1, 4.1, 5.1_
  
  - [ ]* 8.4 Write integration tests
    - Test complete message flow from React to n8n to APIs
    - Test with real Django backend (test database)
    - Test error scenarios end-to-end
    - _Requirements: 1.1, 3.1, 6.2, 6.3_

- [ ] 9. Final checkpoint - Comprehensive testing
  - Run all unit tests and property tests
  - Test with Vietnamese and English queries
  - Test food and non-food queries
  - Test error scenarios (API failures, timeouts)
  - Verify mobile responsiveness
  - Ensure all tests pass, ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with minimum 100 iterations
- Unit tests validate specific examples and edge cases
- n8n workflow can be tested independently before React integration
- Gemini API key is provided: `AIzaSyAKFH-hNkyiaGJxlzM9D4VB1Pwt0zt8tk0`
