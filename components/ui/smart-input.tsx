import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface SmartInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isValid?: boolean;
  showValidation?: boolean;
  errorMessage?: string;
}

const SmartInput = React.forwardRef<HTMLInputElement, SmartInputProps>(
  ({ className, type, isValid, showValidation, errorMessage, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const hasValue = props.value && String(props.value).length > 0;

    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
            showValidation && isValid && hasValue
              ? "border-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-200 pr-10"
              : showValidation && !isValid && hasValue
              ? "border-red-300 focus-visible:ring-2 focus-visible:ring-red-200 pr-10"
              : "border-gray-200 focus-visible:ring-2 focus-visible:ring-healthcare-primary/20",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {/* Success/Error Indicator */}
        <AnimatePresence>
          {showValidation && hasValue && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {isValid ? (
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="w-3 h-3 text-emerald-600" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-3 h-3 text-red-600" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {showValidation && !isValid && errorMessage && hasValue && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="text-xs text-red-600 mt-1 overflow-hidden"
            >
              {errorMessage}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Success Pulse Effect */}
        <AnimatePresence>
          {showValidation && isValid && hasValue && !isFocused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-md border-2 border-emerald-400 pointer-events-none"
              style={{ 
                animation: "pulse-success 2s infinite"
              }}
            />
          )}
        </AnimatePresence>

        <style jsx>{`
          @keyframes pulse-success {
            0%, 100% { opacity: 0; transform: scale(1); }
            50% { opacity: 0.3; transform: scale(1.02); }
          }
        `}</style>
      </div>
    );
  }
);
SmartInput.displayName = "SmartInput";

export { SmartInput };
