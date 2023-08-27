import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export interface IFollowing {
  nftId: number;
}

const FOLLOWINGS_STORAGE_KEY = 'amplify_followings'

export const useFollowingsStore = defineStore('followings', () => {
  const following = useStorage<IFollowing | null>(
    FOLLOWINGS_STORAGE_KEY,
    null,
    localStorage,
    {
      serializer: {
        read: (v: any) => v ? JSON.parse(v) : null,
        write: (v: any) => JSON.stringify(v),
      },
    }
  )

  return {
    following,
  }
})
