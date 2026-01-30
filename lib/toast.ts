import { toast as sonnerToast } from "sonner";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import { createElement } from "react";

interface ToastOptions {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

export const toast = {
  success: (options: ToastOptions) => {
    const Icon = iconMap.success;
    sonnerToast.success(options.title, {
      description: options.description,
      duration: options.duration || 3000,
      icon: createElement(Icon, { className: "w-5 h-5 text-emerald-600" }),
      action: options.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      classNames: {
        toast: "bg-white border-emerald-200",
        title: "text-emerald-900 font-semibold",
        description: "text-emerald-700",
        actionButton: "bg-emerald-600 hover:bg-emerald-700 text-white",
      },
    });
  },

  error: (options: ToastOptions) => {
    const Icon = iconMap.error;
    sonnerToast.error(options.title, {
      description: options.description,
      duration: options.duration || 4000,
      icon: createElement(Icon, { className: "w-5 h-5 text-red-600" }),
      action: options.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      classNames: {
        toast: "bg-white border-red-200",
        title: "text-red-900 font-semibold",
        description: "text-red-700",
        actionButton: "bg-red-600 hover:bg-red-700 text-white",
      },
    });
  },

  warning: (options: ToastOptions) => {
    const Icon = iconMap.warning;
    sonnerToast.warning(options.title, {
      description: options.description,
      duration: options.duration || 3500,
      icon: createElement(Icon, { className: "w-5 h-5 text-amber-600" }),
      action: options.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      classNames: {
        toast: "bg-white border-amber-200",
        title: "text-amber-900 font-semibold",
        description: "text-amber-700",
        actionButton: "bg-amber-600 hover:bg-amber-700 text-white",
      },
    });
  },

  info: (options: ToastOptions) => {
    const Icon = iconMap.info;
    sonnerToast.info(options.title, {
      description: options.description,
      duration: options.duration || 3000,
      icon: createElement(Icon, { className: "w-5 h-5 text-blue-600" }),
      action: options.action
        ? {
            label: options.action.label,
            onClick: options.action.onClick,
          }
        : undefined,
      classNames: {
        toast: "bg-white border-blue-200",
        title: "text-blue-900 font-semibold",
        description: "text-blue-700",
        actionButton: "bg-blue-600 hover:bg-blue-700 text-white",
      },
    });
  },

  // Specialized toasts for common operations
  saved: (message: string = "Changes saved successfully", onUndo?: () => void) => {
    toast.success({
      title: message,
      description: onUndo ? "Click to undo" : undefined,
      action: onUndo
        ? {
            label: "Undo",
            onClick: onUndo,
          }
        : undefined,
    });
  },

  uploaded: (fileName: string) => {
    toast.success({
      title: "File uploaded",
      description: `${fileName} has been uploaded successfully`,
    });
  },

  deleted: (itemName: string, onUndo?: () => void) => {
    toast.warning({
      title: "Item deleted",
      description: `${itemName} has been removed`,
      action: onUndo
        ? {
            label: "Undo",
            onClick: onUndo,
          }
        : undefined,
    });
  },

  stepCompleted: (stepName: string) => {
    toast.success({
      title: "Step completed!",
      description: `${stepName} has been completed successfully`,
      duration: 2500,
    });
  },
};
