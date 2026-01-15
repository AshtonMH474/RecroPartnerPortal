import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load env from playwright/.env
dotenv.config({ path: path.resolve(__dirname, '.env') });

module.exports = defineConfig({
testDir: './tests',
fullyParallel: false,
use: {
    baseURL: process.env.NEXTAUTH_URL || 'http://localhost:3000/',
    trace: 'on-first-retry',
},
outputDir: './playwright-results',
projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
        name: 'Microsoft Edge',
        use: {
            ...devices['Desktop Edge'],
            channel: 'msedge',
        },
    },
  ],
})



