import { defineStore } from 'pinia'
import { GetBundleResponse } from '@unique-nft/sdk'


export interface ITokensInfo {
  bundle: GetBundleResponse,
  followerFTBalance: string,
  nftBalance: string
}

export const useTokensInfoStore = defineStore('followings', () => {
  const tokensInfo = ref<ITokensInfo | null>(null)

  return {
    tokensInfo,
  }
})
