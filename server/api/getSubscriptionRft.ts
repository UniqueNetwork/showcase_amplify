import {getNonce, getSdk} from '~/minter/utils'
import * as dotenv from 'dotenv'
import {createError} from 'h3'
import {createArtistNFTForAddress} from '~/minter/minters'
import {Address} from '@unique-nft/utils/address'

dotenv.config()

export default defineEventHandler(async (event) => {
  const sdk = getSdk()
  if (!sdk) throw createError({statusCode: 500, statusText: 'SDK_NOT_DEFINED'})

  const collectionIds = useRuntimeConfig().public

  if (isNaN(collectionIds.followingRftCollectionId)) {
    throw createError({statusCode: 400, statusText: 'Following RFT collection id is not defined',})
  }
  if (isNaN(collectionIds.followingRftTokenId)) {
    throw createError({statusCode: 400, statusText: 'Following RFT token id is not defined',})
  }

  const query = getQuery(event)
  const address = query.address as string
  const tokenId = parseInt(query.tokenId as string || '', 10)

  if (!tokenId) {
    throw createError({statusCode: 400, statusText: 'Token id is not defined',})
  }

  const sanitizedAddress = Address.extract.addressNormalizedSafe(address)
  if (!sanitizedAddress) {
    throw createError({statusCode: 400, statusText: 'Address is not valid',})
  }

  const token = await sdk.token.get({
    collectionId: collectionIds.artistNftCollectionId,
    tokenId,
  })
  const methodToCompare = Address.is.ethereumAddress(sanitizedAddress)
    ? Address.compare.ethereumAddresses
    : Address.compare.substrateAddresses

  if (!methodToCompare(token.owner, sanitizedAddress)) {
    throw createError({
      statusCode: 400,
      statusText: `Token is not owned by this address: ${sanitizedAddress} (${address})`,
    })
  }

  const nonce = await getNonce(sdk)

  const [rftToUser, rftToNft] = await Promise.all([
    sdk.refungible.transferToken({
      collectionId: collectionIds.followingRftCollectionId,
      tokenId: collectionIds.followingRftTokenId,
      from: sdk.options.account?.address!,
      to: sanitizedAddress,
      amount: 1,
    }, {nonce}),
    sdk.refungible.transferToken({
      collectionId: collectionIds.followingRftCollectionId,
      tokenId: collectionIds.followingRftTokenId,
      from: sdk.options.account?.address!,
      to: Address.nesting.idsToAddress(token.collectionId, token.tokenId),
      amount: 1,
    }, {nonce: nonce + 1}),
  ])

  return {ok: 1, rftToUser: rftToUser.parsed, rftToNft: rftToNft.parsed}
})
