'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/icons/Icon';
import { useSimpleErrorData } from '../hooks/useSimpleErrorData';

export function SimpleErrorLog() {
  const { errors, isLoading, error, refetch, markAsFixed, clearFixed, clearAll } = useSimpleErrorData();
  const [expandedErrors, setExpandedErrors] = useState<Set<string>>(new Set());

  const toggleErrorExpansion = (errorId: string) => {
    const newExpanded = new Set(expandedErrors);
    if (newExpanded.has(errorId)) {
      newExpanded.delete(errorId);
    } else {
      newExpanded.add(errorId);
    }
    setExpandedErrors(newExpanded);
  };

  const handleMarkAsFixed = async (errorId: string) => {
    await markAsFixed(errorId);
    refetch();
  };

  const handleClearFixed = async () => {
    await clearFixed();
    refetch();
  };

  const handleClearAll = async () => {
    await clearAll();
    refetch();
  };

  const severityColors = {
    LOW: 'bg-success-soft-background text-success-foreground border-success-foreground/20',
    MEDIUM: 'bg-warning-soft-background text-warning-foreground border-warning-foreground/20',
    HIGH: 'bg-status-urgent-soft text-status-urgent border-status-urgent/20',
    CRITICAL: 'bg-destructive/10 text-destructive border-destructive/20'
  };

  const severityLabels = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
    CRITICAL: 'Critical'
  };

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <div className="text-center">
            <Icon name="AlertCircle" className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-destructive mb-2">Failed to load system logs</h3>
            <p className="text-muted-foreground mb-4">{error.message}</p>
            <Button onClick={refetch} variant="outline">
              <Icon name="RefreshCw" className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading system logs...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeErrors = errors?.filter(e => !e.resolved) || [];
  const fixedErrors = errors?.filter(e => e.resolved) || [];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Icon name="Bug" className="h-5 w-5" />
              System Log ({activeErrors.length} active, {fixedErrors.length} fixed)
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={refetch} variant="outline" size="sm">
                <Icon name="RefreshCw" className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              {fixedErrors.length > 0 && (
                <Button onClick={handleClearFixed} variant="outline" size="sm">
                  <Icon name="Trash2" className="h-4 w-4 mr-2" />
                  Clear Fixed
                </Button>
              )}
              {errors && errors.length > 0 && (
                <Button onClick={handleClearAll} variant="outline" size="sm">
                  <Icon name="Trash" className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Active Errors */}
      {activeErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Active Issues ({activeErrors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeErrors.map((error) => (
                <div key={error.id} className="border rounded-lg p-4 bg-destructive/5">
                  {/* Error Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={severityColors[error.severity]}>
                          {severityLabels[error.severity]}
                        </Badge>
                        <span className="text-sm text-muted-foreground font-mono">
                          {error.errorId}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(error.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <h4 className="font-medium text-foreground mb-2">
                        {error.message}
                      </h4>
                      {error.url && (
                        <p className="text-sm text-muted-foreground mb-2">
                          <Icon name="Globe" className="h-3 w-3 inline mr-1" />
                          {error.url}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleErrorExpansion(error.id)}
                      >
                        <Icon
                          name={expandedErrors.has(error.id) ? "ChevronUp" : "ChevronDown"}
                          className="h-4 w-4"
                        />
                        {expandedErrors.has(error.id) ? 'Hide' : 'Details'}
                      </Button>
                      <Button
                        onClick={() => handleMarkAsFixed(error.id)}
                        size="sm"
                        variant="default"
                        className="bg-success-foreground hover:bg-success-foreground/90 text-success-soft-background"
                      >
                        <Icon name="CheckCircle" className="h-4 w-4 mr-2" />
                        Fixed
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Error Details */}
                  {expandedErrors.has(error.id) && (
                    <div className="space-y-4 pt-4 border-t">
                      {/* Technical Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <Icon name="Info" className="h-4 w-4" />
                            Technical Details
                          </h5>
                          <div className="space-y-2 text-sm">
                            {error.digest && (
                              <div>
                                <span className="font-medium text-muted-foreground">Digest:</span>
                                <span className="font-mono ml-2">{error.digest}</span>
                              </div>
                            )}
                            <div>
                              <span className="font-medium text-muted-foreground">Date:</span>
                              <span className="ml-2">{new Date(error.createdAt).toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">User:</span>
                              <span className="ml-2">{error.user?.name || error.userId || 'Anonymous'}</span>
                            </div>
                            {error.userAgent && (
                              <div>
                                <span className="font-medium text-muted-foreground">Browser:</span>
                                <span className="ml-2 text-xs">{error.userAgent}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stack Trace */}
                      {error.stack && (
                        <div>
                          <h5 className="font-medium mb-2 flex items-center gap-2">
                            <Icon name="Code" className="h-4 w-4" />
                            Stack Trace
                          </h5>
                          <div className="bg-muted p-3 rounded-md">
                            <pre className="text-xs text-muted-foreground whitespace-pre-wrap overflow-x-auto">
                              {error.stack}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fixed Errors */}
      {fixedErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-success-foreground">Resolved Issues ({fixedErrors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {fixedErrors.map((error) => (
                <div key={error.id} className="flex items-center justify-between p-3 bg-success-soft-background rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{error.message}</p>
                    <p className="text-xs text-muted-foreground">
                      Fixed at {new Date(error.updatedAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-success-soft-background text-success-foreground">
                    Fixed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Errors */}
      {errors && errors.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Icon name="CheckCircle" className="h-12 w-12 text-success-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-success-foreground mb-2">All Systems Operational</h3>
              <p className="text-muted-foreground">
                Your system is running smoothly! No issues have been detected.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
