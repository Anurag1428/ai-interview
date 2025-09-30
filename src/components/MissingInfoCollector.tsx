import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Input, Button, Typography, Avatar } from 'antd';
import { RobotOutlined, UserOutlined, SendOutlined } from '@ant-design/icons';
import { ParsedResume } from '../utils/resumeParser';
import './MissingInfoCollector.css';

const { Text } = Typography;

interface MissingInfoCollectorProps {
  parsedInfo: ParsedResume;
  onComplete: (completeInfo: ParsedResume) => void;
}

interface ChatMessage {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: string;
}

const MissingInfoCollector: React.FC<MissingInfoCollectorProps> = ({
  parsedInfo,
  onComplete
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentField, setCurrentField] = useState<'name' | 'email' | 'phone' | 'complete'>('name');
  const [collectedInfo, setCollectedInfo] = useState<ParsedResume>(parsedInfo);
  const [isTyping, setIsTyping] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (type: 'ai' | 'user', content: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, message]);
  };

  const addAIMessageWithDelay = useCallback((content: string, delay: number = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      addMessage('ai', content);
      setIsTyping(false);
    }, delay);
  }, []);



  const getFieldPrompt = (field: string) => {
    switch (field) {
      case 'name':
        return "I couldn't find your full name in the resume. Could you please tell me your full name?";
      case 'email':
        return "I need your email address to proceed. What's your email address?";
      case 'phone':
        return "Could you please provide your phone number? (Include country code if international)";
      default:
        return '';
    }
  };

  const validateField = (field: string, value: string): { valid: boolean; message?: string } => {
    switch (field) {
      case 'name':
        if (value.trim().length < 2) {
          return { valid: false, message: "Please enter a valid full name (at least 2 characters)." };
        }
        return { valid: true };
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return { valid: false, message: "Please enter a valid email address (e.g., john@example.com)." };
        }
        return { valid: true };
      
      case 'phone':
        // More comprehensive phone validation
        const cleanPhone = value.replace(/[^0-9]/g, '');
        
        // Check for Indian numbers (10 digits starting with 6-9)
        if (cleanPhone.match(/^[6-9][0-9]{9}$/)) {
          return { valid: true };
        }
        
        // Check for Indian numbers with country code
        if (cleanPhone.match(/^91[6-9][0-9]{9}$/)) {
          return { valid: true };
        }
        
        // Check for international numbers (8-15 digits)
        if (cleanPhone.length >= 8 && cleanPhone.length <= 15) {
          return { valid: true };
        }
        
        return { 
          valid: false, 
          message: "Please enter a valid phone number. For Indian numbers: 9876543210 or +91-9876543210" 
        };
      
      default:
        return { valid: true };
    }
  };

  const processNextField = () => {
    const missing: string[] = [];
    if (!collectedInfo.name?.trim()) missing.push('name');
    if (!collectedInfo.email?.trim()) missing.push('email');
    if (!collectedInfo.phone?.trim()) missing.push('phone');
    
    if (missing.length === 0) {
      // All information collected
      setCurrentField('complete');
      addAIMessageWithDelay(
        `Perfect! I have all the information I need:\n\n` +
        `✓ Name: ${collectedInfo.name}\n` +
        `✓ Email: ${collectedInfo.email}\n` +
        `✓ Phone: ${collectedInfo.phone}\n\n` +
        `You're all set to begin your AI-powered interview! Are you ready to start?`
      );
      return;
    }

    const nextField = missing[0] as 'name' | 'email' | 'phone';
    setCurrentField(nextField);
    addAIMessageWithDelay(getFieldPrompt(nextField));
  };

  const handleSubmit = () => {
    if (!currentInput.trim()) return;

    // Add user message
    addMessage('user', currentInput);

    if (currentField === 'complete') {
      // User confirmed to start interview
      if (currentInput.toLowerCase().includes('yes') || currentInput.toLowerCase().includes('ready') || currentInput.toLowerCase().includes('start')) {
        addAIMessageWithDelay("Excellent! Let's begin your interview. Good luck! 🚀", 500);
        setTimeout(() => {
          onComplete(collectedInfo);
        }, 1500);
      } else {
        addAIMessageWithDelay("No problem! Take your time. Just let me know when you're ready to start by typing 'yes' or 'ready'.");
      }
      setCurrentInput('');
      return;
    }

    // Validate the input for current field
    const validation = validateField(currentField, currentInput);
    
    if (!validation.valid) {
      addAIMessageWithDelay(`${validation.message} Please try again.`);
      setCurrentInput('');
      return;
    }

    // Normalize and update collected info
    let normalizedValue = currentInput.trim();
    
    if (currentField === 'phone') {
      const cleanPhone = normalizedValue.replace(/[^0-9]/g, '');
      
      // Normalize Indian phone numbers
      if (cleanPhone.match(/^[6-9][0-9]{9}$/)) {
        normalizedValue = '+91 ' + cleanPhone;
      } else if (cleanPhone.match(/^91[6-9][0-9]{9}$/)) {
        normalizedValue = '+91 ' + cleanPhone.slice(-10);
      }
    }
    
    const updatedInfo = { ...collectedInfo, [currentField]: normalizedValue };
    setCollectedInfo(updatedInfo);

    // Acknowledge the input
    let acknowledgment = '';
    switch (currentField) {
      case 'name':
        acknowledgment = `Nice to meet you, ${currentInput}! 👋`;
        break;
      case 'email':
        acknowledgment = `Great! I've noted your email as ${currentInput}.`;
        break;
      case 'phone':
        acknowledgment = `Perfect! Your phone number ${currentInput} has been recorded.`;
        break;
    }

    addAIMessageWithDelay(acknowledgment, 500);
    
    // Move to next field
    setTimeout(() => {
      processNextField();
    }, 1500);

    setCurrentInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Initialize conversation - only run once
  useEffect(() => {
    if (initialized) return;
    
    setInitialized(true);
    
    // Check what's missing from the initial parsed info
    const missing: string[] = [];
    if (!parsedInfo.name?.trim()) missing.push('name');
    if (!parsedInfo.email?.trim()) missing.push('email');
    if (!parsedInfo.phone?.trim()) missing.push('phone');
    
    if (missing.length === 0) {
      // All info is available
      addAIMessageWithDelay(
        `Hello! I've successfully extracted all your information from the resume:\n\n` +
        `✓ Name: ${parsedInfo.name}\n` +
        `✓ Email: ${parsedInfo.email}\n` +
        `✓ Phone: ${parsedInfo.phone}\n\n` +
        `You're ready to start your interview! Shall we begin?`
      );
      setCurrentField('complete');
    } else {
      // Some info is missing
      const extractedCount = 3 - missing.length;
      addAIMessageWithDelay(
        `Hello! I've analyzed your resume and extracted ${extractedCount} out of 3 required pieces of information. ` +
        `I need to collect a few more details before we can start your interview.`
      );
      
      setTimeout(() => {
        const nextField = missing[0] as 'name' | 'email' | 'phone';
        setCurrentField(nextField);
        addAIMessageWithDelay(getFieldPrompt(nextField));
      }, 2000);
    }
  }, [addAIMessageWithDelay, initialized, parsedInfo.email, parsedInfo.name, parsedInfo.phone]); // Only depend on initialized flag

  return (
    <div className="missing-info-collector">
      <Card className="chat-card">
        <div className="chat-header">
          <Avatar icon={<RobotOutlined />} className="ai-avatar" />
          <div className="header-text">
            <Text strong>AI Interview Assistant</Text>
            <Text type="secondary" className="status-text">
              Collecting your information...
            </Text>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.type}`}>
              <Avatar 
                icon={message.type === 'ai' ? <RobotOutlined /> : <UserOutlined />}
                className={`message-avatar ${message.type}`}
              />
              <div className="message-content">
                <div className="message-text">{message.content}</div>
                <Text type="secondary" className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Text>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="message ai">
              <Avatar icon={<RobotOutlined />} className="message-avatar ai" />
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <div className="input-container">
            <Input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                currentField === 'complete' 
                  ? "Type 'yes' when ready to start..."
                  : `Enter your ${currentField}...`
              }
              size="large"
              className="message-input"
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSubmit}
              disabled={!currentInput.trim()}
              size="large"
              className="send-button"
            >
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MissingInfoCollector;