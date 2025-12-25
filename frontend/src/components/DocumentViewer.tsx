'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  IconButton,
  Tooltip,
  CircularProgress,
  Button,
  Divider,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';

interface ColorConfig {
  cardBg: string;
  cardBorder: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
}

interface DocumentViewerProps {
  fileName: string;
  fileType: 'pdf' | 'docx' | 'pptx';
  fileSize: string;
  uploadedDate: string;
  description: string;
  colors: ColorConfig;
  isDark: boolean;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  fileName,
  fileType,
  fileSize,
  uploadedDate,
  description,
  colors,
  isDark,
}) => {
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(true);

  // Mock document content preview based on file type
  const getDocumentPreview = () => {
    const previewHeight = '600px';

    switch (fileType) {
      case 'pdf':
        return (
          <Box
            sx={{
              width: '100%',
              height: previewHeight,
              backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
              borderRadius: 2,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              mb: 2,
            }}
          >
            {isLoading && (
              <Box sx={{ position: 'absolute', zIndex: 10 }}>
                <CircularProgress />
              </Box>
            )}
            <Box
              component="iframe"
              src={`data:application/pdf;base64,JVBERi0xLjQKJeLjz9MNCiAxIDAgb2JqCjw8IC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUiA+PgplbmRvYgoyIDAgb2JqCjw8IC9UeXBlIC9QYWdlcyAvS2lkcyBbMyAwIFJdIC9Db3VudCAxID4+CmVuZG9iCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA0IDAgUiA+PiA+PiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSAvQ29udGVudHMgNSAwIFIgPj4KZW5kb2JKCjQgMCBvYmoKPDwgL1R5cGUgL0ZvbnQgL1N1YnR5cGUgL1R5cGUxIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iCjUgMCBvYmoKPDwgL0xlbmd0aCA0NCA+PgpzdHJlYW0KQlQgL0YxIDEyIFRmIDUwIDcyMCBUZCAoU2FtcGxlIFBERiBEb2N1bWVudCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDc0IDAwMDAwIG4gCjAwMDAwMDAxNzAgMDAwMDAgbiAKMDAwMDAwMDMwMSAwMDAwMCBuIAowMDAwMDAwMzg5IDAwMDAwIG4gCnRyYWlsZXIKPDwgL1NpemUgNiAvUm9vdCAxIDAgUiA+PgpzdGFydHhyZWYKNDgzCiUlRU9GCg==`}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              onLoad={() => setIsLoading(false)}
            />
          </Box>
        );

      case 'docx':
        return (
          <Box
            sx={{
              width: '100%',
              height: previewHeight,
              backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
              borderRadius: 2,
              p: 4,
              overflowY: 'auto',
              fontSize: `${zoom}%`,
              mb: 2,
            }}
          >
            <Typography variant="h5" sx={{ color: colors.textPrimary, mb: 2, fontWeight: 700 }}>
              Document Preview: {fileName}
            </Typography>
            <Divider sx={{ mb: 3, borderColor: colors.cardBorder }} />
            <Box sx={{ color: colors.textSecondary, lineHeight: 1.8 }}>
              <Typography paragraph>
                This is a preview of the Word document content. In a production environment, this would
                display the actual content from the DOCX file.
              </Typography>
              <Typography paragraph>
                <strong>Key Topics:</strong>
              </Typography>
              <ul>
                <li>Module 1: Foundations and Basics</li>
                <li>Module 2: Intermediate Concepts</li>
                <li>Module 3: Advanced Techniques</li>
              </ul>
              <Typography paragraph>
                <strong>Learning Objectives:</strong>
              </Typography>
              <ul>
                <li>Understand core principles</li>
                <li>Apply knowledge to real scenarios</li>
                <li>Master advanced techniques</li>
                <li>Complete practical projects</li>
              </ul>
              <Typography paragraph sx={{ mt: 4, fontStyle: 'italic', color: colors.textMuted }}>
                Full document content would be displayed here with proper formatting, tables, images, etc.
              </Typography>
            </Box>
          </Box>
        );

      case 'pptx':
        return (
          <Box
            sx={{
              width: '100%',
              height: previewHeight,
              backgroundColor: isDark ? '#2a2a3e' : '#e8eaf6',
              borderRadius: 2,
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 2,
              border: `2px dashed ${colors.accent}`,
            }}
          >
            <Typography variant="h4" sx={{ color: colors.accent, mb: 2, fontWeight: 700, textAlign: 'center' }}>
              Slide 1: Introduction
            </Typography>
            <Typography variant="body1" sx={{ color: colors.textSecondary, textAlign: 'center', mb: 3 }}>
              This is a preview of the PowerPoint presentation
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button variant="outlined" size="small" sx={{ color: colors.textMuted }}>
                ← Previous Slide
              </Button>
              <Typography variant="caption" sx={{ color: colors.textMuted, minWidth: '80px', textAlign: 'center' }}>
                Slide 1 of 5
              </Typography>
              <Button variant="outlined" size="small" sx={{ color: colors.textMuted }}>
                Next Slide →
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Card
      sx={{
        backgroundColor: colors.cardBg,
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: 3,
        mb: 3,
        overflow: 'hidden',
      }}
    >
      {/* Document Header */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: `1px solid ${colors.cardBorder}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: colors.textPrimary,
              fontWeight: 700,
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            📄 Study Materials
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: colors.textMuted }}>
              <strong>{fileName}</strong> • {fileSize}
            </Typography>
            <Divider orientation="vertical" sx={{ height: '16px' }} />
            <Typography variant="caption" sx={{ color: colors.textMuted }}>
              Uploaded: {uploadedDate}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 1 }}>
            {description}
          </Typography>
        </Box>
      </Box>

      {/* Document Viewer Controls */}
      <Box
        sx={{
          p: 2,
          backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
          borderBottom: `1px solid ${colors.cardBorder}`,
          display: 'flex',
          gap: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Tooltip title={`Zoom: ${zoom}%`}>
          <Typography variant="caption" sx={{ color: colors.textMuted, minWidth: '60px', textAlign: 'right' }}>
            {zoom}%
          </Typography>
        </Tooltip>
        <Tooltip title="Zoom Out">
          <IconButton
            size="small"
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            sx={{ color: colors.accent }}
          >
            <ZoomOutIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom In">
          <IconButton
            size="small"
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            sx={{ color: colors.accent }}
          >
            <ZoomInIcon />
          </IconButton>
        </Tooltip>
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        <Tooltip title="Download">
          <IconButton
            size="small"
            sx={{ color: colors.accent }}
            onClick={() => {
              // Mock download
              console.log('Downloading:', fileName);
            }}
          >
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Document Preview Content */}
      <Box sx={{ p: 3 }}>
        {getDocumentPreview()}

        {/* Document Info Footer */}
        <Box
          sx={{
            p: 2,
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            borderRadius: 2,
            borderTop: `1px solid ${colors.cardBorder}`,
            mt: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: colors.textMuted, display: 'block', mb: 1 }}>
            <strong>File Type:</strong> {fileType.toUpperCase()}
          </Typography>
          <Typography variant="caption" sx={{ color: colors.textMuted, display: 'block', mb: 1 }}>
            <strong>Last Updated:</strong> {uploadedDate}
          </Typography>
          <Typography variant="caption" sx={{ color: colors.textMuted }}>
            <strong>Status:</strong> Available for offline download
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};
