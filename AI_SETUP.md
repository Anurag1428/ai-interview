# AI Integration Setup Guide

This application supports both **AI-powered** and **curated** interview modes. Follow this guide to enable real AI-powered interviews using OpenAI.

## 🤖 AI-Powered Mode (Recommended)

### Prerequisites
- OpenAI API account
- Valid OpenAI API key with GPT-3.5-turbo access

### Setup Steps

1. **Get OpenAI API Key**
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Create an account or sign in
   - Navigate to API Keys section
   - Create a new API key

2. **Configure Environment**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env file and add your API key
   REACT_APP_OPENAI_API_KEY=your_actual_api_key_here
   REACT_APP_AI_MODEL=gpt-3.5-turbo
   REACT_APP_ENABLE_AI=true
   ```

3. **Restart the Application**
   ```bash
   npm start
   ```

4. **Verify AI Status**
   - Look for the "AI Powered" green tag in the header
   - Check browser console for "🤖 Generating questions with AI..." messages

## 📚 Curated Mode (Default)

If no OpenAI API key is provided, the application automatically falls back to:
- **Curated Question Bank**: 30 carefully crafted questions across all difficulty levels
- **Rule-based Evaluation**: Intelligent scoring based on keywords and content analysis
- **Template-based Summaries**: Professional interview summaries

## 🔄 How It Works

### Question Generation
- **AI Mode**: GPT-3.5 generates unique, contextual questions based on candidate profile
- **Curated Mode**: Intelligent selection from pre-built question pool

### Answer Evaluation
- **AI Mode**: GPT-3.5 provides detailed, contextual feedback and scoring
- **Curated Mode**: Advanced rule-based analysis with keyword matching

### Final Summary
- **AI Mode**: Comprehensive AI-generated interview summary
- **Curated Mode**: Template-based summary with performance analytics

## 💰 Cost Considerations

### OpenAI API Costs (Approximate)
- **Question Generation**: ~$0.002 per interview (6 questions)
- **Answer Evaluation**: ~$0.003 per interview (6 evaluations)
- **Final Summary**: ~$0.001 per interview
- **Total per Interview**: ~$0.006 (less than 1 cent)

### Monthly Estimates
- 100 interviews/month: ~$0.60
- 500 interviews/month: ~$3.00
- 1000 interviews/month: ~$6.00

## 🛡️ Security Best Practices

1. **Environment Variables**
   - Never commit `.env` file to version control
   - Use different API keys for development/production
   - Rotate API keys regularly

2. **API Key Management**
   - Set usage limits in OpenAI dashboard
   - Monitor API usage regularly
   - Use organization-level API keys for team projects

3. **Rate Limiting**
   - OpenAI has built-in rate limits
   - Application includes error handling for rate limit exceeded

## 🔧 Troubleshooting

### Common Issues

1. **"AI service unavailable" message**
   - Check if REACT_APP_OPENAI_API_KEY is set correctly
   - Verify API key is valid and has credits
   - Check browser console for detailed error messages

2. **Questions not generating**
   - Ensure API key has GPT-3.5-turbo access
   - Check OpenAI account billing status
   - Verify network connectivity

3. **Evaluation errors**
   - Check API rate limits
   - Ensure sufficient API credits
   - Review OpenAI service status

### Debug Mode
Enable detailed logging by adding to `.env`:
```
REACT_APP_DEBUG_AI=true
```

## 🚀 Production Deployment

### Environment Variables for Production
```bash
# Production environment
REACT_APP_OPENAI_API_KEY=prod_api_key_here
REACT_APP_AI_MODEL=gpt-3.5-turbo
REACT_APP_ENABLE_AI=true
REACT_APP_ENVIRONMENT=production
```

### Monitoring
- Set up OpenAI usage alerts
- Monitor application logs for AI service errors
- Track interview completion rates

## 📊 Performance Comparison

| Feature | AI-Powered | Curated |
|---------|------------|---------|
| Question Variety | ∞ Unlimited | 30 Questions |
| Personalization | ✅ High | ❌ None |
| Evaluation Quality | ✅ Contextual | ⚡ Fast |
| Cost | 💰 ~$0.006/interview | 🆓 Free |
| Setup Complexity | 🔧 Medium | ✅ Simple |
| Offline Support | ❌ No | ✅ Yes |

## 🎯 Recommendations

- **For Demo/Testing**: Use curated mode (no setup required)
- **For Production**: Use AI-powered mode for best candidate experience
- **For High Volume**: Consider AI mode with usage monitoring
- **For Offline**: Use curated mode as fallback

---

**Need Help?** Check the troubleshooting section or create an issue in the repository.