'use strict';

const { defineConfig } = require('@playwright/test');
const baseConfig = require('../base-config.cjs');

module.exports = defineConfig(
  baseConfig({
    envDir: __dirname,
    testDir: 'tests/e2e',
    projectName: 'e2e',
  })
);