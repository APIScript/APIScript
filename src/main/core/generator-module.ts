
import * as fs from 'fs';
import * as path from 'path';

export type GeneratorModule = [string, string];

export function listGeneratorModules(dir: string): GeneratorModule[] {

    let approvedDir = path.normalize(dir + "/@apiset");
    let result = [];

    let modules = fs.readdirSync(dir);

    for (let module of modules) {

        if (module.length > 17 && module.substring(0, 17) === "apiset-generator-") {
            let generatorModule = [module.substring(17), path.normalize(dir + "/" + module)];
            result.push(generatorModule);
        }
    }

    if (fs.existsSync(approvedDir)) {
        let approvedModules = fs.readdirSync(approvedDir);

        for (let module of approvedModules) {
            let generatorModule = [module, path.resolve(approvedDir + "/" + module)];
            result.push(generatorModule);
        }
    }

    return result;
}