import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseId?: string | null;
}

export default function CaseReader({ open, onOpenChange, caseId }: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [docUrl, setDocUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) { setDocUrl(null); return; }
    const key = `case-doc-url:${caseId}`;
    const url = localStorage.getItem(key);
    setDocUrl(url);
  }, [caseId]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[90%] h-[85vh] bg-background border-border overflow-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Visualizador de Caso</DialogTitle>
        </DialogHeader>

        {!docUrl ? (
          <div className="p-6 text-center">
            <p className="text-muted-foreground">Nenhum documento vinculado a este caso. Vincule um PDF no seletor de casos.</p>
            <div className="mt-4">
              <Button onClick={() => onOpenChange(false)}>Fechar</Button>
            </div>
          </div>
        ) : (
          <div className="p-2">
            <Document file={docUrl} onLoadSuccess={onDocumentLoadSuccess} loading={<p>Carregando documento...</p>}>
              {Array.from(
                { length: Math.max(0, (numPages || 0) - 1) },
                (_, i) => (
                  <div key={i} className="mb-4 flex justify-center">
                    <Page pageNumber={i + 1} width={900} />
                  </div>
                )
              )}
            </Document>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => window.open(docUrl || undefined, '_blank')}>Abrir original</Button>
              <Button onClick={() => onOpenChange(false)}>Fechar</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
