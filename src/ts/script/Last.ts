export function last(...args: any[]) {
    let first = args[0];
    let type = typeof first;
    let result;

    switch (type) {
        case 'object':
            result = first[first.length - 1];
            break;
        case 'string':
            result = first[first.length - 1];
            break;
        default:
            result = args[args.length - 1];
    }

    return result;
}
