import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import {ROOT, SRC_DIR, BUNDLE_DIR} from './constants';

export default function makeWebpackConfig(isDev) {
    return {
        context: ROOT,
        entry: {
            bundle: `${SRC_DIR}/index.js`
        },
        debug: isDev,
        devtool: isDev ? 'cheap-module-source-map' : '',
        watch: isDev,
        output: {
            path: BUNDLE_DIR,
            filename: '[name].js',
            sourceMapFilename: '[file].[hash].map',
            publicPath: '/build/'
        },
        module: {
            loaders: [{
                exclude: [/node_modules/],
                test: /\.js$/,
                loaders: ['babel', `js-assert/webpack-assert-loader?dev=${isDev ? 'true' : 'false'}`]
            }, {
                exclude: [/node_modules/],
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            }, {
                exclude: [/node_modules/],
                test: /\.s(c|a)ss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
            }]
        },
        plugins: [
            // Define a "__DEV__" variable to add code only for debug mode
            // e.g. __DEV__ && someDebugOnlyCheck();
            new webpack.DefinePlugin({
                '__DEV__': isDev
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
