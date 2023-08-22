import * as dotenv from 'dotenv'
import {Sr25519Account} from '@unique-nft/sr25519'
import Sdk from '@unique-nft/sdk'

dotenv.config()

export const getSdk = () => {
  const seed = process.env.SUBSTRATE_ADMIN_SEED
  if (!seed)
    throw new Error('env var SUBSTRATE_ADMIN_SEED is not defined')

  const sdkBaseUrl = process.env.SDK_BASE_URL
  if (!sdkBaseUrl) throw new Error('env var SDK_BASE_URL is not defined')

  const sdk = new Sdk({
    baseUrl: sdkBaseUrl,
    account: Sr25519Account.fromUri(seed)
  })

  return sdk
}
