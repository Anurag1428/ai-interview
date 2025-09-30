import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set up PDF.js worker - use local worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  text: string;
}

export const parsePDF = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          fullText += pageText + '\n';
        }

        resolve(fullText);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

export const parseDOCX = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

export const extractResumeInfo = (text: string): Partial<ParsedResume> => {
  const info: Partial<ParsedResume> = { text };

  // Extract name (usually at the beginning, capitalized words)
  const nameMatch = text.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/m);
  if (nameMatch) {
    info.name = nameMatch[1].trim();
  }

  // Extract email
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) {
    info.email = emailMatch[1].trim();
  }

  // Extract phone (Indian and international formats)
  const phonePatterns = [
    // Indian formats: +91 9876543210, +91-9876543210, +91 98765 43210
    /(\+91[-.\s]?)?([6-9][0-9]{9})/,
    // Indian with country code variations: 91-9876543210, 0091-9876543210
    /(0091|91)[-.\s]?([6-9][0-9]{9})/,
    // US format: +1-234-567-8900, (234) 567-8900
    /(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/,
    // General international: +XX-XXXXXXXXXX
    /(\+[0-9]{1,3}[-.\s]?)?([0-9]{8,15})/,
    // Fallback for any 10+ digit number
    /([0-9]{10,15})/,
  ];

  for (const pattern of phonePatterns) {
    const phoneMatch = text.match(pattern);
    if (phoneMatch) {
      let phone = phoneMatch[0].trim();
      
      // Normalize Indian phone numbers
      if (phone.match(/^[6-9][0-9]{9}$/)) {
        // Add +91 if it's a 10-digit Indian number starting with 6-9
        phone = '+91 ' + phone;
      } else if (phone.match(/^(91|0091)[-.\s]?([6-9][0-9]{9})$/)) {
        // Normalize 91-XXXXXXXXXX to +91 XXXXXXXXXX
        const digits = phone.replace(/[^0-9]/g, '');
        phone = '+91 ' + digits.slice(-10);
      } else if (phone.match(/^\+91[-.\s]?([6-9][0-9]{9})$/)) {
        // Already has +91, just clean up formatting
        const digits = phone.replace(/[^0-9]/g, '');
        phone = '+91 ' + digits.slice(-10);
      }
      
      info.phone = phone;
      break;
    }
  }

  return info;
};

export const parseResume = async (file: File): Promise<ParsedResume> => {
  let text: string;
  
  if (file.type === 'application/pdf') {
    text = await parsePDF(file);
  } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    text = await parseDOCX(file);
  } else {
    throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
  }

  const extractedInfo = extractResumeInfo(text);
  
  return {
    name: extractedInfo.name || '',
    email: extractedInfo.email || '',
    phone: extractedInfo.phone || '',
    text: extractedInfo.text || '',
  };
};
