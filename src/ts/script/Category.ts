export class Category {
    name: string;
    children: Category[];

    constructor(name: string = '', children: Category[] = null) {
        this.name = name;
        this.children = children;
    }
}
