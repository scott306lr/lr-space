// export functions: get_colorMap


export const get_unique = (data, name) => {
    let unique = new Set();
    data.forEach((d) => {
        unique.add(d[name]);
    });
    return [...unique];
}

export const get_colorMap = (columns) => {
    const myColors = [
        '#9D6AB9',
        '#5EAA5F',
        '#EE3239',
    ];

    //pretty colors
    // const myColors = [
    //     '#F94144',
    //     '#F3722C',
    //     '#F8961E',
    //     '#F9844A',
    //     '#F9C74F',
    //     '#90BE6D',
    //     '#43AA8B',
    //     '#4D908E',
    //     '#577590',
    //     '#277DA1',
    // ];

    let colorMapping = new Map();
    columns.forEach((d, i) => {
        colorMapping.set(d, myColors[i % myColors.length]);
    });
    return colorMapping;
}
