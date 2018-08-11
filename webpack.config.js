require('dotenv').config();
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const devMode = process.env.NODE_ENV === 'development';

// TODO: Add webpack html plugin to support miniCssExtractPlugin and external angular
const devConfig = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'web/static'),
    },
}

let config = {
    mode: 'production',
    entry: path.resolve(__dirname, './app/index.js'),
    output: {
        path: path.resolve(__dirname, './web/static/dist'),
        filename: 'app.js',
        publicPath: '/dist/',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['env', {
                            'targets': {
                                'browsers': ['defaults']
                            }
                        }]
                    ]
                }
            },
            {
                test: /\.s?css$/,
                loader: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                autoprefixer({
                                    browsers: ['defaults'],
                                }),
                            ],
                        },
                    },
                    'sass-loader'
                ],
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.(jpg$)?(png$)/,
                loader: 'file-loader',
            }

        ]
    },
    target: 'web',
    externals: {
        fabric: 'fabric',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                API_HOST: devMode ? `http://${process.env.HOST}:${process.env.PORT}` : process.env.HOST,
            }
        })
    ]
}

if (devMode) {
    config = {
        ...config,
        ...devConfig,
    }
}

module.exports = config;