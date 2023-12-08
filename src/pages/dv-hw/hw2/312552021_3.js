export const sideContent = (selection, colorMap) => {
    const initialX = 850;
    const initialY = 100;
    
    const paddingX = parseInt(25);
    const paddingY = parseInt(40);
    const alignText = parseInt(6);
    const circleRadius = 10;
    
    const g = selection;
    const gSide = g.append('g')
        .attr('transform', `translate(${initialX}, ${initialY})`);
    
    const cat1 = 'Iris-setosa';
    const cat2 = 'Iris-versicolor';
    const cat3 = 'Iris-virginica';
    
    gSide.append('rect')
        .attr('width', 20)
        .attr('height', 8)
        .attr('fill', colorMap.get(cat1));

    gSide.append('text')
        .attr('x', paddingX)
        .attr('y', alignText)
        .text(cat1);
    
    gSide.append('rect')
        .attr('width', 20)
        .attr('height', 8)
        .attr('y', paddingY)
        .attr('fill', colorMap.get(cat2));
    
    gSide.append('text')
        .attr('x', paddingX)
        .attr('y', String(alignText+paddingY))
        .text(cat2);
    
    gSide.append('rect')
        .attr('width', 20)
        .attr('height', 8)
        .attr('y', String(2*paddingY))
        .attr('fill', colorMap.get(cat3));
    
    gSide.append('text')
        .attr('x', paddingX)
        .attr('y', String(alignText+2*paddingY))
        .text(cat3);
};