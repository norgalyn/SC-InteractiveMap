'use strict';

const webpack                       = require('webpack');
const path                          = require('path');

const SentryWebpackPlugin           = require('@sentry/webpack-plugin');
const TerserPlugin                  = require("terser-webpack-plugin");
const JsonMinimizerPlugin           = require("json-minimizer-webpack-plugin");
const MergeJsonPlugin               = require("merge-json-webpack-plugin");
const CopyPlugin                    = require("copy-webpack-plugin");

module.exports = env => {
    return {
        mode            : 'production',
        devtool         : 'hidden-source-map',
        performance     : { hints: false },
        context         : path.resolve(__dirname, 'src'),
        entry           : {
            SCIM            : './SCIM.js'
        },

        output          : {
            path            : path.resolve(__dirname, 'build'),
            filename        : './[name].js'
        },
        optimization    : {
            minimize        : true,
            minimizer       : [
                //new TerserPlugin({test: /\.js(\?.*)?$/i}),
                new JsonMinimizerPlugin({test: /\.json(\?.*)?$/i})
            ]
        },

        plugins: [
            // Merge all detailed models into a single JSON file...
            new MergeJsonPlugin({
                group: [
                    { files: './Models/*.json', to: './detailedModels.json' }
                ]
            }),

            // Copy pipe fonts
            new CopyPlugin({
                patterns: [
                    { from: "./PipeFonts/*.json" }
                ]
            }),

            // Send new release to Sentry
            new SentryWebpackPlugin({
                // sentry-cli configuration
                url: env.SENTRY_URL,
                authToken: env.SENTRY_AUTH_TOKEN,
                org: "sentry",
                project: "satisfactory-calculator",

                // webpack specific configuration
                validate: true,
                include: path.resolve(__dirname, 'build'),
                ignore: ['node_modules', 'webpack.config.js']
            })
        ]
    };
};