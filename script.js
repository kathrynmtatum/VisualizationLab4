//load data
d3.csv('wealth-health-2014.csv', d3.autoType).then(data => {
    console.log('wealth-health:', data);
    console.log(data.columns, data[0]);
    
    //Create margins
    const margin = {top:20, left:20, bottom:20, right:20};
    const width = 650-margin.left-margin.right;
    const height = 500-margin.top-margin.bottom;
  
    //Create svg
    const svg = d3.select('.chart').append('svg')
      .attr('width', width+margin.left+margin.right)
      .attr('height', height+margin.top+margin.bottom)
      .append('g')
      .attr('transform', 'translate('+margin.left+','+margin.right+')')
  
    //Create linear scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, d=>d.Income))
      .range([0, width]);
  
    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, d=>d.LifeExpectancy))
      .range([height,0]);
  
    const population = d3
      .scaleLinear()
      .domain(d3.extent(data, d=>d.Population))
      .range([5,25])
    
    const color = d3.scaleOrdinal(d3.schemeTableau10)
    
    //Encode data into SVG circles
    svg.selectAll('.chart')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d,i)=>xScale(d.Income))
		  .attr('cy', (d,i)=>yScale(d.LifeExpectancy))
      .attr('fill', d=>color(d.Region))
      .attr('class', 'income')
      .attr('stroke', 'black')
      .attr('opacity', 0.6)
      .attr('r', d=>population(d.Population))
  
    //Add tool tip
      .on("mouseenter", (event, d) => {
        const position = d3.pointer(event, window)
        d3.selectAll('.tooltip')
            .style('display','inline-block')
            .style('position','fixed')
            .style('top', position[1]+'px')
            .style('left', position[0]+'px')
            .html('Country: ' + d.Country + '<br>Region: ' + d.Region +'<br>Population: ' + d3.format(",d")(d.Population) + '<br>Income: ' + d3.format(",d")(d.Income) + '<br>LifeExpentancy: ' + d.LifeExpectancy)
        })
        .on("mouseleave", (event, d) => {
            d3.selectAll('.tooltip')
              .style('display','none')
        });
  

    //Create axis
    const xAxis = d3.axisBottom(xScale)
      .ticks(5, 's');
    const yAxis = d3.axisLeft(yScale);
  
    //Append axis to SVG  
    svg.append('g')
      .attr("class", "axis x-axis")
      .call(xAxis)
      .attr("transform", `translate(0, ${height})`)
    svg.append('g')
      .attr("class", "axis y-axis")
      .call(yAxis)
      .attr("transform", `0, translate(${width})`)
  
    //Label axis
    svg.append('text')
		    .attr('x', 550)
		    .attr('y', 450)
        .text("Income")
        .attr('font-size',13)
    svg.append('text')
		    .attr('x', 10)
        .attr('y', 5)
        .text("Life Expectancy")
        .attr('font-size',13)
        .attr('writing-mode','vertical-lr')
  
    //Create a legend
    const regions = [... new Set(data.map(data=>data.Region))]
    
    
    const svgLegend = svg.append('g')
        .attr('class', 'legend')
        .attr('x', '300px')
        .attr('y','400px')
        .attr('height', 100)
        .attr('width', 100)
    const size = 20
        
    svgLegend.selectAll('.legendBlocks')
        .data(regions)
        .enter()
        .append('rect')
          .attr('fill', d=>color(d)) 
          .attr('x', 400)
          .attr('y', (d,i)=>(i+1)*25+220)
          .attr('height', '20px')
          .attr('width','20px')
        
    svgLegend.selectAll('.legendText')
        .data(regions)
        .enter()
        .append('text')
          .attr('x', 430)
          .attr('y', (d,i)=>(i+1)*25+235)
          .text(d=>d)
    }); 



