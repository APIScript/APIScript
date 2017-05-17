
import {Config} from "./generator";

function isObject(value: any): boolean {
    return value instanceof Object;
}

// sub-optimal solution
export function duplicateConfig(config: Config): Config {
    return JSON.parse(JSON.stringify(config));
}

function mergeConfigsInternal(mainConfig: Config, otherConfig: Config) {

    for (let name in otherConfig) {

        if (!mainConfig.hasOwnProperty(name)) {
            mainConfig[name] = otherConfig[name];
        } else if (isObject(mainConfig[name]) && isObject(otherConfig[name])) {
            mergeConfigsInternal(mainConfig[name], otherConfig[name]);
        }
    }
}

// merges the two configs with the main config taking priority
export function mergeConfigs(mainConfig: Config, otherConfig: Config): Config {
    let duplicateMain: Config = duplicateConfig(mainConfig);
    mergeConfigsInternal(duplicateMain, otherConfig);

    return duplicateConfig(duplicateMain);
}