'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  actionLabel,
  footer,
  disabled,
  secondaryAction,
  secondaryActionLabel,
}) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return;
    }

    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose, disabled]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    onSubmit();
  }, [onSubmit, disabled]);

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return;
    }

    secondaryAction();
  }, [secondaryAction, disabled]);

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={showModal} onOpenChange={handleClose}>
      <DialogContent className='outline-none'>
        <DialogHeader>
          <DialogTitle className='text-center text-lg font-semibold mb-2'>
            {title}
          </DialogTitle>
          <hr />
        </DialogHeader>

        <div className='relative flex-auto'>
          <>{body}</>
        </div>

        <DialogFooter className='block'>
          <div className='flex flex-row items-center gap-4 w-full'>
            {secondaryAction && secondaryActionLabel && (
              <Button
                disabled={disabled}
                onClick={handleSecondaryAction}
                className='w-full'
              >
                {secondaryActionLabel}
              </Button>
            )}

            <Button
              disabled={disabled}
              onClick={handleSubmit}
              className='w-full'
            >
              {disabled && <Loader className='animate-spin space-x-2' />}
              {actionLabel}
            </Button>
          </div>

          <div>{footer}</div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
