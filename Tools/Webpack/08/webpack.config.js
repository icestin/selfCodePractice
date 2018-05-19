const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');


module.exports = {
    entry: './src/index.js',
    output: {
        filename: '[name].[chunkhash].js',
        // chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HTMLWebpackPlugin({
            title: "缓存"
        }),
        new webpack.HashedModuleIdsPlugin(),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {      
              commons: {      
                chunks: 'initial',      
                minChunks: 2, maxInitialRequests: 5,      
                minSize: 0      
              },
      
              vendor: {      
                test: /node_modules/,      
                chunks: 'initial',      
                name: 'vendor',      
                priority: 10,      
                enforce: true      
              }      
            }      
          },
    }
    
}