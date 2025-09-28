import React, { useState } from 'react';
import { Upload, Button, Form, Input, Card, Typography, Alert, Spin } from 'antd';
import { UploadOutlined, FileTextOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { addCandidate, setLoading, setError } from '../store/slices/candidateSlice';
import { parseResume, ParsedResume } from '../utils/resumeParser';
import './ResumeUpload.css';

const { Title, Text } = Typography;
const { Dragger } = Upload;

interface ResumeUploadProps {
  onComplete: (candidateId: string) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onComplete }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedInfo, setParsedInfo] = useState<ParsedResume | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState<'upload' | 'review' | 'complete'>('upload');

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const parsed = await parseResume(file);
      setParsedInfo(parsed);
      setUploadedFile(file);
      
      // Pre-fill form with extracted information
      form.setFieldsValue({
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
      });
      
      setStep('review');
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to parse resume'));
    } finally {
      setIsUploading(false);
    }
    return false; // Prevent default upload
  };

  const handleFormSubmit = async (values: any) => {
    dispatch(setLoading(true));
    try {
      const candidateData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        resumeText: parsedInfo?.text || '',
        interviewStatus: 'not_started' as const,
        currentQuestionIndex: 0,
        answers: [],
      };

      dispatch(addCandidate(candidateData));
      setStep('complete');
      // Use the current candidate ID from the store
      onComplete('current');
    } catch (error) {
      dispatch(setError('Failed to create candidate profile'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const renderUploadStep = () => (
    <Card className="upload-card">
      <div className="upload-content">
        <FileTextOutlined className="upload-icon" />
        <Title level={3}>Upload Your Resume</Title>
        <Text type="secondary" className="upload-description">
          Upload your resume in PDF or DOCX format to get started with the interview process.
        </Text>
        
        <Dragger
          name="resume"
          multiple={false}
          accept=".pdf,.docx"
          beforeUpload={handleFileUpload}
          className="resume-dragger"
          showUploadList={false}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">Click or drag resume file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for PDF and DOCX files. We'll extract your contact information automatically.
          </p>
        </Dragger>

        {isUploading && (
          <div className="upload-loading">
            <Spin size="large" />
            <Text>Parsing your resume...</Text>
          </div>
        )}
      </div>
    </Card>
  );

  const renderReviewStep = () => (
    <Card className="review-card">
      <Title level={3}>Review Your Information</Title>
      <Text type="secondary" className="review-description">
        We've extracted the following information from your resume. Please review and complete any missing fields.
      </Text>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        className="candidate-form"
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: 'Please enter your full name' }]}
        >
          <Input size="large" placeholder="Enter your full name" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: 'Please enter your email address' },
            { type: 'email', message: 'Please enter a valid email address' }
          ]}
        >
          <Input size="large" placeholder="Enter your email address" />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: 'Please enter your phone number' }]}
        >
          <Input size="large" placeholder="Enter your phone number" />
        </Form.Item>

        <div className="form-actions">
          <Button size="large" onClick={() => setStep('upload')}>
            Back to Upload
          </Button>
          <Button type="primary" size="large" htmlType="submit">
            Start Interview
          </Button>
        </div>
      </Form>
    </Card>
  );

  const renderCompleteStep = () => (
    <Card className="complete-card">
      <div className="complete-content">
        <div className="success-icon">✓</div>
        <Title level={3}>Profile Created Successfully!</Title>
        <Text type="secondary">
          Your profile has been created and you're ready to start the interview.
        </Text>
        <Button type="primary" size="large" className="start-interview-btn">
          Begin Interview
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="resume-upload">
      {step === 'upload' && renderUploadStep()}
      {step === 'review' && renderReviewStep()}
      {step === 'complete' && renderCompleteStep()}
    </div>
  );
};

export default ResumeUpload;
