import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import {Sr25519Account} from '@unique-nft/sr25519'
import { STATE, useAppStateStore } from './state';

export interface IAccount {
  address: string;
  mnemonic: string;
  email: string;
}

const ACCOUNT_STORAGE_KEY = 'amplify_local_account'

export const useAccountStore = defineStore('account-store', () => {
  const account = useStorage<IAccount>(
    ACCOUNT_STORAGE_KEY,
    null,
    localStorage,
    { 
      serializer: {
        read: (v: any) => v ? JSON.parse(v) : null,
        write: (v: any) => JSON.stringify(v),
      },
    }
  )

  const signIn = (email: string) => {
    const mnemonic = Sr25519Account.generateMnemonic()
    const { address } = Sr25519Account.fromUri(mnemonic)

    account.value = {
      address,
      mnemonic,
      email,
    }
  }

  return {
    account,
    signIn,
  }
})
