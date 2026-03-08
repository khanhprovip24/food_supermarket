# ChatWidget Integration Documentation

This document describes how the ChatWidget component is integrated into the Fresh Food Shop application.

## Integration Status

✅ **ChatWidget is fully integrated and ready to use**

The ChatWidget component has been successfully integrated into the main application (`App.jsx`) and is configured to communicate with the n8n webhook endpoint.

## Integration Details

### Location

**File**: `fresh-food-shop/src/App.jsx`

**Code**:
```jsx
import ChatWidget from "./components/chat/ChatWidget";
import { N8N_WEBHOOK_URL } from "./utils/constants";

function App() {
  return (
    <>
      <Routes>
        {/* ... route definitions ... */}
      </Routes>

      {/* Chat AI nổi toàn trang */}
      <ChatWidget n8nWebhookUrl={N8N_WEBHOOK_URL} />
    </>
  );
}
```

### Component Props

The ChatWidget component receives one required prop:

| Prop | Type | Description | Source |
|------|------|-------------|--------|
| `n8nWebhookUrl` | `string` | The n8n webhook endpoint URL | `src/utils/constants.js` |

### Constants Configuration

**File**: `fresh-food-shop/src/utils/constants.js`

```javascript
// n8n Webhook URL for chatbot
export const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/food-chatbot';
```

The webhook URL is configured via environment variable `VITE_N8N_WEBHOOK_URL` with a fallback to the default development URL.

## ChatWidget Component Features

### User Interface

1. **Floating Button**
   - Fixed position in bottom-right corner
   - Green circular button with chat icon (💬)
   - Hover effect with scale animation
   - Always visible across all pages

2. **Chat Window**
   - Opens when floating button is clicked
   - Fixed position: bottom-right, above the button
   - Dimensions: 384px width × 600px height
   - Rounded corners with shadow
   - Responsive design

3. **Chat Header**
   - Green background matching brand colors
   - Title: "AI Trợ lý Fresh Market"
   - Online status indicator with pulse animation
   - Close button (✕)

4. **Messages Area**
   - Scrollable message history
   - User messages: right-aligned, green background
   - Bot messages: left-aligned, white background
   - Product suggestions displayed as cards
   - Timestamps for each message
   - Auto-scroll to latest message

5. **Input Area**
   - Text input field with placeholder
   - Send button (disabled when input is empty)
   - Loading state during API calls
   - Error display with retry button

### Functionality

#### Message Flow

1. User types a message and clicks "Gửi" (Send)
2. Message is immediately added to chat history
3. Loading indicator appears
4. POST request sent to n8n webhook with:
   ```json
   {
     "message": "user's message text",
     "sessionId": "session-{timestamp}",
     "timestamp": 1234567890
   }
   ```
5. Response received from n8n workflow
6. Bot message added to chat history with optional product data

#### Error Handling

- **Timeout**: 20-second timeout for webhook requests
- **Network Errors**: Display error message with retry option
- **API Failures**: Show user-friendly error message
- **Empty Input**: Send button disabled when input is empty

#### Product Display

When the bot response includes product data, products are displayed with:
- Product name
- Price (formatted with currency)
- Availability status
- Category (for suggestions)

### State Management

The component manages the following state:

```javascript
const [isOpen, setIsOpen] = useState(false);           // Chat window visibility
const [messages, setMessages] = useState([...]);       // Message history
const [inputValue, setInputValue] = useState("");      // Input field value
const [loading, setLoading] = useState(false);         // Loading state
const [error, setError] = useState(null);              // Error state
```

## Testing the Integration

### Development Environment

1. **Start the Django backend**:
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Start n8n and activate the workflow**:
   - Ensure n8n is running on port 5678
   - Import and activate `food-chatbot-workflow.json`
   - Verify webhook URL: `http://localhost:5678/webhook/food-chatbot`

3. **Start the React development server**:
   ```bash
   cd fresh-food-shop
   npm run dev
   ```

4. **Test the chat**:
   - Open http://localhost:5173
   - Click the chat button (💬) in bottom-right corner
   - Send test messages:
     - "Giá rau củ bao nhiêu?" (Price query)
     - "Hôm nay ăn gì?" (Suggestion query)
     - "Còn thịt gà không?" (Availability query)

### Expected Behavior

✅ **Correct Behavior:**
- Chat button appears on all pages
- Chat window opens/closes smoothly
- Messages send and receive successfully
- Loading indicator shows during API calls
- Bot responds with relevant information
- Product data displays correctly
- Error messages show when APIs fail
- Retry button works after errors

