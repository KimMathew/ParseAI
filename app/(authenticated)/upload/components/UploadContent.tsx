"use client";

import React from 'react';
import UploadForm from './UploadForm';
import ResultsView from './ResultsView';

type UploadContentProps = {
  stage: string;
  uploadMethod: string;
  isProcessing: boolean;
  showChat: boolean;
  isDarkMode: boolean;
  theme: any;
  onUploadMethodChange: (method: string) => void;
  onSummarize: () => void;
  onShowChat: (show: boolean) => void;
  file: File | null;
  text: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  summaryResult: Record<string, string> | null;
  documentId?: string | number | null;
  userId?: string | null;
};

export default function UploadContent(props: UploadContentProps) {
  return (
    <div className="h-full flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
      {props.stage === 'upload' ? (
        <UploadForm
          uploadMethod={props.uploadMethod}
          isProcessing={props.isProcessing}
          isDarkMode={props.isDarkMode}
          theme={props.theme}
          onUploadMethodChange={props.onUploadMethodChange}
          onSummarize={props.onSummarize}
          file={props.file}
          text={props.text}
          onFileChange={props.onFileChange}
          onTextChange={props.onTextChange}
        />
      ) : (
        <ResultsView
          showChat={props.showChat}
          isDarkMode={props.isDarkMode}
          theme={props.theme}
          onShowChat={props.onShowChat}
          summaryResult={props.summaryResult}
          documentId={props.documentId}
          userId={props.userId}
        />
      )}
    </div>
  );
}
