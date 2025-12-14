import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getApiClient, handleApiError } from '../lib/api-client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Search, Plus, Mail, UserPlus, Loader2, Edit, Key, Copy, X, ChevronDown, ChevronUp,
  Phone, CheckCircle2
} from 'lucide-react';
import { formatDate } from '../lib/utils';
import { THERAPY_LABELS } from '../lib/constants';
import { toast } from 'sonner';
import type { TherapistResponse, StaffAccessCodeResponse } from '../types/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

interface TherapistFormData {
  fullName: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended';
  specialization: Array<'ABA' | 'Speech' | 'OT'>;
  generateAccessCode: boolean;
  isAdmin: boolean;
}

export function Therapists() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [therapists, setTherapists] = useState<TherapistResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTherapist, setEditingTherapist] = useState<TherapistResponse | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expandedTherapist, setExpandedTherapist] = useState<string | null>(null);
  const [accessCodes, setAccessCodes] = useState<Record<string, StaffAccessCodeResponse[]>>({});
  const [loadingCodes, setLoadingCodes] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<TherapistFormData>({
    fullName: '',
    email: '',
    phone: '',
    status: 'active',
    specialization: [],
    generateAccessCode: false,
    isAdmin: false,
  });

  // Fetch therapists from API
  useEffect(() => {
    const fetchTherapists = async () => {
      setLoading(true);
      try {
        const api = getApiClient();
        const response = await api.adminTherapists.list({
          q: searchQuery || undefined,
          size: 100,
        });
        setTherapists(response.items || []);
      } catch (error) {
        handleApiError(error);
        toast.error('Failed to load therapists');
        setTherapists([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchTherapists();
    }, searchQuery ? 300 : 0);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Fetch access codes for a therapist
  const fetchAccessCodes = async (therapistId: string) => {
    if (!therapistId) return;
    
    setLoadingCodes(prev => ({ ...prev, [therapistId]: true }));
    try {
      const api = getApiClient();
      const codes = await api.adminStaffAccessCodes.list2({
        userId: therapistId,
        active: true,
      });
      setAccessCodes(prev => ({ ...prev, [therapistId]: codes || [] }));
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to load access codes');
    } finally {
      setLoadingCodes(prev => ({ ...prev, [therapistId]: false }));
    }
  };

  const handleToggleExpand = (therapistId: string) => {
    if (expandedTherapist === therapistId) {
      setExpandedTherapist(null);
    } else {
      setExpandedTherapist(therapistId);
      if (!accessCodes[therapistId]) {
        fetchAccessCodes(therapistId);
      }
    }
  };

  const handleCreateAccessCode = async (therapistId: string, isAdmin: boolean = false) => {
    try {
      const api = getApiClient();
      const newCode = await api.adminStaffAccessCodes.create2({
        requestBody: {
          userId: therapistId,
          admin: isAdmin,
        },
      });
      
      toast.success('Access code created successfully');
      if (newCode.code) {
        navigator.clipboard.writeText(newCode.code);
        toast.info('Access code copied to clipboard');
      }
      
      // Refresh access codes
      fetchAccessCodes(therapistId);
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to create access code');
    }
  };

  const handleRevokeAccessCode = async (codeId: string, therapistId: string) => {
    if (!confirm('Are you sure you want to revoke this access code? It will no longer be usable.')) {
      return;
    }

    try {
      const api = getApiClient();
      await api.adminStaffAccessCodes.revoke({ id: codeId });
      toast.success('Access code revoked');
      fetchAccessCodes(therapistId);
    } catch (error) {
      handleApiError(error);
      toast.error('Failed to revoke access code');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Access code copied to clipboard');
  };

  const handleOpenAddForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      status: 'active',
      specialization: [],
      generateAccessCode: false,
      isAdmin: false,
    });
    setEditingTherapist(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (therapist: TherapistResponse) => {
    setFormData({
      fullName: therapist.fullName || '',
      email: therapist.email || '',
      phone: therapist.phone || '',
      status: (therapist.status as 'active' | 'inactive' | 'suspended') || 'active',
      specialization: therapist.specialization || [],
      generateAccessCode: false,
      isAdmin: false,
    });
    setEditingTherapist(therapist);
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName.trim()) {
      toast.error('Full name is required');
      return;
    }
    try {
      const api = getApiClient();
      
      if (editingTherapist?.id) {
        // Update existing therapist
        await api.adminTherapists.update1({
          therapistId: editingTherapist.id,
          requestBody: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            status: formData.status,
            specialization: formData.specialization,
          },
        });
        toast.success('Therapist updated successfully');
      } else {
        // Create new therapist
        await api.adminTherapists.create({
          requestBody: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            status: formData.status,
            specialization: formData.specialization,
            generateAccessCode: formData.generateAccessCode,
            isAdmin: formData.isAdmin,
          },
        });
        toast.success('Therapist created successfully');
      }
      
      setIsFormOpen(false);
      // Refresh therapists list
      const response = await api.adminTherapists.list({ size: 100 });
      setTherapists(response.items || []);
    } catch (error) {
      handleApiError(error);
      toast.error(editingTherapist ? 'Failed to update therapist' : 'Failed to create therapist');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl">Therapist Management</h1>
        {user?.admin && (
          <Button className="gap-2 bg-teal-600 hover:bg-teal-700" onClick={handleOpenAddForm}>
            <Plus className="size-4" />
            Add Therapist
          </Button>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Therapists List */}
      <Card>
        <CardHeader>
          <CardTitle>{therapists.length} Therapists</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-[#0B5B45]" />
              <span className="ml-2 text-slate-600">Loading therapists...</span>
            </div>
          ) : therapists.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">
                {searchQuery ? 'No therapists found matching your search' : 'No therapists found'}
              </p>
              {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {therapists.map(therapist => {
                const isExpanded = expandedTherapist === therapist.id;
                const therapistCodes = accessCodes[therapist.id || ''] || [];
                const isLoadingCodes = loadingCodes[therapist.id || ''] || false;

                return (
                <Card key={therapist.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center size-12 rounded-full bg-teal-100 text-teal-700">
                        <span className="text-lg">👩‍⚕️</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{therapist.fullName || 'Unknown'}</h3>
                          <Badge
                            variant="outline"
                            className={
                              therapist.status === 'active'
                                ? 'text-green-700 border-green-700'
                                : 'text-slate-600 border-slate-300'
                            }
                          >
                              {therapist.status || 'unknown'}
                          </Badge>
                        </div>

                        <div className="space-y-1 text-sm text-slate-600">
                            {therapist.email && (
                          <p className="flex items-center gap-2">
                            <Mail className="size-4" />
                            {therapist.email}
                          </p>
                            )}
                            {therapist.phone && (
                              <p className="flex items-center gap-2">
                                <Phone className="size-4" />
                                {therapist.phone}
                              </p>
                            )}
                            {therapist.specialization && therapist.specialization.length > 0 && (
                            <p>
                              <span className="text-slate-500">Specializations: </span>
                                {therapist.specialization.map(s => THERAPY_LABELS[s] || s).join(', ')}
                            </p>
                          )}
                          {therapist.lastLogin && (
                            <p className="text-slate-500">
                                Last login: {formatDate(new Date(therapist.lastLogin))}
                            </p>
                          )}
                        </div>
                      </div>

                        {user?.admin && (
                        <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenEditForm(therapist)}
                            >
                              <Edit className="size-4 mr-1" />
                            Edit
                          </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() => handleToggleExpand(therapist.id || '')}
                            >
                              <Key className="size-4" />
                              {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Access Codes Section */}
                      {isExpanded && user?.admin && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-sm">Access Codes</h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCreateAccessCode(therapist.id || '', false)}
                            >
                              <Plus className="size-4 mr-1" />
                              Generate Code
                            </Button>
                          </div>

                          {isLoadingCodes ? (
                            <div className="flex items-center justify-center py-4">
                              <Loader2 className="size-4 animate-spin text-[#0B5B45]" />
                              <span className="ml-2 text-sm text-slate-600">Loading codes...</span>
                            </div>
                          ) : therapistCodes.length === 0 ? (
                            <div className="text-center py-4 text-sm text-slate-500">
                              No access codes found. Generate one to get started.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {therapistCodes.map(code => (
                                <div
                                  key={code.id}
                                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <code className="font-mono text-sm font-medium">
                                        {code.code || 'N/A'}
                                      </code>
                                      {code.admin && (
                                        <Badge variant="default" className="bg-purple-600 text-xs">
                                          Admin
                                        </Badge>
                                      )}
                                      {code.active ? (
                                        <Badge variant="outline" className="text-green-700 border-green-700 text-xs">
                                          Active
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline" className="text-red-700 border-red-700 text-xs">
                                          Inactive
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-xs text-slate-500 space-y-1">
                                      {code.createdAt && (
                                        <p>Created: {formatDate(new Date(code.createdAt))}</p>
                                      )}
                                      {code.lastUsed && (
                                        <p>Last used: {formatDate(new Date(code.lastUsed))}</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-2 ml-4">
                                    {code.code && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCopyCode(code.code!)}
                                      >
                                        <Copy className="size-4" />
                                      </Button>
                                    )}
                                    {code.active && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleRevokeAccessCode(code.id || '', therapist.id || '')}
                                      >
                                        <X className="size-4" />
                          </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                  </CardContent>
                </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Therapist Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTherapist ? 'Edit Therapist' : 'Add Therapist'}
            </DialogTitle>
            <DialogDescription>
              {editingTherapist
                ? 'Update therapist information'
                : 'Create a new therapist account. You can optionally generate an access code.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'inactive' | 'suspended') =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Specializations</Label>
              <div className="flex flex-wrap gap-4">
                {(['ABA', 'Speech', 'OT'] as const).map((therapy) => {
                  // Map API values to lowercase for THERAPY_LABELS lookup
                  const therapyKey = therapy.toLowerCase() as 'aba' | 'speech' | 'ot';
                  const label = THERAPY_LABELS[therapyKey] || therapy;
                  
                  return (
                    <div key={therapy} className="flex items-center gap-2">
                      <Checkbox
                        id={`specialization-${therapy}`}
                        checked={formData.specialization.includes(therapy)}
                        onCheckedChange={(checked) => {
                          const current = formData.specialization;
                          if (checked) {
                            setFormData({ ...formData, specialization: [...current, therapy] });
                          } else {
                            setFormData({
                              ...formData,
                              specialization: current.filter((t) => t !== therapy),
                            });
                          }
                        }}
                      />
                      <label 
                        htmlFor={`specialization-${therapy}`} 
                        className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {label}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {!editingTherapist && (
              <>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="generateAccessCode"
                    checked={formData.generateAccessCode}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, generateAccessCode: !!checked })
                    }
                  />
                  <Label htmlFor="generateAccessCode" className="font-normal cursor-pointer !mt-0">
                    Generate access code
                  </Label>
                </div>

                {formData.generateAccessCode && (
                  <div className="flex items-center gap-2 pl-6">
                    <Checkbox
                      id="isAdmin"
                      checked={formData.isAdmin}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isAdmin: !!checked })
                      }
                    />
                    <Label htmlFor="isAdmin" className="font-normal cursor-pointer !mt-0">
                      Make this an admin code
                    </Label>
                  </div>
                )}
              </>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
                {editingTherapist ? 'Update' : 'Create'} Therapist
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
