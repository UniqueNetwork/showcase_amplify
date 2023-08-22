import {getSdk} from '~/minter/utils'
import * as dotenv from 'dotenv'
import {createError, H3Error} from "h3";
import {createArtistNFTForAddress} from "~/minter/minters";

dotenv.config()

export default defineEventHandler(async (event) => {
  const sdk = getSdk()

  const collectionId = parseInt(process.env.ARTIST_NFT_COLLECTION_ID || '', 10)
  if (isNaN(collectionId)) {
    throw createError({statusCode: 400, statusText: 'ARTIST_NFT_COLLECTION_ID_NOT_DEFINED',})
  }

  const query = getQuery(event)
  const address = query.address as string

  const result = await createArtistNFTForAddress(sdk, collectionId, address)

  return {res: 'Hello main', result}
})