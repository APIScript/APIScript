
import {Property} from "./property/property";
import {Endpoint} from "./endpoint";

export interface Group {
    readonly name: string;
    readonly parent: Group;
    readonly url: string;

    readonly injectCount: number;
    readonly importCount: number;
    readonly groupCount: number;
    readonly endpointCount: number;

    readonly groupCountRecursive: number;
    readonly endpointCountRecursive: number;

    forEachInject(callback: (inject: Property, index: number) => void);
    forEachImport(callback: (importValue: string, index: number) => void);
    forEachGroup(callback: (group: Group, index: number) => void, recursive?: boolean);
    forEachEndpoint(callback: (endpoint: Endpoint, index: number) => void, recursive?: boolean);
}

export class BasicGroup implements Group {

    private injects: Property[] = [];
    private groups: Group[] = [];
    private endpoints: Endpoint[] = [];
    private imports: string[] = [];

    public constructor(readonly name: string, readonly parent: Group) {}

    public get url() {
        let url = this.name;
        let parent = this.parent;

        while (parent != null) {
            url = `${parent.name}/${url}`;
            parent = parent.parent;
        }

        return url;
    }

    public addInject(inject: Property) {
        this.injects.push(inject);
    }

    public addGroup(group: Group) {
        this.groups.push(group);
    }

    public addEndpoint(endpoint: Endpoint) {
        this.endpoints.push(endpoint);
    }

    public addImport(importValue: string) {
        this.imports.push(importValue);
    }

    public get injectCount() { return this.injects.length; }
    public get importCount() { return this.imports.length; }
    public get groupCount() { return this.groups.length; }
    public get endpointCount() { return this.endpoints.length; }

    public get groupCountRecursive() {
        let count = 0;
        this.forEachGroup(() => { count++; });

        return count;
    }

    public get endpointCountRecursive() {
        let count = 0;
        this.forEachEndpoint(() => { count++; });

        return count;
    }

    public forEachInject(callback: (inject: Property, index: number) => void) {
        this.injects.forEach((inject, index) => { callback(inject, index); });
    }

    public forEachImport(callback: (importValue: string, index: number) => void) {
        this.imports.forEach((importValue, index) => { callback(importValue, index); });
    }

    public forEachGroup(callback: (group: Group, index: number) => void, recursive = true) {

        if (recursive) {
            this.forEachGroupInternal(this, callback);
        } else {
            this.groups.forEach((group, index) => { callback(group, index); });
        }
    }

    public forEachEndpoint(callback: (endpoint: Endpoint, index: number) => void, recursive = true) {

        if (recursive) {
            // keep track of index
            let index = 0;

            // closure that handles processing of a group
            let processGroup = (group: Group) => {
                let basicGroup = group as BasicGroup;

                basicGroup.endpoints.forEach((endpoint) => {
                    callback(endpoint, index);
                    index++;
                });
            };

            // if this is a API, process it manually as it will be ignored by walkGroups
            if (!this.parent) {
                processGroup(this);
            }

            // walk child groups
            index = this.forEachGroupInternal(this, processGroup);
        } else {
            this.endpoints.forEach((endpoint, index) => { callback(endpoint, index); });
        }
    }

    private forEachGroupInternal(group: Group, callback: (group: Group, index: number) => void, index = 0): number {

        // process this group first, but only if its not a API
        if (group.parent) {
            callback(group, index);
            index++;
        }

        // cast to basic group for mutation
        let basicGroup = group as BasicGroup;

        // walk child groups recursively
        basicGroup.groups.forEach((group) => {
            index = this.forEachGroupInternal(group, callback, index);
        });

        // return the reached index
        return index;
    }

}