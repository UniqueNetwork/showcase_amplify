import * as dotenv from 'dotenv'
import {Sr25519Account} from '@unique-nft/sr25519'
import Sdk from '@unique-nft/sdk'
import {createError} from 'h3'

dotenv.config()

export const getSdk = () => {
  const runtimeConfig = useRuntimeConfig()
  const {substrateAdminSeed} = runtimeConfig
  const {sdkBaseUrl} = runtimeConfig.public

  if (!substrateAdminSeed)
    throw createError({statusCode: 500, statusText: 'env var SUBSTRATE_ADMIN_SEED is not defined'})


  if (!sdkBaseUrl)
    throw createError({statusCode: 500, statusText: 'env var SDK_BASE_URL is not defined'})

  const sdk = new Sdk({
    baseUrl: sdkBaseUrl,
    account: Sr25519Account.fromUri(substrateAdminSeed)
  })

  return sdk
}
