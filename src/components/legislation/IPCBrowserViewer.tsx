import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowTopRightOnSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface IPCBrowserViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IPCBrowserViewer({ open, onOpenChange }: IPCBrowserViewerProps) {
  const [iframeError, setIframeError] = useState(false);
  const ipcUrl = 'https://decisions.ipc.on.ca/ipc-cipvp/en/d/s/index.do?cont=&ref=&d1=1980-01-01&d2=2025-12-31&p=&or=';

  const handleIframeError = () => {
    setIframeError(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">IPC Ontario Database Browser</DialogTitle>
              <DialogDescription className="mt-2">
                Browse the Information and Privacy Commissioner of Ontario's decision database
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="shrink-0"
              aria-label="Close browser"
            >
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden px-6 pb-6">
          {iframeError ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6 p-8">
              <Alert className="max-w-2xl">
                <AlertDescription className="text-base">
                  The IPC website cannot be displayed within this app due to security restrictions.
                  Click the button below to open it in a new tab.
                </AlertDescription>
              </Alert>
              <Button
                size="lg"
                asChild
                className="gap-2"
              >
                <a
                  href={ipcUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                  Open IPC Database in New Tab
                </a>
              </Button>
            </div>
          ) : (
            <div className="relative h-full bg-white rounded-lg overflow-hidden border">
              <iframe
                src={ipcUrl}
                className="w-full h-full"
                title="IPC Ontario Database"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                onError={handleIframeError}
              />
              <div className="absolute top-4 right-4">
                <Button
                  size="sm"
                  variant="secondary"
                  asChild
                  className="gap-2 shadow-lg"
                >
                  <a
                    href={ipcUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    Open in New Tab
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
