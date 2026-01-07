'use client';

import { useState, useCallback } from 'react';
import type { WorkflowType, FormatType, ColumnMapping, DataIssue, DuplicateGroup, WorkflowState } from '@/types/schemas';
import { parseCSV, applyMappings, generateCSV, downloadCSV, CONTACT_HEADERS, RESERVATION_HEADERS } from '@/lib/csv-utils';
import { LIMOANYWHERE_CONTACT_MAPPINGS, LIMOANYWHERE_RESERVATION_MAPPINGS, autoMapColumns, detectLimoAnywhereFormat, applyPhoneFallback } from '@/lib/limoanywhere-mappings';
import { validateContacts, validateReservations, detectDuplicates } from '@/lib/validation';
import { generatePlaceholderEmail } from '@/lib/email-utils';
import { cn } from '@/lib/cn';
import {
  Upload,
  FileSpreadsheet,
  Users,
  Calendar,
  ChevronRight,
  Check,
  AlertCircle,
  Download,
  ArrowLeft,
  Loader2
} from 'lucide-react';

interface MoovsDataPrepProps {
  operatorId?: string;
  className?: string;
}

export function MoovsDataPrep({ operatorId: initialOperatorId = '', className }: MoovsDataPrepProps) {
  const [state, setState] = useState<WorkflowState>({
    step: 'select-workflow',
    workflow: null,
    format: null,
    rawData: [],
    headers: [],
    columnMappings: [],
    parsedData: [],
    issues: [],
    duplicates: [],
    operatorId: initialOperatorId,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track multi-file upload stats
  const [uploadStats, setUploadStats] = useState<{
    fileCount: number;
    totalRows: number;
    droppedRows: number;
  } | null>(null);

  // Reset to beginning
  const resetWorkflow = () => {
    setState({
      step: 'select-workflow',
      workflow: null,
      format: null,
      rawData: [],
      headers: [],
      columnMappings: [],
      parsedData: [],
      issues: [],
      duplicates: [],
      operatorId: state.operatorId,
    });
    setError(null);
    setUploadStats(null);
  };

  // Select workflow type
  const selectWorkflow = (workflow: WorkflowType) => {
    setState(prev => ({ ...prev, workflow, step: 'select-format' }));
  };

  // Select format type
  const selectFormat = (format: FormatType) => {
    setState(prev => ({ ...prev, format, step: 'upload' }));
  };

  // Handle file upload - supports multiple files
  const handleFileUpload = useCallback(async (files: File[]) => {
    setIsProcessing(true);
    setError(null);
    setUploadStats(null);

    try {
      // Parse all files
      const parsedFiles = await Promise.all(files.map(f => parseCSV(f)));

      if (parsedFiles.length === 0) {
        throw new Error('No valid CSV files found');
      }

      // Use headers from first file as reference
      const referenceHeaders = parsedFiles[0].headers;

      // Validate all files have same headers (or compatible headers)
      for (let i = 1; i < parsedFiles.length; i++) {
        const fileHeaders = parsedFiles[i].headers;
        // Check if headers match (allowing for order differences)
        const headerSet = new Set(referenceHeaders);
        const mismatchedHeaders = fileHeaders.filter(h => !headerSet.has(h));
        if (mismatchedHeaders.length > 0 && mismatchedHeaders.length > referenceHeaders.length * 0.5) {
          throw new Error(`File ${i + 1} has different headers. Please ensure all files are from the same export type.`);
        }
      }

      // Combine all data rows
      const combinedData = parsedFiles.flatMap(f => f.data);
      const totalRowsBeforeCleaning = combinedData.length;

      // Auto-detect format if LimoAnywhere
      const isLimoFormat = state.format === 'limoanywhere' || detectLimoAnywhereFormat(referenceHeaders);

      // Get appropriate mappings
      const targetFields = state.workflow === 'contacts' ? CONTACT_HEADERS : RESERVATION_HEADERS;
      const knownMappings = state.workflow === 'contacts'
        ? LIMOANYWHERE_CONTACT_MAPPINGS
        : LIMOANYWHERE_RESERVATION_MAPPINGS;

      let mappings: ColumnMapping[];
      if (isLimoFormat || state.format === 'limoanywhere') {
        mappings = autoMapColumns(referenceHeaders, targetFields, knownMappings);
      } else {
        // For custom, start with empty mappings (user will map)
        mappings = [];
      }

      setState(prev => ({
        ...prev,
        headers: referenceHeaders,
        rawData: combinedData,
        columnMappings: mappings,
        step: state.format === 'custom' ? 'map-columns' : 'analyze',
      }));

      // Track upload stats (droppedRows will be updated after processing)
      setUploadStats({
        fileCount: files.length,
        totalRows: totalRowsBeforeCleaning,
        droppedRows: 0,
      });

      // If auto-mapped, proceed to analysis
      if (state.format !== 'custom') {
        processData(referenceHeaders, combinedData, mappings, totalRowsBeforeCleaning);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV files');
    } finally {
      setIsProcessing(false);
    }
  }, [state.workflow, state.format]);

  // Process data with mappings
  const processData = useCallback((headers: string[], rawData: string[][], mappings: ColumnMapping[], totalRowsBeforeCleaning?: number) => {
    setIsProcessing(true);

    try {
      let parsed = applyMappings(headers, rawData, mappings);
      const countBeforePhoneFallback = parsed.length;

      // Apply phone fallback logic + name cleaning + drop records without names
      parsed = applyPhoneFallback(parsed);

      // Track dropped rows (records without first/last name)
      const droppedCount = countBeforePhoneFallback - parsed.length;
      if (totalRowsBeforeCleaning !== undefined) {
        setUploadStats(prev => prev ? {
          ...prev,
          droppedRows: droppedCount,
        } : null);
      }

      // Validate based on workflow
      const { validatedData, issues } = state.workflow === 'contacts'
        ? validateContacts(parsed, state.operatorId)
        : validateReservations(parsed, state.operatorId);

      // Detect duplicates
      const duplicates = detectDuplicates(validatedData);

      setState(prev => ({
        ...prev,
        parsedData: validatedData,
        issues,
        duplicates,
        step: 'analyze',
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process data');
    } finally {
      setIsProcessing(false);
    }
  }, [state.workflow, state.operatorId]);

  // Apply column mappings (for custom format)
  const applyColumnMappings = () => {
    processData(state.headers, state.rawData, state.columnMappings);
  };

  // Update a single mapping
  const updateMapping = (targetField: string, sourceColumn: string) => {
    setState(prev => {
      const newMappings = prev.columnMappings.filter(m => m.targetField !== targetField);
      if (sourceColumn) {
        newMappings.push({ sourceColumn, targetField });
      }
      return { ...prev, columnMappings: newMappings };
    });
  };

  // Auto-fix issues
  const autoFixIssues = () => {
    setState(prev => {
      const newData = [...prev.parsedData];

      prev.issues.forEach(issue => {
        if (issue.suggestedValue && issue.type === 'missing') {
          newData[issue.rowIndex] = {
            ...newData[issue.rowIndex],
            [issue.field]: issue.suggestedValue,
          };
        }
      });

      // Re-validate
      const { validatedData, issues } = state.workflow === 'contacts'
        ? validateContacts(newData, state.operatorId)
        : validateReservations(newData, state.operatorId);

      return {
        ...prev,
        parsedData: validatedData,
        issues,
      };
    });
  };

  // Generate placeholder emails for all missing
  const generateAllPlaceholderEmails = () => {
    setState(prev => {
      const newData = prev.parsedData.map(row => {
        const result = { ...row };

        // Contact email
        if (!row.email && row.firstName && row.lastName) {
          result.email = generatePlaceholderEmail(row.firstName, row.lastName, row.mobilePhone);
        }

        // Booking contact email
        if (!row.bookingContactEmail && row.bookingContactFirstName && row.bookingContactLastName) {
          result.bookingContactEmail = generatePlaceholderEmail(
            row.bookingContactFirstName,
            row.bookingContactLastName,
            row.bookingContactPhoneNumber
          );
        }

        // Trip contact email
        if (!row.tripContactEmail && row.tripContactFirstName && row.tripContactLastName) {
          result.tripContactEmail = generatePlaceholderEmail(
            row.tripContactFirstName,
            row.tripContactLastName,
            row.tripContactPhoneNumber
          );
        }

        return result;
      });

      // Re-validate
      const { validatedData, issues } = state.workflow === 'contacts'
        ? validateContacts(newData, state.operatorId)
        : validateReservations(newData, state.operatorId);

      return {
        ...prev,
        parsedData: validatedData,
        issues,
      };
    });
  };

  // Export CSV
  const exportCSV = () => {
    const headers = state.workflow === 'contacts' ? CONTACT_HEADERS : RESERVATION_HEADERS;
    const csv = generateCSV(state.parsedData, headers);
    const filename = state.workflow === 'contacts'
      ? `moovs-contacts-${Date.now()}.csv`
      : `moovs-reservations-${Date.now()}.csv`;
    downloadCSV(csv, filename);
  };

  // Count issues by type
  const issuesByType = state.issues.reduce((acc, issue) => {
    const key = `${issue.field}-${issue.type}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const missingEmailCount = state.issues.filter(i => i.field.includes('email') || i.field.includes('Email')).filter(i => i.type === 'missing').length;
  const invalidPhoneCount = state.issues.filter(i => i.field.includes('phone') || i.field.includes('Phone')).filter(i => i.type === 'invalid').length;
  const totalIssues = state.issues.length;
  const readyCount = state.parsedData.length - new Set(state.issues.map(i => i.rowIndex)).size;

  return (
    <div className={cn("min-h-screen bg-gray-50", className)}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Moovs Data Prep</h1>
          <p className="text-gray-900 mt-2">Prepare your data for import into Moovs via OneSchema</p>
        </div>

        {/* Operator ID Input */}
        {state.step === 'select-workflow' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Operator ID
            </label>
            <input
              type="text"
              value={state.operatorId}
              onChange={(e) => setState(prev => ({ ...prev, operatorId: e.target.value }))}
              placeholder="Enter your operator ID"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 bg-white"
            />
          </div>
        )}

        {/* Progress indicator */}
        {state.step !== 'select-workflow' && (
          <div className="mb-6 flex items-center gap-2">
            <button
              onClick={resetWorkflow}
              className="flex items-center gap-1 text-sm text-gray-900 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Start Over
            </button>
            <span className="text-gray-500" aria-hidden="true">|</span>
            <span className="text-sm text-gray-900">
              {state.workflow === 'contacts' ? 'Contacts' : 'Reservations'}
              {state.format && ` / ${state.format === 'limoanywhere' ? 'LimoAnywhere' : 'Custom'}`}
            </span>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Step: Select Workflow */}
        {state.step === 'select-workflow' && (
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => selectWorkflow('contacts')}
              disabled={!state.operatorId}
              className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-left disabled:bg-gray-100 disabled:border-gray-300 disabled:cursor-not-allowed"
              aria-describedby={!state.operatorId ? "operator-required" : undefined}
            >
              <Users className="w-12 h-12 text-blue-500 mb-4" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-gray-900">Contacts</h2>
              <p className="text-gray-900 mt-2">
                Clean up your contact list - fix missing emails, invalid phones, and detect duplicates.
              </p>
            </button>
            <button
              onClick={() => selectWorkflow('reservations')}
              disabled={!state.operatorId}
              className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-left disabled:bg-gray-100 disabled:border-gray-300 disabled:cursor-not-allowed"
              aria-describedby={!state.operatorId ? "operator-required" : undefined}
            >
              <Calendar className="w-12 h-12 text-green-500 mb-4" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-gray-900">Reservations</h2>
              <p className="text-gray-900 mt-2">
                Clean up your trip history - fix dates, addresses, and contact information.
              </p>
            </button>
            {!state.operatorId && (
              <p id="operator-required" className="col-span-2 text-sm text-gray-900 text-center">
                Enter your Operator ID above to continue
              </p>
            )}
          </div>
        )}

        {/* Step: Select Format */}
        {state.step === 'select-format' && (
          <div className="grid md:grid-cols-2 gap-6">
            <button
              onClick={() => selectFormat('limoanywhere')}
              className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-left"
            >
              <FileSpreadsheet className="w-12 h-12 text-purple-600 mb-4" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-gray-900">LimoAnywhere</h2>
              <p className="text-gray-900 mt-2">
                Auto-mapped columns for LimoAnywhere exports. Just upload and fix issues.
              </p>
            </button>
            <button
              onClick={() => selectFormat('custom')}
              className="p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all text-left"
            >
              <FileSpreadsheet className="w-12 h-12 text-orange-600 mb-4" aria-hidden="true" />
              <h2 className="text-xl font-semibold text-gray-900">Custom Format</h2>
              <p className="text-gray-900 mt-2">
                Map your columns to Moovs fields manually. Works with any CSV export.
              </p>
            </button>
          </div>
        )}

        {/* Step: Upload */}
        {state.step === 'upload' && (
          <FileUploader
            onUpload={handleFileUpload}
            isProcessing={isProcessing}
          />
        )}

        {/* Step: Map Columns (Custom only) */}
        {state.step === 'map-columns' && (
          <ColumnMapper
            headers={state.headers}
            targetFields={state.workflow === 'contacts' ? CONTACT_HEADERS : RESERVATION_HEADERS}
            mappings={state.columnMappings}
            onUpdateMapping={updateMapping}
            onApply={applyColumnMappings}
            workflow={state.workflow!}
          />
        )}

        {/* Step: Analyze */}
        {state.step === 'analyze' && (
          <div className="space-y-6">
            {/* Multi-file upload stats */}
            {uploadStats && (uploadStats.fileCount > 1 || uploadStats.droppedRows > 0) && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-900">
                  {uploadStats.fileCount > 1 && (
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                      <span><strong>{uploadStats.fileCount}</strong> files combined</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span><strong>{uploadStats.totalRows}</strong> total rows</span>
                  </div>
                  {uploadStats.droppedRows > 0 && (
                    <div className="flex items-center gap-2 text-orange-700">
                      <AlertCircle className="w-4 h-4" />
                      <span><strong>{uploadStats.droppedRows}</strong> rows dropped (missing name)</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Results</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">{readyCount}</p>
                  <p className="text-sm text-gray-900">Ready to Import</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-3xl font-bold text-yellow-700">{totalIssues}</p>
                  <p className="text-sm text-gray-900">Issues Found</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-700">{state.duplicates.length}</p>
                  <p className="text-sm text-gray-900">Duplicate Groups</p>
                </div>
              </div>
            </div>

            {/* Issues breakdown */}
            {totalIssues > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Issues to Fix</h3>
                  {missingEmailCount > 0 && (
                    <button
                      onClick={generateAllPlaceholderEmails}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                    >
                      Generate {missingEmailCount} Placeholder Emails
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {missingEmailCount > 0 && (
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                        <span className="text-gray-900">{missingEmailCount} missing emails</span>
                      </div>
                      <span className="text-sm text-gray-500">Will generate placeholder emails</span>
                    </div>
                  )}
                  {invalidPhoneCount > 0 && (
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-gray-900">{invalidPhoneCount} invalid phone numbers</span>
                      </div>
                      <span className="text-sm text-gray-500">Review manually</span>
                    </div>
                  )}
                  {Object.entries(issuesByType)
                    .filter(([key]) => !key.includes('email') && !key.includes('Email') && !key.includes('phone') && !key.includes('Phone'))
                    .map(([key, count]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-gray-500" />
                          <span className="text-gray-900">{count} {key.replace('-', ' ')}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Auto-fix button */}
            {totalIssues > 0 && (
              <button
                onClick={autoFixIssues}
                className="w-full py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium"
              >
                Auto-Fix All Issues with Suggestions
              </button>
            )}

            {/* Preview and Export */}
            <div className="flex gap-4">
              <button
                onClick={() => setState(prev => ({ ...prev, step: 'preview' }))}
                className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
              >
                Preview Data
              </button>
              <button
                onClick={exportCSV}
                className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export CSV for OneSchema
              </button>
            </div>
          </div>
        )}

        {/* Step: Preview */}
        {state.step === 'preview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Data Preview</h2>
              <button
                onClick={() => setState(prev => ({ ...prev, step: 'analyze' }))}
                className="text-blue-500 hover:text-blue-600"
              >
                Back to Analysis
              </button>
            </div>
            <DataPreview
              data={state.parsedData}
              headers={state.workflow === 'contacts' ? CONTACT_HEADERS : RESERVATION_HEADERS}
              issues={state.issues}
            />
            <button
              onClick={exportCSV}
              className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export CSV for OneSchema
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// File uploader component - supports multiple files for combining
function FileUploader({
  onUpload,
  isProcessing,
}: {
  onUpload: (files: File[]) => void;
  isProcessing: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith('.csv'));
    if (files.length > 0) {
      onUpload(files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-xl p-12 text-center transition-colors",
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white",
        isProcessing && "opacity-50 pointer-events-none"
      )}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {isProcessing ? (
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-900">Processing files...</p>
        </div>
      ) : (
        <>
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-900 mb-2">Drag & drop your CSV files here</p>
          <p className="text-sm text-gray-500 mb-2">Upload multiple files to combine them into one</p>
          <p className="text-sm text-gray-500 mb-4">or</p>
          <label className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">
            Select Files
            <input
              type="file"
              accept=".csv"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </>
      )}
    </div>
  );
}

// Column mapper component
function ColumnMapper({
  headers,
  targetFields,
  mappings,
  onUpdateMapping,
  onApply,
  workflow,
}: {
  headers: string[];
  targetFields: string[];
  mappings: ColumnMapping[];
  onUpdateMapping: (targetField: string, sourceColumn: string) => void;
  onApply: () => void;
  workflow: WorkflowType;
}) {
  const requiredFields = workflow === 'contacts'
    ? ['firstName', 'lastName', 'mobilePhone', 'email']
    : ['pickUpDate', 'pickUpTime', 'orderType', 'totalGroupSize', 'pickUpAddress', 'dropOffAddress',
       'bookingContactFirstName', 'bookingContactLastName', 'bookingContactEmail', 'bookingContactPhoneNumber',
       'tripContactFirstName', 'tripContactLastName', 'tripContactEmail', 'tripContactPhoneNumber', 'vehicle'];

  const getMappedColumn = (field: string) => {
    const mapping = mappings.find(m => m.targetField === field);
    return mapping?.sourceColumn || '';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Map Your Columns</h2>
      <p className="text-gray-900">
        Match your CSV columns to the Moovs fields. Required fields are marked with *.
      </p>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {targetFields.map((field) => {
          const isRequired = requiredFields.includes(field);
          return (
            <div key={field} className="flex items-center gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-900">
                  {field} {isRequired && <span className="text-red-500">*</span>}
                </label>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
              <div className="w-1/2">
                <select
                  value={getMappedColumn(field)}
                  onChange={(e) => onUpdateMapping(field, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Select column --</option>
                  {headers.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onApply}
        className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
      >
        Apply Mappings & Analyze
      </button>
    </div>
  );
}

// Data preview component
function DataPreview({
  data,
  headers,
  issues,
}: {
  data: Record<string, string>[];
  headers: string[];
  issues: DataIssue[];
}) {
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const totalPages = Math.ceil(data.length / pageSize);
  const pageData = data.slice(page * pageSize, (page + 1) * pageSize);

  const getIssuesForCell = (rowIndex: number, field: string) => {
    const actualIndex = page * pageSize + rowIndex;
    return issues.filter(i => i.rowIndex === actualIndex && i.field === field);
  };

  // Show only essential columns
  const displayHeaders = headers.filter(h =>
    ['operatorId', 'firstName', 'lastName', 'mobilePhone', 'email', 'pickUpDate', 'pickUpTime', 'pickUpAddress', 'dropOffAddress'].includes(h)
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Row
              </th>
              {displayHeaders.map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pageData.map((row, idx) => (
              <tr key={idx}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {page * pageSize + idx + 1}
                </td>
                {displayHeaders.map((h) => {
                  const cellIssues = getIssuesForCell(idx, h);
                  return (
                    <td
                      key={h}
                      className={cn(
                        "px-4 py-3 whitespace-nowrap text-sm",
                        cellIssues.length > 0 ? "bg-yellow-50 text-yellow-800" : "text-gray-900"
                      )}
                      title={cellIssues.map(i => i.message).join(', ')}
                    >
                      {row[h] || <span className="text-gray-400 italic">empty</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 text-sm text-gray-900 hover:text-gray-900 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-900">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="px-3 py-1 text-sm text-gray-900 hover:text-gray-900 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default MoovsDataPrep;
