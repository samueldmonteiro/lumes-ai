'use client';

import { useState, useCallback } from 'react';
import { updateProfileAction } from '@/actions/user';
import type { UpdateUser, User } from '@/types/user.type';
import type { ActionResponse } from '@/types/api.type';

export function useUpdateProfile() {
  const [isPending, setIsPending] = useState(false);

  const updateProfile = useCallback(async (data: UpdateUser): Promise<ActionResponse<User>> => {
    setIsPending(true);
    try {
      return await updateProfileAction(data);
    } finally {
      setIsPending(false);
    }
  }, []);

  return { updateProfile, isPending };
}
