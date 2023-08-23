import Sdk from '@unique-nft/sdk'
import {getMonthString} from "~/utils";
import {getNonce} from "~/minter/utils";
import {add} from "@noble/hashes/_u64";

export const createArtistNFTCollection = async (sdk: Sdk) => {
  const collectionCreationResult = await sdk.collection.create({
    name: 'Marco Brun',
    description: 'Marco Brun Artist NFT Collection',
    tokenPrefix: 'MARCO',
    permissions: {
      nesting: {
        collectionAdmin: true,
      },
    },
    schema: {
      schemaName: 'unique',
      schemaVersion: '1.0.0',
      image: {
        urlTemplate: 'https://ipfs.uniquenetwork.dev/ipfs/{infix}'
      },
      coverPicture: {
        ipfsCid: 'Qmd8unFnubfYyUSHzPtSBD7SmYgqyaQ5DXSVA1ocCQ8HKw',
      },
      attributesSchemaVersion: '1.0.0',
      attributesSchema: {
        0: {
          name: {_: 'Artist'},
          type: 'string',
          optional: false,
          isArray: false,
        },
        1: {
          name: {_: 'Kind'},
          type: 'string',
          optional: false,
          isArray: false,
          enumValues: {
            0: {_: 'Follower Badge NFT'},
            1: {_: 'Some another NFT'},
          }
        }
      }
    }
  })

  const collectionId = collectionCreationResult.parsed?.collectionId
  if (!collectionId) throw collectionCreationResult.error
  return {collectionId}
}

export const createArtistNFTForAddress = async (sdk: Sdk, collectionId: number, address: string) => {
  const tokenCreationResult = await sdk.token.create({
    collectionId,
    owner: address,
    data: {
      image: {
        ipfsCid: 'Qmd8unFnubfYyUSHzPtSBD7SmYgqyaQ5DXSVA1ocCQ8HKw',
      },
      encodedAttributes: {
        0: {_: 'Marco Brun'},
        1: 0, // for 'Follower Badge NFT' enum value
      },
    }
  })
  if (!tokenCreationResult.parsed?.tokenId) throw tokenCreationResult.error
  return tokenCreationResult.parsed!
}

export const createAmpxFTCollection = async (sdk: Sdk, options = {decimals: 2, amount: 10000}) => {
  if (options.amount > Number.MAX_SAFE_INTEGER) {
    // integer is the limitation of the SDK, it doesn't take bigint according to the typings
    throw new Error('amount is too big')
  }

  const address = sdk.options.account?.address!

  const collectionCreationResult = await sdk.fungible.createCollection({
    mode: 'Fungible',
    decimals: options.decimals,

    name: 'AMPX',
    description: 'AMPX FT Collection',
    tokenPrefix: 'AMPX',
    sponsorship: {
      address,
      isConfirmed: false,
    }
  })

  const collectionId = collectionCreationResult.parsed?.collectionId
  if (!collectionId) throw collectionCreationResult.error

  const nonce = await getNonce(sdk)

  const [confirmSponsorshipResult, mintResult] = await Promise.all([
    sdk.collection.confirmSponsorship(
      {collectionId},
      {nonce}
    ),
    sdk.fungible.addTokens(
      {
        collectionId,
        amount: options.amount,
        recipient: address,
      },
      {nonce: nonce + 1}
    )
  ])

  if (!mintResult.parsed?.collectionId) throw mintResult.error
  if (!confirmSponsorshipResult.parsed?.collectionId) throw confirmSponsorshipResult.error

  return {
    collectionId,
    amount: options.amount,
    decimals: options.decimals,
  }
}

export const createFollowingRFTCollection = async (sdk: Sdk) => {
  const collectionCreationResult = await sdk.refungible.createCollection({
    name: 'Marco followers',
    description: 'Macro Brun followers badges',
    tokenPrefix: 'MARCO_F',
    schema: {
      schemaName: 'unique',
      schemaVersion: '1.0.0',
      image: {
        urlTemplate: 'https://ipfs.uniquenetwork.dev/ipfs/{infix}'
      },
      coverPicture: {
        ipfsCid: 'Qmd8unFnubfYyUSHzPtSBD7SmYgqyaQ5DXSVA1ocCQ8HKw',
      },
      attributesSchemaVersion: '1.0.0',
      attributesSchema: {
        0: {
          name: {_: 'Month'},
          type: 'string', // '2023-08' for August 2023
          optional: false,
          isArray: false,
        }
      }
    }
  })

  const collectionId = collectionCreationResult.parsed?.collectionId
  if (!collectionId) throw collectionCreationResult.error
  return {collectionId}
}

export const mintFollowingRFTTokenForMonth = async (sdk: Sdk, collectionId: number) => {
  const tokenCreationResult = await sdk.refungible.createToken({
    collectionId,

    data: {
      image: {
        ipfsCid: 'Qmd8unFnubfYyUSHzPtSBD7SmYgqyaQ5DXSVA1ocCQ8HKw',
      },
      encodedAttributes: {
        0: {_: getMonthString()},
      }
    },
    amount: 1000000,
  })
  if (!tokenCreationResult.parsed?.tokenId) throw tokenCreationResult.error

  return {
    tokenId: tokenCreationResult.parsed.tokenId,
    collectionId: tokenCreationResult.parsed.collectionId,
    amount: tokenCreationResult.parsed.amount,
  }
}
