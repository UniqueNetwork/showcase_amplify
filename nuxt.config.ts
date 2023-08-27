// https://nuxt.com/docs/api/configuration/nuxt-config

const parseIntegerEnvVar = (envVar: string | undefined) => {
  const value = parseInt(envVar || '', 10)
  return isNaN(value) ? undefined : value
}

export default defineNuxtConfig({
  devtools: {enabled: true},
  css: ['~/assets/css/main.scss'],
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      script: [
        { src: "https://accounts.google.com/gsi/client", defer: true, async: true }
      ]
    }
  },
  modules: [
    '@pinia/nuxt',
  ],
  runtimeConfig: {
    substrateAdminSeed: process.env.SUBSTRATE_ADMIN_SEED,
    public: {
      artistNftCollectionId: parseIntegerEnvVar(process.env.ARTIST_NFT_COLLECTION_ID),
      ampxFtCollectionId: parseIntegerEnvVar(process.env.AMPX_FT_COLLECTION_ID),
      followingRftCollectionId: parseIntegerEnvVar(process.env.FOLLOWING_RFT_COLLECTION_ID),
      followingRftTokenId: parseIntegerEnvVar(process.env.FOLLOWING_RFT_TOKEN_ID),
      sdkBaseUrl: process.env.SDK_BASE_URL,
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {verbose: true, logger: {warn}},
        sass: {verbose: true, logger: {warn}},
      },
    },
  },
  routeRules: {
    '/': {ssr: false},
  }
})

function warn(message: string, options: any) {
  const {stderr} = process
  const span = options.span ?? undefined
  const stack = (options.stack === 'null' ? undefined : options.stack) ?? undefined

  if (options.deprecation) {
    if (
      message.startsWith('Using / for division outside of calc() is deprecated') ||
      message.startsWith('Passing percentage units to the global abs() function is deprecated')
    ) {
      // silences above deprecation warning
      return
    }
    stderr.write('DEPRECATION ')
  }
  stderr.write(`WARNING: ${message}\n`)

  if (span !== undefined) {
    // output the snippet that is causing this warning
    stderr.write(`\n"${span.text}"\n`)
  }

  if (stack !== undefined) {
    // indent each line of the stack
    stderr.write(`    ${stack.toString().trimEnd().replace(/\n/gm, '\n    ')}\n`)
  }

  stderr.write('\n')
}
