import type { ReactNode } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  variant = 'default',
  icon,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  icon?: ReactNode;
}) {
  const isDanger = variant === 'danger';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {icon ? (
              <div>{icon}</div>
            ) : isDanger ? (
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="size-5 text-red-600" />
              </div>
            ) : null}
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          {description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={isDanger ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : undefined}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


