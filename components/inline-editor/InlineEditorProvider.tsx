'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { EditModeProvider } from '@/context/inline-editor/EditModeContext';
import { ContentProvider } from '@/context/inline-editor/ContentContext';
import { EditModeToggle } from './EditModeToggle';
import { KeyboardShortcuts } from './KeyboardShortcuts';

interface InlineEditorProviderProps {
  children: ReactNode;
}

export function InlineEditorProvider({ children }: InlineEditorProviderProps) {
  return (
    <SessionProvider>
      <EditModeProvider>
        <ContentProvider>
          {children}
          <EditModeToggle />
          <KeyboardShortcuts />
        </ContentProvider>
      </EditModeProvider>
    </SessionProvider>
  );
}
