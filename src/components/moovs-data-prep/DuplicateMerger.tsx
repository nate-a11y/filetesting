'use client';

import { useState } from 'react';
import type { DuplicateGroup, ParsedContact } from '@/types/schemas';
import { cn } from '@/lib/cn';
import { Users, Check, X, ChevronDown, ChevronUp } from 'lucide-react';

interface DuplicateMergerProps {
  duplicates: DuplicateGroup[];
  onResolve: (groupIndex: number, keepIndex: number) => void;
  onResolveAll: (decisions: { groupIndex: number; keepIndex: number }[]) => void;
}

export function DuplicateMerger({ duplicates, onResolve, onResolveAll }: DuplicateMergerProps) {
  const [expandedGroup, setExpandedGroup] = useState<number | null>(0);
  const [decisions, setDecisions] = useState<Map<number, number>>(new Map());

  if (duplicates.length === 0) {
    return null;
  }

  const handleSelect = (groupIndex: number, contactIndex: number) => {
    const newDecisions = new Map(decisions);
    newDecisions.set(groupIndex, contactIndex);
    setDecisions(newDecisions);
  };

  const handleResolve = (groupIndex: number) => {
    const keepIndex = decisions.get(groupIndex);
    if (keepIndex !== undefined) {
      onResolve(groupIndex, keepIndex);
      // Move to next unresolved group
      const nextGroup = duplicates.findIndex((_, i) => i > groupIndex && !decisions.has(i));
      setExpandedGroup(nextGroup >= 0 ? nextGroup : null);
    }
  };

  const handleResolveAll = () => {
    // For any group without a decision, default to keeping first record
    const allDecisions: { groupIndex: number; keepIndex: number }[] = [];
    duplicates.forEach((_, index) => {
      const keepIndex = decisions.get(index) ?? 0;
      allDecisions.push({ groupIndex: index, keepIndex });
    });
    onResolveAll(allDecisions);
  };

  const getMatchReasonLabel = (reason: string) => {
    switch (reason) {
      case 'phone': return 'Same phone number';
      case 'email': return 'Same email address';
      case 'name': return 'Same name';
      default: return 'Potential duplicate';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Duplicate Contacts ({duplicates.length} groups)
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Review and select which record to keep for each duplicate group
          </p>
        </div>
        {duplicates.length > 1 && (
          <button
            onClick={handleResolveAll}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium"
          >
            Keep First of Each ({duplicates.length})
          </button>
        )}
      </div>

      <div className="space-y-4">
        {duplicates.map((group, groupIndex) => {
          const isExpanded = expandedGroup === groupIndex;
          const selectedIndex = decisions.get(groupIndex);

          return (
            <div
              key={groupIndex}
              className={cn(
                "border rounded-lg overflow-hidden",
                selectedIndex !== undefined ? "border-green-300 bg-green-50" : "border-gray-200"
              )}
            >
              {/* Group Header */}
              <button
                onClick={() => setExpandedGroup(isExpanded ? null : groupIndex)}
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">
                    Group {groupIndex + 1}: {group.contacts.length} records
                  </span>
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                    {getMatchReasonLabel(group.matchReason)}
                  </span>
                  {selectedIndex !== undefined && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Keeping record {selectedIndex + 1}
                    </span>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="p-4 space-y-4">
                  {/* Side by side comparison */}
                  <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(group.contacts.length, 3)}, 1fr)` }}>
                    {group.contacts.slice(0, 3).map((contact, contactIndex) => (
                      <div
                        key={contactIndex}
                        onClick={() => handleSelect(groupIndex, contactIndex)}
                        className={cn(
                          "p-4 border-2 rounded-lg cursor-pointer transition-all",
                          selectedIndex === contactIndex
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-blue-300"
                        )}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-500">
                            Record {contactIndex + 1} (Row {contact.rowIndex + 2})
                          </span>
                          {selectedIndex === contactIndex && (
                            <Check className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">Name:</span>{' '}
                            <span className="font-medium text-gray-900">
                              {contact.firstName} {contact.lastName}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Email:</span>{' '}
                            <span className={cn(
                              "font-medium",
                              contact.email ? "text-gray-900" : "text-gray-400 italic"
                            )}>
                              {contact.email || 'Not provided'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Phone:</span>{' '}
                            <span className={cn(
                              "font-medium",
                              contact.phone ? "text-gray-900" : "text-gray-400 italic"
                            )}>
                              {contact.phone || 'Not provided'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {group.contacts.length > 3 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{group.contacts.length - 3} more records in this group
                    </p>
                  )}

                  {/* Action buttons */}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleSelect(groupIndex, 0)}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                    >
                      Keep First
                    </button>
                    {selectedIndex !== undefined && (
                      <button
                        onClick={() => handleResolve(groupIndex)}
                        className="px-4 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium flex items-center gap-1"
                      >
                        <Check className="w-4 h-4" />
                        Confirm Selection
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
