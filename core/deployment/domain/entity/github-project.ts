export class GithubProject {
    owner!: string;
    name!: string;
    creationDate!: Date;
    constructor(builder: GithubProjectBuilder) {
        this.owner = builder._owner;
        this.name = builder._name;
        this.creationDate = builder._creationDate;
    }

    static builder() {
        return new GithubProjectBuilder();
    }

}
class GithubProjectBuilder {
    _owner!: string;
    _name!: string;
    _creationDate!: Date;

    owner(owner: string) {
        this._owner = owner;
        return this;
    }

    name(name: string) {
        this._name = name;
        return this;
    }
    creationDate(creationDate: Date) {
        this._creationDate = creationDate;
        return this;
    }

    build() {
        return new GithubProject(this);
    }
}

