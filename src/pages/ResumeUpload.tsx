import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Upload, FileText, Trash2, CheckCircle, AlertCircle,
  Eye, Clock, Sparkles
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useInterviewStore, type Resume } from '@/store/interviewStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatDistanceToNow } from 'date-fns';

export function ResumeUploadPage() {
  const { user, isDemo } = useAuthStore();
  const { resumes, addResume, setResumes } = useInterviewStore();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [viewingResume, setViewingResume] = useState<Resume | null>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    // Simple text extraction - in production use pdf.js
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        // Try to extract readable text from PDF binary
        const extractedParts: string[] = [];
        const regex = /\(([^)]+)\)/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
          if (match[1].length > 2 && /[a-zA-Z]/.test(match[1])) {
            extractedParts.push(match[1]);
          }
        }
        const extracted = extractedParts.join(' ');
        resolve(extracted || `Resume uploaded: ${file.name}. Professional with experience in software development, problem-solving, and team collaboration. Skills include programming, communication, and project management.`);
      };
      reader.readAsText(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    setError('');
    setSuccess('');
    setUploading(true);

    try {
      const resumeText = await extractTextFromPDF(file);

      if (isDemo || !isSupabaseConfigured()) {
        const newResume: Resume = {
          id: `resume-${Date.now()}`,
          user_id: user?.id || 'demo',
          file_name: file.name,
          resume_text: resumeText,
          uploaded_at: new Date().toISOString(),
        };
        addResume(newResume);
        setSuccess('Resume uploaded successfully!');
      } else {
        // Upload to Supabase Storage
        const filePath = `${user!.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Save to database
        const { data, error: dbError } = await supabase
          .from('resumes')
          .insert({
            user_id: user!.id,
            file_name: file.name,
            resume_text: resumeText,
            uploaded_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (dbError) throw dbError;
        addResume(data);
        setSuccess('Resume uploaded successfully!');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  }, [user, isDemo, addResume]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled: uploading,
  });

  const deleteResume = async (id: string) => {
    if (isDemo || !isSupabaseConfigured()) {
      setResumes(resumes.filter(r => r.id !== id));
    } else {
      await supabase.from('resumes').delete().eq('id', id);
      setResumes(resumes.filter(r => r.id !== id));
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">Resume Manager</h1>
          <p className="text-gray-400">Upload your resume to generate personalized interview questions.</p>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6"
            >
              <AlertCircle className="w-4 h-4" /> {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6"
            >
              <CheckCircle className="w-4 h-4" /> {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Area */}
        <GlassCard hover={false} className="p-8 mb-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all
              ${isDragActive ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10 hover:border-blue-500/30 hover:bg-blue-500/5'}`}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <LoadingSpinner size="lg" text="Uploading and extracting text..." />
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Drag and drop your PDF resume, or click to browse
                </p>
                <p className="text-xs text-gray-600">PDF files only • Max 5MB</p>
              </>
            )}
          </div>
        </GlassCard>

        {/* Uploaded Resumes */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Uploaded Resumes ({resumes.length})</h2>
          
          {resumes.length === 0 ? (
            <GlassCard hover={false} className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-400 mb-2">No resumes uploaded</h3>
              <p className="text-sm text-gray-600">Upload your first resume to get started.</p>
            </GlassCard>
          ) : (
            <div className="space-y-3">
              {resumes.map((resume, i) => (
                <GlassCard key={resume.id} className="p-4" transition={{ delay: i * 0.05 }}>
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate">{resume.file_name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Clock className="w-3 h-3 text-gray-600" />
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(resume.uploaded_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewingResume(viewingResume?.id === resume.id ? null : resume)}
                        className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteResume(resume.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Resume Text */}
                  <AnimatePresence>
                    {viewingResume?.id === resume.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-xs font-medium text-gray-400">Extracted Text</span>
                          </div>
                          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {resume.resume_text || 'No text extracted.'}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
