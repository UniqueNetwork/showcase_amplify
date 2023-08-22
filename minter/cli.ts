import * as dotenv from 'dotenv'
import {program} from 'commander'
import {getSdk} from '~/minter/utils'
import {
  createAmpxFTCollection,
  createArtistNFTCollection,
  createFollowingRFTCollection,
  mintFollowingRFTTokenForMonth
} from '~/minter/minters'
import confirm from '@inquirer/confirm'

dotenv.config()

const main = async () => {
  const sdk = getSdk()

  const options = program
    .option(
      '-c, --create-collections',
    )
    .parse()
    .opts<{
      createCollections?: boolean
    }>()

  if (options.createCollections) {
    const existingCollectionId = process.env.ARTIST_NFT_COLLECTION_ID
    if (existingCollectionId) {
      const answer = await confirm({
        message: `There are already existing env vars with collection id. Create brand new collections (again)?`,
        default: false,
      })
      if (!answer) {
        console.log('Aborted')
        return
      }
    }

    const artistNFTResult = await createArtistNFTCollection(sdk)
    console.log(`Artist NFT collection created, id ${artistNFTResult.collectionId}`)

    const ampxFTResult = await createAmpxFTCollection(sdk)
    console.log(`AMPX FT collection created, id ${ampxFTResult.collectionId}`)

    const followingRFTResult = await createFollowingRFTCollection(sdk)
    console.log(`Following RFT collection created, id ${followingRFTResult.collectionId}`)

    const followingRFTToken = await mintFollowingRFTTokenForMonth(sdk, followingRFTResult.collectionId)
    console.log(`Following RFT token minted, id ${followingRFTToken.tokenId}`)

    console.log(`
ARTIST_NFT_COLLECTION_ID=${artistNFTResult.collectionId}
AMPX_FT_COLLECTION_ID=${ampxFTResult.collectionId}
FOLLOWING_RFT_COLLECTION_ID=${followingRFTResult.collectionId}
FOLLOWING_RFT_TOKEN_ID=${followingRFTToken.tokenId}
    `)
  } else {
    program.help()
  }
}


main()
  .catch((error) => {
    if (typeof error === 'object' && error !== null) {
      if (error.isAxiosError === true) {
        const url = error.response.request.res.responseUrl || error.config.url
        console.log({...error.response.data, url})
        if (error.details) {
          console.dir(error.details, {depth: 100})
        }
      } else {
        if (error.details) {
          console.log(error.toString())
          console.dir(error.details, {depth: 100})
        } else {
          console.error(error)
        }

      }
    } else {
      console.error(error)
    }
  })

