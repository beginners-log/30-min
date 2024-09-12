import { defineConfig } from 'cypress'
import fs from 'fs-extra'
import path from 'path'
import pluginMocha from 'cypress-mochawesome-reporter/plugin.js'
import { beforeRunHook } from 'cypress-mochawesome-reporter/lib/index.js'

const getConfigurationByFile = (file) => {
  const pathToConfigFile = path.resolve('config', `${file}.json`)

  return fs.readJson(pathToConfigFile)
}

// Function to mask sensitive information
async function maskSensitiveInfoInConfig(file) {
  const configPath = path.resolve('config', `${file}.json`)

  try {
    const config = await getConfigurationByFile(file)
    const maskedConfig = maskSensitiveValues(config)

    await fs.writeJson(configPath, maskedConfig, { spaces: 2 })
    console.log('Sensitive information has been masked in', configPath)
  } catch (error) {
    console.error('Error masking sensitive information:', error)
  }
}

// Recursive function to mask sensitive values
function maskSensitiveValues(obj) {
  if (typeof obj !== 'object' || obj === null) return obj

  const sensitiveKeys = ['password', 'token', 'secret'] // Add other sensitive keys as needed

  if (Array.isArray(obj)) {
    return obj.map(maskSensitiveValues)
  }

  return Object.keys(obj).reduce((acc, key) => {
    if (
      sensitiveKeys.some((sensitiveKey) =>
        key.toLowerCase().includes(sensitiveKey)
      )
    ) {
      acc[key] = '***'
    } else {
      acc[key] = maskSensitiveValues(obj[key])
    }
    return acc
  }, {})
}

export default defineConfig({
  screenshotOnRunFailure: false,
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: `reports_${new Date().toLocaleString().replace(',', '')}`
  },
  e2e: {
    setupNodeEvents(on, config) {
      pluginMocha(on)
      on('before:run', async (details) => {
        await beforeRunHook(details)
      })

      const file = config.env.configFile || 'dev'

      on('after:run', () => {
        maskSensitiveInfoInConfig()
      })

      return getConfigurationByFile(file)
    }
  }
})
