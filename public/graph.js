const svgWidth = 615;
const svgHeight = 506;
const margins = { top: 60, bottom: 70, left: 70, right: 30};
const graphHeight = svgHeight - margins.top - margins.bottom;
const graphWidth = svgWidth - margins.left - margins.right;


const svg = d3.select('.canvas')
    .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

const graphGroup = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margins.left},${margins.top})`);

const yAxisGroup = graphGroup.append('g')
    .attr('class','y-axis');
const xAxisGroup = graphGroup.append('g')
    .attr('class','x-axis')
    .attr('transform', `translate(0,${graphHeight})`);

const x = d3.scaleTime().range([0, graphWidth]);
const y = d3.scaleLinear().range([graphHeight, 0]);

const line = d3.line()
    .x(function(d){ return x(new Date(d.date))})
    .y(function(d){ return y(d.distance)});

// line path element
const path = graphGroup.append('path');

const update = (data) => {

    data = data.filter(item => item.activity == activity);

    data.sort( (a,b) => new Date(a.date) - new Date(b.date));

    console.log(d3.extent(data,d => new Date(d.date)));

    // update the domain of scales.
    x.domain(d3.extent(data,d => new Date(d.date)));
    y.domain([0,d3.max(data, d => d.distance)]);

    // update path data
    path.data([data])
        .attr('fill', 'none')
        .attr('stroke', '#00bfa5')
        .attr('stroke-width', '2')
        .attr('d', line);

    xAxisGroup.selectAll('text')
        .attr('transform','rotate(-10)')
        .attr('text-anchor', 'end');

    // create circles for points
    const circles = graphGroup.selectAll('circle')
        .data(data);

    // remove unwanted points
    circles.exit().remove();

    // update current points
    circles.attr('r', '4')
        .attr('cx', d => x(new Date(d.date)))
        .attr('cy', d => y(d.distance));

    // add new points
  circles.enter()
  .append('circle')
    .attr('r', '4')
    .attr('cx', d => x(new Date(d.date)))
    .attr('cy', d => y(d.distance))
    .attr('fill', '#ccc');

    // create axes
    const xAxis = d3.axisBottom(x)
        .ticks(4)
        .tickFormat(d3.timeFormat("%b %d"));
    
    const yAxis = d3.axisLeft(y)
        .ticks(4)
        .tickFormat(d => d + 'm');

    // call axes
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    // rotate axis text
    xAxisGroup.selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end');

}

let data = []

db.collection('activity').onSnapshot(res => {

    res.docChanges().forEach(res => {

        const doc = { ...res.doc.data(), id: res.doc.id};

        switch(res.type){
            case 'added':
                data.push(doc);
                break;
            case 'removed': 
                data.filter(item => item.id != doc.id);
                break;
            case 'modified':
                const index = data.findIndex(item => item.id == doc.id);
                data[index] = doc;
                break;
            default: break;
        }
    })

    update(data);
})