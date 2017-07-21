import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';


export default {
    devServer: {
        inline: true,
        port: 8080,
        proxy: {
            '/': {
                target: 'http://localhost:3000'
            }
        }
    },
    entry: './src/client.js',
    output: {
        path: path.resolve(__dirname, 'src/assets'),
        filename: 'app.js',
        publicPath: '/assets'
    },
    module: {
        rules: [
            {
                test: /\.(css)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('app.css')
    ]
}
