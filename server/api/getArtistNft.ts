import {getNonce, getSdk} from '~/minter/utils'
import * as dotenv from 'dotenv'
import {createError} from 'h3'
import {createArtistNFTForAddress} from '~/minter/minters'
import {Address} from '@unique-nft/utils/address'

dotenv.config()

export default defineEventHandler(async (event) => {
  const sdk = getSdk()
  if (!sdk) throw createError({statusCode: 500, statusText: 'SDK_NOT_DEFINED'})

  const collectionId = parseInt(process.env.ARTIST_NFT_COLLECTION_ID || '', 10)
  if (isNaN(collectionId)) {
    throw createError({statusCode: 400, statusText: 'Artist NFT collection id is not defined',})
  }

  const query = getQuery(event)
  const address = query.address as string

  const sanitizedAddress = Address.extract.addressNormalizedSafe(address)
  if (!sanitizedAddress) {
    throw createError({statusCode: 400, statusText: 'Address is not valid',})
  }

  const result = await createArtistNFTForAddress(sdk, collectionId, sanitizedAddress)

  const nonce = await getNonce(sdk)
  const config = useRuntimeConfig()
  const ampxFtCollectionId = config.public.ampxFtCollectionId


  const [ftToUser, ftNested] = await Promise.all([
    sdk.fungible.transferTokens({
      collectionId: ampxFtCollectionId,
      from: sdk.options.account?.address!,
      recipient: sanitizedAddress,
      amount: 5,
    }, {nonce}),
    sdk.fungible.transferTokens({
      collectionId: ampxFtCollectionId,
      from: sdk.options.account?.address!,
      recipient: Address.nesting.idsToAddress(result.collectionId, result.tokenId),
      amount: 5,
    }, {nonce: nonce + 1}),
  ])

  if (!ftToUser.parsed?.collectionId) {
    console.log('error on ftToUser', ftToUser.error)
    throw ftToUser.error
  }
  if (!ftNested.parsed?.collectionId) {
    console.log('error on ftNested', ftNested.error)
    throw ftNested.error
  }

  return {ok: 1, nft: result, ftToUser: ftToUser.parsed, ftNested: ftNested.parsed}
})
