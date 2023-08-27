import {useStorage} from '@vueuse/core'
import {defineStore} from 'pinia'
import {Wallet, utils} from 'ethers';

export interface IAccount {
  address: string;
  mnemonic: string;
  private: string;
  email: string;
}

const ACCOUNT_STORAGE_KEY = 'amplify_local_account'

export const useAccountStore = defineStore('account', () => {
  const account = useStorage<IAccount | null>(
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
    const {address, mnemonic, privateKey} = Wallet.fromMnemonic(
      utils.entropyToMnemonic(utils.randomBytes(32))
    )

    account.value = {
      address,
      mnemonic: mnemonic.phrase,
      private: privateKey,
      email,
    }
  }

  const signOut = () => {
    account.value = null
  }

  return {
    account,
    signIn,
    signOut,
  }
})
