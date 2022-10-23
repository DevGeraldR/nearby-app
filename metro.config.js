/**
 * This solve the problem in using firebase authentication
 * The new version of expo doesn't support the older file name extention
 * this rename the file extention to the supported version "cjs".
 */

const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push("cjs");

module.exports = defaultConfig;
