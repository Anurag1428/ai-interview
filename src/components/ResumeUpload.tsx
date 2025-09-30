import React, { useState } from 'react';
import { Upload, Button, Form, Input, Card, Typography, Spin } from 'antd';
import { UploadOutlined, FileTextOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { addCandidate, setLoading, setError } from '../store/slices/candidateSlice';
import { parseResume, ParsedResume } from '../utils/resumeParser';
import MissingInfoCollector from './MissingInfoCollector';
import './ResumeUpload.css';

const { Title, Text } = Typography;
const { Dragger } = Upload;

interface ResumeUploadProps {
  onComplete: (candidateId: string) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onComplete }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [, setUploadedFile] = useState<File | null>(null);
  const [parsedInfo, setParsedInfo] = useState<ParsedResume | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState<'upload' | 'collect' | 'complete'>('upload');

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
      
      setStep('collect');
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Failed to parse resume'));
    } finally {
      setIsUploading(false);
    }
    return false; // Prevent default upload
  };

  const handleInfoComplete = async (completeInfo: ParsedResume) => {
    dispatch(setLoading(true));
    try {
      const candidateData = {
        name: completeInfo.name,
        email: completeInfo.email,
        phone: completeInfo.phone,
        resumeText: completeInfo.text || '',
        interviewStatus: 'not_started' as const,
        currentQuestionIndex: 0,
        answers: [],
      };

      dispatch(addCandidate(candidateData));
      setStep('complete');
      // Use the current candidate ID from the store
      setTimeout(() => {
        onComplete('current');
      }, 1000);
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

  const renderCollectStep = () => (
    <MissingInfoCollector
      parsedInfo={parsedInfo!}
      onComplete={handleInfoComplete}
    />
  );

  const renderCompleteStep = () => (
    <Card className="complete-card">
      <div className="complete-content">
        <div className="success-icon">🚀</div>
        <Title level={3}>Ready to Start Your Interview!</Title>
        <Text type="secondary">
          Your profile has been created successfully. The AI interviewer is preparing your personalized questions...
        </Text>
        <div className="loading-animation">
          <Spin size="large" />
          <Text type="secondary" style={{ marginTop: 16, display: 'block' }}>
            Initializing AI Interview Assistant...
          </Text>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="resume-upload">
      {step === 'upload' && renderUploadStep()}
      {step === 'collect' && renderCollectStep()}
      {step === 'complete' && renderCompleteStep()}
    </div>
  );
};

export default ResumeUpload;
