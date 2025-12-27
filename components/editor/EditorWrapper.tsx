'use client';

import React from 'react';
import { EditorProvider } from '@/context/EditorContext';
import { EditorToolbar } from './EditorToolbar';

interface EditorWrapperProps {
  children: React.ReactNode;
}

export function EditorWrapper({ children }: EditorWrapperProps) {
  return (
    <EditorProvider>
      {children}
      {/* Editor toolbar shows when authenticated - accessible from admin panel */}
      <EditorToolbar />
    </EditorProvider>
  );
}
