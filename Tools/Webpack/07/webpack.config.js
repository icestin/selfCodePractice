const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin')


module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        filename: 'bundle.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    
    plugins: [
        new HTMLWebpackPlugin({
            title: "代码分离"
        })
    ]
    
}