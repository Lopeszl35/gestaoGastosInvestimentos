class DependencyInjector {
    constructor() {
        this.dependencies = {};
    }

    register(name, dependency) {
        this.dependencies[name] = dependency;
    }

    get(name) {
        if (!this.dependencies[name]) {
            throw new Error(`Dependência ${name} nao encontrada`);
        }

        return this.dependencies[name];
    }

}

export default new DependencyInjector();