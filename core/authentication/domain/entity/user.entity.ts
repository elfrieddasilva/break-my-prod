export class User {
    name!: string;
    imageUrl!: string;

    constructor(builder: UserBuilder) {
        this.name = builder._name;
        this.imageUrl = builder._imageUrl;
    }

    static builder() {
        return new UserBuilder();
    }
}

class UserBuilder {
    _name!: string;
    _imageUrl!: string;

    name(name: string) {
        this._name = name;
        return this;
    }

    imageUrl(imageUrl: string) {
        this._imageUrl = imageUrl;
        return this;
    }

    build() {
        return new User(this);
    }

}