❌ **Issues to Watch For:**
- Chat button not appearing → Check import in App.jsx
- No response from bot → Check n8n workflow is active
- CORS errors → Check Django CORS settings
- Timeout errors → Check all services are running

## Customization Options

### Styling

The ChatWidget uses Tailwind CSS classes. To customize:

**Colors**: Update the green color scheme
```jsx
// Current: bg-green-600
// Change to: bg-blue-600, bg-purple-600, etc.
```

**Size**: Adjust chat window dimensions
```jsx
// Current: w-96 h-[600px]
// Change to: w-[500px] h-[700px]
```

**Position**: Modify fixed positioning
```jsx
// Current: bottom-6 right-6
// Change to: bottom-4 right-4, etc.
```

### Welcome Message

Edit the initial bot message in ChatWidget.jsx:

```javascript
const [messages, setMessages] = useState([
  {
    id: "welcome-1",
    text: "Your custom welcome message here",
    sender: "bot",
    timestamp: Date.now(),
  },
]);
```

### Timeout Duration

Adjust the API timeout (currently 20 seconds):

```javascript
// In handleSendMessage function
const timeoutId = setTimeout(() => controller.abort(), 20000); // Change 20000 to desired milliseconds
```

## Accessibility

The ChatWidget includes accessibility features:

- `aria-label` attributes on buttons
- Keyboard navigation support
- Focus management (auto-focus input when chat opens)
- Semantic HTML structure

## Performance Considerations

1. **Lazy Loading**: Consider lazy loading the ChatWidget component if it impacts initial page load
2. **Message History**: Limit stored messages to prevent memory issues
3. **Debouncing**: Consider debouncing the send button to prevent rapid-fire requests
4. **Caching**: Consider caching common responses

## Browser Compatibility

The ChatWidget is compatible with:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Mobile Responsiveness

Current implementation:
- Fixed width (384px) may be too wide on small screens
- Consider adding responsive breakpoints:

```jsx
// Suggested improvement
className="fixed bottom-24 right-6 w-96 md:w-96 sm:w-full sm:right-0 sm:left-0 sm:bottom-0 h-[600px]"
```

## Security Considerations

1. **Input Sanitization**: User input is sent as-is to n8n. The workflow handles validation.
2. **XSS Prevention**: React automatically escapes text content
3. **HTTPS**: Use HTTPS in production for webhook URL
4. **Rate Limiting**: Consider implementing client-side rate limiting

## Troubleshooting

### Chat button not visible
- Check that App.jsx imports ChatWidget
- Verify z-index is high enough (currently z-50)
- Check for CSS conflicts

### Messages not sending
- Open browser console and check for errors
- Verify N8N_WEBHOOK_URL is set correctly
- Test webhook URL directly with curl
- Check network tab for failed requests

### Bot not responding
- Verify n8n workflow is active
- Check n8n execution logs
- Verify Django backend is running
- Test each component independently

### Styling issues
- Check Tailwind CSS is properly configured
- Verify all required Tailwind classes are available
- Check for CSS specificity conflicts

## Future Enhancements

Potential improvements for the ChatWidget:

1. **Message Persistence**: Save chat history to localStorage
2. **Session Management**: Maintain conversation context across page reloads
3. **Typing Indicators**: Show when bot is "typing"
4. **Rich Media**: Support images, links, and formatted text
5. **Quick Replies**: Add suggested quick reply buttons
6. **Voice Input**: Add speech-to-text capability
7. **Notifications**: Desktop notifications for new messages
8. **Analytics**: Track user interactions and common queries
9. **Multi-language**: Support language switching
10. **Emoji Support**: Add emoji picker

## Related Files

- Component: `fresh-food-shop/src/components/chat/ChatWidget.jsx`
- Integration: `fresh-food-shop/src/App.jsx`
- Constants: `fresh-food-shop/src/utils/constants.js`
- Environment: `fresh-food-shop/.env.example`
- Workflow: `food-chatbot-workflow.json`
- Deployment: `DEPLOYMENT_GUIDE.md`

## Summary

The ChatWidget is fully integrated and functional. It:
- ✅ Appears on all pages as a floating button
- ✅ Communicates with n8n webhook endpoint
- ✅ Handles user messages and bot responses
- ✅ Displays product information
- ✅ Manages errors gracefully
- ✅ Provides good user experience

No additional integration work is required. The component is ready for testing and deployment.
