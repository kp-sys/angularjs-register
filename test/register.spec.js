import angular from 'angular';
import register from '../src/register';

describe('Register.js tests', () => {

    it('should create a empty angular module and correctly returns module name', () => {
        const moduleName = register('myNewModule').name();
        expect(angular.module('myNewModule')).toBeDefined();
        expect(moduleName).toBe(moduleName);
    });

    it('should create a empty module with dependencies', () => {
       register('mySecondNewModule', ['ngAnimate']);
       expect(angular.module('mySecondNewModule').requires).toEqual(['ngAnimate']);
    });

    it('should register new controller', () => {
        register('myNewModule').controller('myNewController', class {constructor(){} hello(){}});

        const $controller = angular.injector(['ng', 'myNewModule']).get('$controller');
        expect($controller('myNewController', {}).hello).toBeDefined();
    });

    it('should register new service', () => {
        register('myNewModule').service('myNewService', class {constructor(){} hello(){}});

        const service = angular.injector(['ng', 'myNewModule']).get('myNewService');
        expect(service.hello).toBeDefined();
    });

    it('should register new provider', () => {
        register('myNewModule').provider('myNewProvider', class {constructor(){} hello(){} $get(){ return {hello2: () => {}}}});

        const provider = angular.injector(['ng', 'myNewModule']).get('myNewProvider');
        expect(provider.hello2).toBeDefined();
    });

    it('should register new factory', () => {
        register('myNewModule').factory('myNewFactory', class {constructor(){} hello(){}});

        const factory = angular.injector(['ng', 'myNewModule']).get('myNewFactory');
        expect(factory.hello).toBeDefined();
    });

    it('should register new filter', () => {
        register('myNewModule').filter('myNewFilter', () => () => 'filter');

        const $filter = angular.injector(['ng', 'myNewModule']).get('$filter');
        expect($filter('myNewFilter')()).toBe('filter');
    });

    it('should register new component', () => {
        const spy = jasmine.createSpy('componentInit').and.callThrough();
        register('myNewModule').component('myNewComponent', class {controller = class { constructor(){} $onInit(){spy();}}});

        let $element;
        angular.injector(['ng', 'myNewModule']).invoke(($compile, $rootScope) => {
            $element = $compile(angular.element('<my-new-component></my-new-component>'))($rootScope);
        });

        expect($element).toBeDefined();
        expect(spy).toHaveBeenCalled();
    });

    it('should register new constant and value', () => {
        register('myNewModule')
            .constant('myNewConstant', 10)
            .value('myNewValue', 20);

        angular.injector(['ng', 'myNewModule']).invoke((myNewConstant, myNewValue) => {
            expect(myNewConstant).toBe(10);
            expect(myNewValue).toBe(20);
        });
    });

    it('should register new config and run phase', () => {
        const configSpy = jasmine.createSpy('configSpy').and.callThrough();
        const runSpy = jasmine.createSpy('runSpy').and.callThrough();

        register('mySuperNewModule')
            .config(() => configSpy())
            .run(() => runSpy());

        angular.injector(['ng', 'mySuperNewModule']);

        expect(configSpy).toHaveBeenCalled();
        expect(runSpy).toHaveBeenCalled();
        expect(configSpy).toHaveBeenCalledBefore(runSpy);
    });

    it('should register new decorator', () => {
        register('myNewModule')
            .service('myService', class{ constructor(){} hello(){return 'hello'}});

        let myService = angular.injector(['ng', 'myNewModule']).get('myService');
        expect(myService.hello()).toBe('hello');

        register('myNewModule')
            .decorator('myService', ($delegate) => {$delegate.hello = () => 'hello2'; return $delegate});

        myService = angular.injector(['ng', 'myNewModule']).get('myService');

        expect(myService.hello()).toBe('hello2');
    });

    it('should return module information',() => {
        const module = register('myNewModule').module();

        const referenceModule = angular.module('myNewModule');

        expect(module).toEqual(referenceModule);
    });

    describe('directives', () => {
        const MODULE_NAME = 'myNewModule';
        const DIRECTIVE_NAME_CAMEL = 'myDirective';
        const DIRECTIVE_NAME_KEBAB = 'my-directive';

        function getCompiledElement() {
            return angular.injector(['ng', MODULE_NAME]).invoke(($compile, $rootScope) => {
                const scope = $rootScope.$new();
                const result = $compile(angular.element(`<${DIRECTIVE_NAME_KEBAB}></${DIRECTIVE_NAME_KEBAB}>`))(scope);

                scope.$digest();

                return result;
            });
        }

        it('should register new directive', () => {
            const linkSpy = jasmine.createSpy('linkSpy').and.callThrough();

            register(MODULE_NAME).directive(DIRECTIVE_NAME_CAMEL, class {
                restrict = 'E';

                link() {
                    linkSpy();
                }
            });

            const $element = getCompiledElement();

            expect($element).toBeDefined();
            expect(linkSpy).toHaveBeenCalled();
        });

        it('should call compile, preLink and postLink in right order and should not call link', () => {
            const compileSpy = jasmine.createSpy('compileSpy').and.callThrough();
            const preLinkSpy = jasmine.createSpy('preLinkSpy').and.callThrough();
            const postLinkSpy = jasmine.createSpy('postLinkSpy').and.callThrough();
            const linkSpy = jasmine.createSpy('linkSpy').and.callThrough();

            register(MODULE_NAME).directive(DIRECTIVE_NAME_CAMEL, class {
                restrict = 'E';

                constructor() {
                    this.foo = 'foo';
                }

                compile() {
                    compileSpy(this.foo);
                }

                link() {
                    linkSpy(this.foo);
                }

                preLink() {
                    preLinkSpy(this.foo);
                }

                postLink() {
                    postLinkSpy(this.foo);
                }
            });

            const $element = getCompiledElement();

            expect($element).toBeDefined();
            expect(compileSpy).toHaveBeenCalledWith('foo');
            expect(preLinkSpy).toHaveBeenCalledWith('foo');
            expect(postLinkSpy).toHaveBeenCalledWith('foo');
            expect(linkSpy).not.toHaveBeenCalledWith('foo');

            expect(compileSpy).toHaveBeenCalledBefore(preLinkSpy);
            expect(preLinkSpy).toHaveBeenCalledBefore(postLinkSpy);
        });

    });
});