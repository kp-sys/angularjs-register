/**
 * Inspired by:
 * author: michaelbromley
 * Licence: MIT
 * url: https://github.com/michaelbromley/angular-es6
 */

/**
 * @author DostalTomas
 */

import angular from 'angular';

const $log = angular.injector(['ng']).get('$log');

export class Register {

	constructor(moduleName, dependencies) {
		this.moduleName = moduleName;
		this.app = {};

		if (dependencies) {
			this.app = angular.module(moduleName, dependencies);
		} else if (_moduleExist(moduleName)) {
			this.app = angular.module(moduleName);
		} else {
			this.app = angular.module(moduleName, []);
		}
	}

	/**
	 * Return module name
	 * @return {string}
	 */
	name() {
		return this.moduleName;
	}

	/**
	 * Register directive to module
	 * Directive can have compile, preLink, postLink and generally link method. If postLink method is defined, link method doesn't make sense,
	 * because it is in fact only alias and will be omitted with warning.
	 * @param {string} directiveName
	 * @param {Object} directiveClass
	 * @return {Register}
	 */
	directive(directiveName, directiveClass) {

		directiveClass = _normalizeConstructor(directiveClass);

		if (!directiveClass.prototype.compile) {
			// create an empty compile function if none was defined.
			directiveClass.prototype.compile = () => {
			};
		}

		const originalCompileFn = _cloneFunction(directiveClass.prototype.compile);

		// Decorate the compile method to automatically return the link method (if it exists)
		// and bind it to the context of the constructor (so `this` works correctly).
		// This gets around the problem of a non-lexical 'this' which occurs when the directive class itself
		// returns `this.link` from within the compile function.
		_override(directiveClass.prototype, 'compile', function () {
			/**
			 * @this this
			 */
			return function () {
				let compileReturnValue = originalCompileFn.apply(this, arguments);

				if (directiveClass.prototype.preLink) {
					compileReturnValue = {
						pre: directiveClass.prototype.preLink.bind(this)
					};
				}

				if (directiveClass.prototype.postLink) {
					if (compileReturnValue.pre) {
						compileReturnValue.post = directiveClass.prototype.postLink.bind(this)
					} else {
						compileReturnValue = {
							post: directiveClass.prototype.postLink.bind(this)
						};
					}
				}

				if (directiveClass.prototype.link) {
					if (directiveClass.prototype.postLink) {
						$log.warn(`Directive ${directiveName} already have postLink function. Skipping link() definition.`);
					} else if (directiveClass.prototype.preLink) {
						return {
							pre: directiveClass.prototype.preLink.bind(this),
							post: directiveClass.prototype.link.bind(this)
						}
					} else {
						return directiveClass.prototype.link.bind(this);
					}
				}

				return compileReturnValue;
			};
		});

		const factoryArray = _createFactoryArray(directiveClass);

		this.app.directive(directiveName, factoryArray);
		return this;
	}

	/**
	 * Register controller to module
	 * @param {string} controllerName Controller name
	 * @param controllerClass Controller class
	 * @return {Register}
	 */
	controller(controllerName, controllerClass) {
		this.app.controller(controllerName, controllerClass);
		return this;
	}

	/**
	 * Register service to module
	 * @param {string} serviceName Service name
	 * @param serviceClass Service class
	 * @return {Register}
	 */
	service(serviceName, serviceClass) {
		this.app.service(serviceName, serviceClass);
		return this;
	}

	/**
	 * Register provider to module
	 * @param {string} providerName Provider name
	 * @param providerClass Provider class
	 * @return {Register}
	 */
	provider(providerName, providerClass) {
		this.app.provider(providerName, providerClass);
		return this;
	}

	/**
	 * Register factory to module
	 * @param {string} factoryName Factory name
	 * @param factoryClass Factory class
	 * @return {Register}
	 */
	factory(factoryName, factoryClass) {
		factoryClass = _normalizeConstructor(factoryClass);
		const factoryArray = _createFactoryArray(factoryClass);
		this.app.factory(factoryName, factoryArray);
		return this;
	}

