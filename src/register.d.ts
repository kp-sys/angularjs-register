declare module '@kpsys/angularjs-register' {

    import {IChangesObject, IComponentOptions, IModule} from 'angular';

    export interface Register {

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

    function register(moduleName: string, dependencies?: string[]): Register;

    export default register;

    export type ComponentBindings = '@' | '<' | '&' | '=' | '@?' | '<?' | '&?' | '=?';

    export interface ComponentController<T> {
        prototype: [T] extends [never] ? any : T;
    }

    export interface Component<BINDINGS> extends Omit<IComponentOptions, 'bindings' | 'controller'> {
        bindings?: {
            [prop in keyof Required<BINDINGS>]: ComponentBindings;
        };

        controller?: ComponentController<BINDINGS>;
    }

    export type OnChangesObject<BINDINGS> = {
        [property in keyof BINDINGS]: IChangesObject<BINDINGS[property]>;
    };

    export interface OnChanges<BINDINGS> {
        $onChanges(onChangesObj: OnChangesObject<BINDINGS>): void;
    }
}
