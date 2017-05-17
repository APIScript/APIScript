
import {API} from "../api/api";

export type Config = {[key: string]: any};

export interface Generator {
    generate(api: API, config: Config);
}