	/**
	 * Register filter to module
	 * @param {string} filterName Filter name
	 * @param {function} filterFunction Filter function
	 * @return {Register}
	 */
	filter(filterName, filterFunction) {
		this.app.filter(filterName, filterFunction);
		return this;
	}

	/**
	 * Register component to module
	 * @param {string} componentName Component name
	 * @param componentClass Component class
	 * @return {Register}
	 */
	component(componentName, componentClass) {
		this.app.component(componentName, new componentClass());
		return this;
	}

	/**
	 * Register module constant
	 * @param {string} name Constant name
	 * @param {object} obj Constant value
	 * @return {Register}
	 */
	constant(name, obj) {
		this.app.constant(name, obj);
		return this;
	}

	/**
	 * Register module value
	 * @param {string} name Value name
	 * @param {object} obj Value value
	 * @return {Register}
	 */
	value(name, obj) {
		this.app.value(name, obj);
		return this;
	}

	/**
	 * Register config function
	 * @param configFn
	 * @returns {Register}
	 */
	config(configFn) {
		this.app.config(configFn);
		return this;
	}

	/**
	 * Register initialization function
	 * @param initializationFn
	 * @returns {Register}
	 */
	run(initializationFn) {
		this.app.run(initializationFn);
		return this;
	}

	/**
	 * Register decorator
	 * @param {string} name
	 * @param {function()} decoratorFn
	 * @returns {Register}
	 */
	decorator(name, decoratorFn) {
		this.app.decorator(name, decoratorFn);
		return this;
	}

	/**
	 * Get pure angular module
	 * @returns {{}|*}
	 */
	module() {
		return this.app;
	}
}

/**
 * Polyfill function for Register class
 * @param {string} moduleName
 * @param {Array<string>=} dependencies
 * @return {Register}
 */
export default function register(moduleName, dependencies) {
	return new Register(moduleName, dependencies);
}

/**
 * Finds out whether module exist
 * @param {string} nameOfTheModule
 * @return {boolean}
 * @private
 */
function _moduleExist(nameOfTheModule) {
	try {
		angular.module(nameOfTheModule);
		return true;
	} catch (err) {
		return false;
	}
}

/**
 * If the constructorFn is an array of type ['dep1', 'dep2', ..., constructor() {}]
 * we need to pull out the array of dependencies and add it as an $inject property of the
 * actual constructor function.
 * @param input
 * @returns {*}
 * @private
 */
function _normalizeConstructor(input) {
	let constructorFn;

	if (input.constructor === Array) {
		//
		const injected = input.slice(0, input.length - 1);
		constructorFn = input[input.length - 1];
		constructorFn.$inject = injected;
	} else {
		constructorFn = input;
	}

	return constructorFn;
}

/**
 * Convert a constructor function into a factory function which returns a new instance of that
 * constructor, with the correct dependencies automatically injected as arguments.
 *
 * In order to inject the dependencies, they must be attached to the constructor function with the
 * `$inject` property annotation.
 *
 * @param constructorFn
 * @returns {Array.<T>}
 * @private
 */
function _createFactoryArray(constructorFn) {
	// get the array of dependencies that are needed by this component (as contained in the `$inject` array)
	const args = constructorFn.$inject || [];
	// create a copy of the array
	const factoryArray = args.slice();
	// The factoryArray uses Angular's array notation whereby each element of the array is the name of a
	// dependency, and the final item is the factory function itself.
	/* eslint-disable no-shadow,guard-for-in */
	factoryArray.push((...args) => {
		//return new constructorFn(...args);
		const instance = new constructorFn(...args);
		for (const key in instance) {
			//noinspection JSUnfilteredForInLoop
			// eslint-disable-next-line no-self-assign
			instance[key] = instance[key];
		}
		return instance;
	});
	/* eslint-enable */

	return factoryArray;
}

/**
 * Clone a function
 * @param original
 * @returns {Function}
 * @private
 */
function _cloneFunction(original) {
	/**
	 * @this this
	 */
	return function () {
		return original.apply(this, arguments);
	};
}

/**
 * Override an object's method with a new one specified by `callback`.
 * @param object
 * @param methodName
 * @param callback
 * @private
 */
function _override(object, methodName, callback) {
	object[methodName] = callback(object[methodName])
}