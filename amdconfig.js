require.config({
	urlArgs: 'bust=0.5962744695134461',
	baseUrl: '/src',
	paths: {
		test: '../test',
		demo: '../demo',
		requirejs: '../bower_components/requirejs/require',
		text: '../bower_components/requirejs-text/text',
		mocha: '../node_modules/mocha/mocha',
		should: '../node_modules/should/should',
		molecular: 'molecular',
		'es5-shim': '../bower_components/es5-shim/es5-shim',
		jquery: '../bower_components/jquery/dist/jquery',
		qunit: '../bower_components/qunit/qunit/qunit',
		lodash: '../bower_components/lodash/dist/lodash.compat',
		q: '../bower_components/q/q',
		ramda: '../bower_components/ramda/ramda',
		'requirejs-text': '../bower_components/requirejs-text/text',
		underscore: '../bower_components/underscore/underscore',
		subject: '../bower_components/subject/built/subject',
		json5: '../bower_components/json5/lib/json5'
	},
	shim: {
		json5: {
			exports: 'JSON5',
		},
		backbone: {
			exports: 'Backbone',
			deps: [
				'jquery',
				'underscore'
			]
		},
		underscore: {
			exports: '_'
		},
		mocha: {
			exports: 'mocha'
		},
		should: {
			exports: 'should'
		}
	}
});
