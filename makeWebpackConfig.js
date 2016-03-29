/*eslint-env node */
import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import {ROOT, SRC_DIR, BUNDLE_DIR} from './constants';

const BABEL_POLYFILL = path.join(SRC_DIR, 'include-babel-polyfill.js');

export default function makeWebpackConfig(isDev) {
    return {
        context: ROOT,
        entry: {
            bundle: [
                BABEL_POLYFILL, // Include babel polyfill if want to use all es6 features
                path.join(SRC_DIR, 'app-main.js')
            ]
        },
        debug: isDev,
        devtool: isDev ? 'cheap-module-source-map' : '',
        watch: isDev,
        output: {
            path: BUNDLE_DIR,
            filename: '[name].js',
            //sourceMapFilename: '[file].[hash].map', // include this config if meeting problem that source map is cached on browser
            publicPath: '/build/'
        },
        module: {
            loaders: [{
                exclude: [/node_modules\/(?!react-document-event)/],
                test: /\.js$/,
                loaders: ['babel', `js-assert/webpack-assert-loader?dev=${isDev ? 'true' : 'false'}`]
            }, {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            }, {
                test: /\.s(c|a)ss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
            }, {
                test: /\.(gif|jpg|png|woff|woff2|eot|ttf|svg)(\?v=.+)?$/,
                loader: 'url?limit=10000' // embed img data if less than 10kb
            }]
        },
        plugins: [
            // Define a "__DEV__" variable to add code only for debug mode
            // e.g. __DEV__ && someDebugOnlyCheck();
            new webpack.DefinePlugin({
                '__DEV__': isDev,
                '__TEST__': false
            }),
            new ExtractTextPlugin('[name].css')
        ].concat(isDev ? [] : [
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.OccurenceOrderPlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                    screw_ie8: true
                }
            })
        ])
    };
}
