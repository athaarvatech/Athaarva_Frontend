import { useState, useEffect, useCallback } from 'react';

interface UsePanelOptions {
  onClose?: () => void;
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
}

export const usePanel = <T = unknown>(options: UsePanelOptions = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const openPanel = useCallback((item?: T) => {
    setSelectedItem(item || null);
    setIsOpen(true);
    // Prevent body scroll when panel is open
    document.body.style.overflow = 'hidden';
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    setSelectedItem(null);
    // Restore body scroll
    document.body.style.overflow = 'unset';
    options.onClose?.();
  }, [options]);

  // Handle escape key
  useEffect(() => {
    if (!options.closeOnEscape) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closePanel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, closePanel, options.closeOnEscape]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const focusableElements = document.querySelectorAll(
      '[data-panel-content] a, [data-panel-content] button, [data-panel-content] input, [data-panel-content] textarea, [data-panel-content] select, [data-panel-content] [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  return {
    isOpen,
    selectedItem,
    openPanel,
    closePanel
  };
};
