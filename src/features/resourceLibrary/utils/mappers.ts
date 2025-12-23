import type { ResourceCreateRequest, ResourceUpdateRequest } from '@/types/api';
import { ResourceCreateRequest as ResourceCreateRequestNs, ResourceUpdateRequest as ResourceUpdateRequestNs } from '@/types/api';
import type { ResourceFormData } from '@/features/resourceLibrary/types';

export type ResourceTypeKey = 'pdf' | 'video' | 'article' | 'worksheet' | 'link';

export function isResourceTypeFilter(value: string): value is 'all' | ResourceTypeKey {
  return value === 'all' || value === 'pdf' || value === 'video' || value === 'article' || value === 'worksheet' || value === 'link';
}

export function toCreateTypeEnum(value: ResourceFormData['type']): ResourceCreateRequestNs.type {
  if (value === 'pdf') return ResourceCreateRequestNs.type.PDF;
  if (value === 'video') return ResourceCreateRequestNs.type.VIDEO;
  if (value === 'article') return ResourceCreateRequestNs.type.ARTICLE;
  if (value === 'worksheet') return ResourceCreateRequestNs.type.WORKSHEET;
  return ResourceCreateRequestNs.type.LINK;
}

export function toUpdateTypeEnum(value: ResourceFormData['type']): ResourceUpdateRequestNs.type {
  if (value === 'pdf') return ResourceUpdateRequestNs.type.PDF;
  if (value === 'video') return ResourceUpdateRequestNs.type.VIDEO;
  if (value === 'article') return ResourceUpdateRequestNs.type.ARTICLE;
  if (value === 'worksheet') return ResourceUpdateRequestNs.type.WORKSHEET;
  return ResourceUpdateRequestNs.type.LINK;
}

export function parseFileSize(value: string): number | undefined {
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : undefined;
}

export function buildCreateRequest(data: ResourceFormData): ResourceCreateRequest {
  return {
    title: data.title,
    description: data.description || undefined,
    type: toCreateTypeEnum(data.type),
    category: data.category || undefined,
    fileUrl: data.fileUrl || undefined,
    fileSize: data.fileSize ? parseFileSize(data.fileSize) : undefined,
    global: data.global,
  };
}

export function buildUpdateRequest(data: ResourceFormData): ResourceUpdateRequest {
  return {
    title: data.title,
    description: data.description || undefined,
    type: toUpdateTypeEnum(data.type),
    category: data.category || undefined,
    fileUrl: data.fileUrl || undefined,
    fileSize: data.fileSize ? parseFileSize(data.fileSize) : undefined,
    global: data.global,
  };
}

export function formatFileSize(bytes?: number) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}


