import Sdk from '@unique-nft/sdk'

export const createArtistNFTCollection = async (sdk: Sdk) => {
  const collectionCreationResult = await sdk.collection.create({
    name: 'Marco Brun',
    description: 'Marco Brun Artist NFT Collection',
    tokenPrefix: 'MARCO',
    //todo: schema
    //schema: {}
  })

  const collectionId = collectionCreationResult.parsed?.collectionId
  if (!collectionId) throw collectionCreationResult.error
  return {collectionId}
}

export const createAmpxFTCollection = async (sdk: Sdk, options = {decimals: 2, amount: 10000}) => {
  const amount = options.decimals * options.amount
  if (amount > Number.MAX_SAFE_INTEGER) {
    // integer is the limitation of the SDK, it doesnt takes bigint according to the typings
    throw new Error('amount is too big')
  }

  const collectionCreationResult = await sdk.fungible.createCollection({
    mode: 'Fungible',
    decimals: options.decimals,

    name: 'AMPX',
    description: 'AMPX FT Collection',
    tokenPrefix: 'AMPX',
    sponsorship: {
      address: sdk.options.account?.address,
    } as any,
  })

  const collectionId = collectionCreationResult.parsed?.collectionId
  if (!collectionId) throw collectionCreationResult.error

  const nonce = (await sdk.common.getNonce({address: sdk.options.account?.address!})).nonce

  const [confirmSponsorshipResult, mintResult] = await Promise.all([
    sdk.collection.confirmSponsorship(
      {collectionId},
      {nonce}
    ),
    sdk.fungible.addTokens(
      {collectionId, amount},
      {nonce: nonce + 1}
    )
  ])

  if (!mintResult.parsed?.collectionId) throw mintResult.error
  if (!confirmSponsorshipResult.parsed?.collectionId) throw confirmSponsorshipResult.error

  return {
    collectionId,
    amount,
  }
}

export const createFollowingRFTCollection = async (sdk: Sdk) => {
  const collectionCreationResult = await sdk.refungible.createCollection({
    name: 'Marco followers',
    description: 'Macro Brun followers badges',
    tokenPrefix: 'MARCO_F',
    //todo: schema
    //schema: {}
  })

  const collectionId = collectionCreationResult.parsed?.collectionId
  if (!collectionId) throw collectionCreationResult.error
  return {collectionId}
}

export const mintFollowingRFTTokenForMonth = async (sdk: Sdk, collectionId: number) => {
  const tokenCreationResult = await sdk.refungible.createToken({
    collectionId,

    //todo: data
    //data: {}
    amount: 1000000,
  })
  if (!tokenCreationResult.parsed?.tokenId) throw tokenCreationResult.error

  return {
    tokenId: tokenCreationResult.parsed.tokenId,
    collectionId: tokenCreationResult.parsed.collectionId,
    amount: tokenCreationResult.parsed.amount,
  }
}
