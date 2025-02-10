const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	resolve: {
		fallback: {
			fs: false,
			path: require.resolve('path-browserify')
		}
	},
	module: {
	  rules: [
		{ 
			test: /\.js$/, 
			exclude: /node_modules/, 
			use: {
				loader: 'babel-loader'
			}
		}
	  ]
	}
};