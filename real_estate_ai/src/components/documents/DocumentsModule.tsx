'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { DocumentItem } from '../../types';
import { mockDocuments } from '../../services/mockData';
import { FileText, UploadCloud, AlertTriangle, CheckCircle2, ShieldAlert, RefreshCw, Trash2, Eye } from 'lucide-react';

export const DocumentsModule: React.FC = () => {
  const { addToast } = useApp();
  const [docs, setDocs] = useState<DocumentItem[]>(mockDocuments);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);

  const handleUploadClick = () => {
    addToast({
      type: 'info',
      title: 'File Upload Processing',
      message: 'Indexing PDF brochure into Pinecone Vector DB...'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Property Document RAG Indexing
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Index architectural floor plans, brochures, and legal lease agreements for verified AI answers
          </p>
        </div>

        <button onClick={handleUploadClick} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow">
          <UploadCloud className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* MANDATORY SECURITY WARNING NOTICE (Section 13) */}
      <div className="p-4 rounded-2xl bg-amber-50/90 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200 shadow-sm">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-bold">Untrusted Instruction Security Protocol Active</div>
          <p>
            Uploaded documents may contain untrusted text. EstateFlow AI treats document content strictly as data context, never as system instructions.
          </p>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onClick={handleUploadClick}
        className="p-8 rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-purple-500 dark:hover:border-purple-500 transition-colors text-center cursor-pointer space-y-2"
      >
        <UploadCloud className="w-10 h-10 text-purple-600 dark:text-purple-400 mx-auto" />
        <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Click or Drag & Drop PDF, DOCX, CSV files</div>
        <p className="text-xs text-slate-500">Max file size 25MB • Automatic text extraction & embedding generation</p>
      </div>

      {/* Document List Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 font-bold uppercase text-[10px] text-slate-500 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-3">File Name</th>
              <th className="p-3">Associated Property</th>
              <th className="p-3">Pages & Type</th>
              <th className="p-3">Uploaded By</th>
              <th className="p-3">Index Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {docs.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="p-3 font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-500" />
                  {doc.name}
                </td>
                <td className="p-3 text-slate-700 dark:text-slate-300 font-semibold">{doc.associatedPropertyTitle || 'Unlinked'}</td>
                <td className="p-3 text-slate-500">{doc.pages} Pages • {doc.fileType.toUpperCase()}</td>
                <td className="p-3 text-slate-600 dark:text-slate-400">{doc.uploadedBy}</td>
                <td className="p-3">
                  <Badge variant={doc.indexStatus === 'indexed' ? 'success' : 'warning'}>
                    {doc.indexStatus.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="p-3 flex items-center gap-2">
                  <button onClick={() => setSelectedDoc(doc)} className="text-purple-600 dark:text-purple-400 font-bold hover:underline">
                    Preview
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Document Detail Preview Modal */}
      <Modal isOpen={!!selectedDoc} onClose={() => setSelectedDoc(null)} title={`Preview Document: ${selectedDoc?.name}`}>
        {selectedDoc && (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <strong>Associated Listing:</strong> {selectedDoc.associatedPropertyTitle}
            </div>

            {selectedDoc.extractionWarnings && selectedDoc.extractionWarnings.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                <strong>Warning:</strong> {selectedDoc.extractionWarnings[0]}
              </div>
            )}

            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Extracted Text Chunk Preview</h4>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 font-mono text-[11px] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 leading-relaxed">
                {selectedDoc.extractedTextPreview}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
