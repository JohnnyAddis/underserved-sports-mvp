import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'hjaa2x76', // Hardcoded project ID
    dataset: 'production', // Hardcoded dataset
  },
  studioHost: 'us-admin-2',
})
