import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getApiClient, handleApiError } from '../lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Search, Plus, Eye, Loader2, Edit, Trash2, X } from 'lucide-react';
import { STRATEGY_TYPE_LABELS, ZONE_LABELS } from '../lib/constants';
import { toast } from 'sonner';
import type { StrategyLibraryResponse } from '../types/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

interface StrategyFormData {
  title: string;
  description: string;
  type: 'antecedent' | 'reinforcement' | 'regulation';
  whenToUse: string;
  howToUse: string;
  steps: string[];
  examples: string[];
  targetZone: 'green' | 'yellow' | 'orange' | 'red' | 'blue' | '';
  global: boolean;
}

export function Strategies() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [strategies, setStrategies] = useState<StrategyLibraryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingStrategy, setViewingStrategy] = useState<StrategyLibraryResponse | null>(null);
  const [editingStrategy, setEditingStrategy] = useState<StrategyLibraryResponse | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState<StrategyFormData>({
    title: '',
    description: '',
    type: 'antecedent',
    whenToUse: '',
    howToUse: '',
    steps: [],
    examples: [],
    targetZone: '',
    global: true,
  });
  const [newStep, setNewStep] = useState('');
  const [newExample, setNewExample] = useState('');

  // Fetch strategies from API
  const fetchStrategies = async () => {
    setLoading(true);
    try {
      const api = getApiClient();
      const response = await api.adminStrategyLibrary.list1({
        q: searchQuery || undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        size: 100,
      });
      setStrategies(response.items || []);
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to load strategies');
      setStrategies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchStrategies();
    }, searchQuery ? 300 : 0);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, typeFilter]);

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      description: '',
      type: 'antecedent',
      whenToUse: '',
      howToUse: '',
      steps: [],
      examples: [],
      targetZone: '',
      global: true,
    });
    setNewStep('');
    setNewExample('');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (strategy: StrategyLibraryResponse) => {
    setEditingStrategy(strategy);
    setFormData({
      title: strategy.title || '',
      description: strategy.description || '',
      type: (strategy.type as any) || 'antecedent',
      whenToUse: strategy.whenToUse || '',
      howToUse: strategy.howToUse || '',
      steps: strategy.steps || [],
      examples: strategy.examples || [],
      targetZone: (strategy.targetZone as any) || '',
      global: strategy.global ?? true,
    });
    setNewStep('');
    setNewExample('');
    setIsEditOpen(true);
  };

  const handleOpenView = (strategy: StrategyLibraryResponse) => {
    setViewingStrategy(strategy);
    setIsViewOpen(true);
  };

  const addStep = () => {
    if (newStep.trim()) {
      setFormData({ ...formData, steps: [...formData.steps, newStep.trim()] });
      setNewStep('');
    }
  };

  const removeStep = (index: number) => {
    setFormData({ ...formData, steps: formData.steps.filter((_, i) => i !== index) });
  };

  const addExample = () => {
    if (newExample.trim()) {
      setFormData({ ...formData, examples: [...formData.examples, newExample.trim()] });
      setNewExample('');
    }
  };

  const removeExample = (index: number) => {
    setFormData({ ...formData, examples: formData.examples.filter((_, i) => i !== index) });
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      const api = getApiClient();
      await api.adminStrategyLibrary.create1({
        requestBody: {
          title: formData.title,
          description: formData.description || undefined,
          type: formData.type,
          whenToUse: formData.whenToUse || undefined,
          howToUse: formData.howToUse || undefined,
          steps: formData.steps.length > 0 ? formData.steps : undefined,
          examples: formData.examples.length > 0 ? formData.examples : undefined,
          targetZone: formData.targetZone || undefined,
          global: formData.global,
        },
      });
      toast.success('Strategy created successfully');
      setIsAddOpen(false);
      fetchStrategies();
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to create strategy');
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStrategy?.id) return;
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      const api = getApiClient();
      await api.adminStrategyLibrary.update2({
        strategyId: editingStrategy.id,
        requestBody: {
          title: formData.title,
          description: formData.description || undefined,
          type: formData.type,
          whenToUse: formData.whenToUse || undefined,
          howToUse: formData.howToUse || undefined,
          steps: formData.steps.length > 0 ? formData.steps : undefined,
          examples: formData.examples.length > 0 ? formData.examples : undefined,
          targetZone: formData.targetZone || undefined,
          global: formData.global,
        },
      });
      toast.success('Strategy updated successfully');
      setIsEditOpen(false);
      setEditingStrategy(null);
      fetchStrategies();
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to update strategy');
    }
  };

  const handleDelete = async (strategy: StrategyLibraryResponse) => {
    if (!strategy.id) return;
    if (!confirm(`Are you sure you want to delete "${strategy.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const api = getApiClient();
      await api.adminStrategyLibrary.delete1({ strategyId: strategy.id });
      toast.success('Strategy deleted successfully');
      fetchStrategies();
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to delete strategy');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Strategy Library</h1>
        {user?.admin && (
          <Button className="gap-2 bg-teal-600 hover:bg-teal-700" onClick={handleOpenAdd}>
            <Plus className="size-4" />
            New Strategy
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search strategies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="antecedent">Antecedent</SelectItem>
                <SelectItem value="reinforcement">Reinforcement</SelectItem>
                <SelectItem value="regulation">Regulation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Strategies List */}
      <Card>
        <CardHeader>
          <CardTitle>{strategies.length} Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-[#0B5B45]" />
              <span className="ml-2 text-slate-600">Loading strategies...</span>
            </div>
          ) : strategies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">
                {searchQuery || typeFilter !== 'all'
                  ? 'No strategies found matching your filters'
                  : 'No strategies found'}
              </p>
              {(searchQuery || typeFilter !== 'all') && (
                <Button variant="outline" onClick={() => { setSearchQuery(''); setTypeFilter('all'); }}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {strategies.map(strategy => {
                const strategyType = strategy.type?.toLowerCase() as 'antecedent' | 'reinforcement' | 'regulation' | undefined;
                const typeLabel = strategyType ? STRATEGY_TYPE_LABELS[strategyType] : strategy.type || 'Unknown';

                return (
                  <Card key={strategy.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{strategy.title || 'Untitled'}</CardTitle>
                            <Badge variant="outline" className="text-teal-700 border-teal-700">
                              {typeLabel}
                            </Badge>
                            {strategy.targetZone && (
                              <Badge variant="secondary" className="capitalize">
                                {ZONE_LABELS[strategy.targetZone as keyof typeof ZONE_LABELS]}
                              </Badge>
                            )}
                          </div>
                          {strategy.description && (
                            <p className="text-sm text-slate-600">{strategy.description}</p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {strategy.whenToUse && (
                        <div>
                          <p className="text-sm text-slate-600 mb-1">When to Use</p>
                          <p className="text-sm">{strategy.whenToUse}</p>
                        </div>
                      )}

                      {strategy.howToUse && (
                        <div>
                          <p className="text-sm text-slate-600 mb-1">How to Use</p>
                          <p className="text-sm whitespace-pre-line">{strategy.howToUse}</p>
                        </div>
                      )}

                      {strategy.steps && strategy.steps.length > 0 && (
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Steps</p>
                          <ul className="text-sm list-disc list-inside space-y-1">
                            {strategy.steps.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {strategy.examples && strategy.examples.length > 0 && (
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Examples</p>
                          <ul className="text-sm list-disc list-inside space-y-1">
                            {strategy.examples.map((example, idx) => (
                              <li key={idx}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2 border-t">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                          onClick={() => handleOpenView(strategy)}
                        >
                          <Eye className="size-4" />
                          View Details
                        </Button>
                        {user?.admin && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleOpenEdit(strategy)}
                            >
                              <Edit className="size-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(strategy)}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingStrategy?.title || 'Strategy Details'}</DialogTitle>
            <DialogDescription>View complete strategy information</DialogDescription>
          </DialogHeader>
          {viewingStrategy && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Label className="text-sm font-medium text-slate-600">Type</Label>
                <Badge variant="outline" className="text-teal-700 border-teal-700">
                  {STRATEGY_TYPE_LABELS[(viewingStrategy.type?.toLowerCase() as any) || 'antecedent']}
                </Badge>
                {viewingStrategy.targetZone && (
                  <Badge variant="secondary" className="capitalize">
                    {ZONE_LABELS[viewingStrategy.targetZone as keyof typeof ZONE_LABELS]}
                  </Badge>
                )}
              </div>
              {viewingStrategy.description && (
                <div>
                  <Label className="text-sm font-medium text-slate-600">Description</Label>
                  <p className="mt-1 text-sm">{viewingStrategy.description}</p>
                </div>
              )}
              {viewingStrategy.whenToUse && (
                <div>
                  <Label className="text-sm font-medium text-slate-600">When to Use</Label>
                  <p className="mt-1 text-sm">{viewingStrategy.whenToUse}</p>
                </div>
              )}
              {viewingStrategy.howToUse && (
                <div>
                  <Label className="text-sm font-medium text-slate-600">How to Use</Label>
                  <p className="mt-1 text-sm whitespace-pre-line">{viewingStrategy.howToUse}</p>
                </div>
              )}
              {viewingStrategy.steps && viewingStrategy.steps.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-slate-600">Steps</Label>
                  <ul className="mt-1 text-sm list-disc list-inside space-y-1">
                    {viewingStrategy.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
              {viewingStrategy.examples && viewingStrategy.examples.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-slate-600">Examples</Label>
                  <ul className="mt-1 text-sm list-disc list-inside space-y-1">
                    {viewingStrategy.examples.map((example, idx) => (
                      <li key={idx}>{example}</li>
                    ))}
                  </ul>
                </div>
              )}
              {viewingStrategy.createdAt && (
                <div>
                  <Label className="text-sm font-medium text-slate-600">Created</Label>
                  <p className="mt-1 text-sm">{new Date(viewingStrategy.createdAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Strategy</DialogTitle>
            <DialogDescription>Create a new strategy in the library</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitAdd} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Strategy title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Strategy description"
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="antecedent">Antecedent</SelectItem>
                    <SelectItem value="reinforcement">Reinforcement</SelectItem>
                    <SelectItem value="regulation">Regulation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetZone">Target Zone</Label>
                <Select
                  value={formData.targetZone || undefined}
                  onValueChange={(value: any) => setFormData({ ...formData, targetZone: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select zone (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="green">Green Zone</SelectItem>
                    <SelectItem value="yellow">Yellow Zone</SelectItem>
                    <SelectItem value="orange">Orange Zone</SelectItem>
                    <SelectItem value="red">Red Zone</SelectItem>
                    <SelectItem value="blue">Blue Zone</SelectItem>
                  </SelectContent>
                </Select>
                {formData.targetZone && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-slate-500"
                    onClick={() => setFormData({ ...formData, targetZone: '' })}
                  >
                    Clear zone
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whenToUse">When to Use</Label>
              <Textarea
                id="whenToUse"
                value={formData.whenToUse}
                onChange={(e) => setFormData({ ...formData, whenToUse: e.target.value })}
                placeholder="Describe when this strategy should be used"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="howToUse">How to Use</Label>
              <Textarea
                id="howToUse"
                value={formData.howToUse}
                onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
                placeholder="Describe how to implement this strategy"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Steps</Label>
              <div className="space-y-2">
                {formData.steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-sm flex-1">{idx + 1}. {step}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStep(idx)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addStep();
                      }
                    }}
                    placeholder="Add a step..."
                  />
                  <Button type="button" onClick={addStep} variant="outline">
                    Add
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Examples</Label>
              <div className="space-y-2">
                {formData.examples.map((example, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-sm flex-1">• {example}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExample(idx)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={newExample}
                    onChange={(e) => setNewExample(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addExample();
                      }
                    }}
                    placeholder="Add an example..."
                  />
                  <Button type="button" onClick={addExample} variant="outline">
                    Add
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="global"
                checked={formData.global}
                onChange={(e) => setFormData({ ...formData, global: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="global" className="font-normal cursor-pointer">
                Make this a global strategy
              </Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                Create Strategy
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Strategy</DialogTitle>
            <DialogDescription>Update strategy information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Strategy title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Strategy description"
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: any) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="antecedent">Antecedent</SelectItem>
                    <SelectItem value="reinforcement">Reinforcement</SelectItem>
                    <SelectItem value="regulation">Regulation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-targetZone">Target Zone</Label>
                <Select
                  value={formData.targetZone || undefined}
                  onValueChange={(value: any) => setFormData({ ...formData, targetZone: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select zone (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="green">Green Zone</SelectItem>
                    <SelectItem value="yellow">Yellow Zone</SelectItem>
                    <SelectItem value="orange">Orange Zone</SelectItem>
                    <SelectItem value="red">Red Zone</SelectItem>
                    <SelectItem value="blue">Blue Zone</SelectItem>
                  </SelectContent>
                </Select>
                {formData.targetZone && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-slate-500"
                    onClick={() => setFormData({ ...formData, targetZone: '' })}
                  >
                    Clear zone
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-whenToUse">When to Use</Label>
              <Textarea
                id="edit-whenToUse"
                value={formData.whenToUse}
                onChange={(e) => setFormData({ ...formData, whenToUse: e.target.value })}
                placeholder="Describe when this strategy should be used"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-howToUse">How to Use</Label>
              <Textarea
                id="edit-howToUse"
                value={formData.howToUse}
                onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
                placeholder="Describe how to implement this strategy"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Steps</Label>
              <div className="space-y-2">
                {formData.steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-sm flex-1">{idx + 1}. {step}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStep(idx)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={newStep}
                    onChange={(e) => setNewStep(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addStep();
                      }
                    }}
                    placeholder="Add a step..."
                  />
                  <Button type="button" onClick={addStep} variant="outline">
                    Add
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Examples</Label>
              <div className="space-y-2">
                {formData.examples.map((example, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-sm flex-1">• {example}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExample(idx)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={newExample}
                    onChange={(e) => setNewExample(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addExample();
                      }
                    }}
                    placeholder="Add an example..."
                  />
                  <Button type="button" onClick={addExample} variant="outline">
                    Add
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-global"
                checked={formData.global}
                onChange={(e) => setFormData({ ...formData, global: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="edit-global" className="font-normal cursor-pointer">
                Make this a global strategy
              </Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                Update Strategy
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
