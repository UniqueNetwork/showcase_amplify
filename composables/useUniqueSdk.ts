import Sdk, {Options as SdkOptions} from '@unique-nft/sdk'
import {Sr25519Account} from '@unique-nft/sr25519'

export const useUniqueSdk = (mnemonicString?: string) => {
  const runtimeConfig = useRuntimeConfig().public

  const options: SdkOptions = {baseUrl: runtimeConfig.sdkBaseUrl}
  if (typeof mnemonicString === 'string') {
    options.account = Sr25519Account.fromUri(mnemonicString)
  }

  return new Sdk(options)
}
