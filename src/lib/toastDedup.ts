import { toast } from 'sonner';

// Sonner stacks a brand new toast card for every call, even when the text is
// identical — so retrying a failing action (e.g. tapping Save while it keeps
// erroring) piles up duplicate "Failed to save changes" cards instead of
// replacing the existing one. Giving same-text toasts a stable id makes
// sonner update the existing toast in place rather than stacking a new one.
type ToastArgs = Parameters<typeof toast.error>;

function withStableId(fn: (...args: ToastArgs) => string | number) {
  return (message: ToastArgs[0], data?: ToastArgs[1]) =>
    fn(message, { id: typeof message === 'string' ? message : undefined, ...data });
}

toast.success = withStableId(toast.success);
toast.error = withStableId(toast.error);
toast.info = withStableId(toast.info);
toast.warning = withStableId(toast.warning);
