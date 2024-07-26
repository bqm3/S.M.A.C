const {getDefaultConfig} = require('expo/metro-config');

module.exports = (async () => {
    const defaultConfig = await getDefaultConfig(__dirname);

    const {transformer, resolver} = defaultConfig;

    defaultConfig.transformer = {
        ...transformer,
        experimentalImportSupport: false,
        inlineRequires: true,
        minifierConfig: {
            keep_classnames: true, // FIX typeorm
            keep_fnames: true, // FIX typeorm
            mangle: {
                // toplevel: false,
                keep_classnames: true, // FIX typeorm
                keep_fnames: true, // FIX typeorm
            },
            output: {
                ascii_only: true,
                quote_style: 3,
                wrap_iife: true,
            },
            sourceMap: {
                includeSources: false,
            },
            toplevel: false,
            compress: {
                // reduce_funcs inlines single-use functions, which cause perf regressions.
                reduce_funcs: false,
            },
        }
    };

    // added this for eas migration - not sure what it does
    defaultConfig.resolver.assetExts.push('db');

    defaultConfig.resolver = {
        ...resolver,
        assetExts: resolver.assetExts.filter(ext => ext !== 'svg'),
        sourceExts: [...resolver.sourceExts, 'svg', 'jsx', 'js', 'ts', 'tsx', 'cjs', 'json'],
    };

    return defaultConfig;
})();