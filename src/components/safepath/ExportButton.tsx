import { Download } from "lucide-react";
import { BubbleButton } from './BubbleButton';
import { cn } from '@/lib/utils';

interface ExportButtonProps {
  label?: string;
  onExport?: () => void;
  className?: string;
}

export function ExportButton({ label = 'Export PDF', onExport, className }: ExportButtonProps) {
  const handleExport = () => {
    if (onExport) return onExport();
    window.print();
  };

  return (
    <BubbleButton
      variant="outline"
      size="sm"
      onClick={handleExport}
      className={cn('gap-1.5', className)}
    >
      <Download className="w-4 h-4" />
      {label}
    </BubbleButton>
  );
}
