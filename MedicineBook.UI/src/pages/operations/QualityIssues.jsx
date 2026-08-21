import React from 'react';
import OperationsDocumentManager from '../../components/shared/OperationsDocumentManager';

const QualityIssues = () => {
  return (
    <OperationsDocumentManager 
      title="Quality Issues" 
      description="Upload and view quality investigation reports, defect notices, and recalls."
      category="QualityIssue" 
    />
  );
};

export default QualityIssues;
