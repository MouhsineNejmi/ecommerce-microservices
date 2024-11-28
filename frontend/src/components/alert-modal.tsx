'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AlertModalProps {
  title: string;
  description: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  title,
  description,
  isOpen,
  onConfirm,
  onCancel,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-lg font-medium'>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription className='text-sm text-muted-foreground'>
          {description}
        </DialogDescription>
        <DialogFooter className='flex justify-end space-x-2'>
          <Button variant='outline' onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm} disabled={loading} variant='destructive'>
            {loading ? 'Processing...' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
