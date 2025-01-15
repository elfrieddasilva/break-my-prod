export class ProjectName {
    static createName(name?: string) {
        if (name) {
            return name + '-' + Math.floor(Math.random() * 10000);
        }
        return `DeploymentProject` + Math.floor(Math.random() * 10000);
    }
}