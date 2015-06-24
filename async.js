/**
*	cheap and nasty async waterfall
*/
// jshint browser:true
(function(global) {
	"use strict";

	function async(arr, finalCB, scope, noYield) {
		if(!arr || arr.length === 0) {
			return false;
		}
		var index = 0;

		function async_handler() {
			var args = arguments,
				err = args[0],
				argL = args.length,
				i = 1, 
				argArr = [];
			for(i;i<argL;++i) {
				argArr.push(args[i]);
			}
			if(err && finalCB) {
				async_do(finalCB, args, scope, noYield); return;
			}
			var next = arr[++index];
			if(next) {
				argArr.push(async_handler);
				async_do(next, argArr, scope, noYield);
			} else {
				async_do(finalCB, [null].concat(argArr), scope, noYield);
			}
		}

		function async_do(cb, argarr, scope, noYield) {
			scope = scope || null;
			if(!noYield) {
				setTimeout(function async_yield() {
					cb.apply(scope, argarr);
				},0);
			} else {
				cb.apply(scope, argarr);
			}
		}

		// Start the first one
		async_do(arr[index], [async_handler], scope, noYield);
	}

	// Export/expose in global
	if(typeof(module) !== 'undefined' && module.exports) {
		module.exports = async;
	} else {
		global.async = async;
	}

} ( (typeof(global) !== 'undefined') ? global : window) );