'use strict';

const { defineConfig } = require('@playwright/test');
const baseConfig = require('../base-config.cjs');

module.exports = defineConfig(
  baseConfig({
    envDir: __dirname,
    testDir: 'tests/integration',
    projectName: 'integration',
  })
);