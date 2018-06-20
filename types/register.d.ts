import {IModule} from 'angular';

export declare function register(moduleName: string, dependencies?: string[]): Register;

export declare class Register {
    directive(directiveName: string, directiveClass): this;

    controller(controllerName: string, controllerClass): this;

    service(serviceName: string, serviceClass): this;

    provider(providerName: string, providerClass): this;

    factory(factoryName: string, factoryFunction: (...args: any[]) => any): this;

    filter(filterName: string, filterFunction: (...args: any[]) => any): this;

    component(componentName: string, componentClass): this;

    constant(name: string, obj: any): this;

    value(name: string, obj: any): this;

    decorator(name: string, decoratorFunction: (...args: any[]) => any): this;

    config(configFunction: (...args: any[]) => any): this;

    run(initializationFunction: (...args: any[]) => any): this;

    module(): IModule;

    name(): string;
}
