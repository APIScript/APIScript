
import {Group, BasicGroup} from "./group";
import {Entity} from "./entity";
import {Enum} from "./enum";

export interface API extends Group {
    readonly entityCount: number;
    readonly enumCount: number;

    forEachEntity(callback: (entity: Entity, index: number) => void);
    forEachEnum(callback: (enumerator: Enum, index: number) => void);
}

export class BasicAPI extends BasicGroup implements API {
    private entities: Entity[] = [];
    private enums: Enum[] = [];

    public constructor(name: string, documentation?: string) {
        super(name, null, documentation);
    }

    public addEntity(entity: Entity) {
        this.entities.push(entity);
    }

    public addEnum(enumValue: Enum) {
        this.enums.push(enumValue);
    }

    public get entityCount() { return this.entities.length; }
    public get enumCount() { return this.enums.length; }

    public forEachEntity(callback: (entity: Entity, index: number) => void) {
        this.entities.forEach((entity, index) => { callback(entity, index); });
    }

    public forEachEnum(callback: (enumerator: Enum, index: number) => void) {
        this.enums.forEach((enumerator, index) => { callback(enumerator, index); });
    }
}