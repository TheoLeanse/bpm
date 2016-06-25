export default function ascending (input) {
    return Object.keys(input)
        .sort((a, b) => input[a] - input[b])
        .reduce((output, key) => {
            output[key] = input[key];
            return output;
        }, {});
}
