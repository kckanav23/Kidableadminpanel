export type TherapistsListParams = {
  q?: string;
  status?: string;
  page?: number;
  size?: number;
};

export type StaffAccessCodesListParams = {
  userId: string;
  active?: boolean;
};

export const therapistKeys = {
  all: ['therapists'] as const,
  lists: () => [...therapistKeys.all, 'list'] as const,
  list: (params: TherapistsListParams) => [...therapistKeys.lists(), params] as const,
  staffCodes: (params: StaffAccessCodesListParams) => [...therapistKeys.all, 'staff-access-codes', params] as const,
};


