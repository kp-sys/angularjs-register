import {IModule} from 'angular';

export {register as default};

declare function register(moduleName: string, dependencies?: string[]): Register;

declare class Register {

    private constructor(moduleName: string, dependencies?: string[]);

    public directive(directiveName: string, directiveClass): this;

    public controller(controllerName: string, controllerClass): this;

    public service(serviceName: string, serviceClass): this;

    public provider(providerName: string, providerClass): this;

    public factory(factoryName: string, factoryFunction: (...args: any[]) => any): this;

    public filter(filterName: string, filterFunction: (...args: any[]) => any): this;

    public component(componentName: string, componentClass): this;

    public constant(name: string, obj: any): this;

    public value(name: string, obj: any): this;

    public decorator(name: string, decoratorFunction: (...args: any[]) => any): this;

    public config(configFunction: (...args: any[]) => any): this;

    public run(initializationFunction: (...args: any[]) => any): this;

    public module(): IModule;

    public name(): string;
}
