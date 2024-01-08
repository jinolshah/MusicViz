class heat {

    constructor(globalApplicationState) {
        this.globalApplicationState = globalApplicationState;
        this.heatData = globalApplicationState.heatData;
        
        d3.select('#heat')
          .on('click', (event) => this.setup(event));
    
    }

    setup(event) {
        console.log('Plotting heat map...');

        let visContainer = d3.select('.visualization');

        visContainer.html('');

        visContainer
            .append('div')
            .attr('id', 'heatContainer')
            .append('svg')
            .attr('id', 'heatMap');

        let heatDescription = `
        <p>
            Explore the Popularity of Music Genres Across Decades
        </p>
        <p>
            The heatmap visualizes the popularity of music genres over the decades. The x-axis represents different decades, while the y-axis displays various music genres.
        </p>
        <p>
            The color intensity of each block in the heatmap indicates the relative popularity of a genre in a specific decade. A white block signifies low popularity, while an orange block indicates high popularity.
        </p>
        <p>
            Take a closer look at the intersections of genres and decades to uncover trends and shifts in musical preferences. The brighter the color, the more prevalent a genre was during a particular period.
        </p>
        <p>
            Use this heatmap to gain insights into the dynamic landscape of music genres and how their popularity has evolved over time.
        </p>
        `
        
        d3.select('#heatContainer')
            .append('div')
            .attr('id', 'heatDescription')
            .html(heatDescription)

        let heatMap = d3.select('#heatMap');

        let centerX = parseInt(heatMap.style('width'))/2;
        this.centerX = centerX;
        let centerY = parseInt(heatMap.style('height'))/2;
        this.centerY = centerY;

        this.smaller = (centerX > centerY) ? 3*(centerY/2) : 3*(centerX/2);
        
        this.plotHeat();
    }

    plotHeat() {

        let heatMap = d3.select('#heatMap');
        let vis = d3.select('.visualization');

        var tooltip = vis
                        .append("div")
                        .attr("class", "tooltip")
                        .style("opacity", 0)
                        .style('position', 'absolute')
                        .style("background-color", "white")
                        .style("border", "solid")
                        .style("border-width", "2px")
                        .style("border-radius", "5px")
                        .style("padding", "5px")
        
        const mouseover = function(event,d) {
            tooltip.style("opacity", 1);
            d3.select(this)
              .style("stroke", "black");
        }

        const mousemove = function(event,d) {
            tooltip
                .html(d.variable + "<br>" + d.group + "<br>Value: " + d.value)
                .style("left", (event.x) - this.getBoundingClientRect().width * 2 + "px")
                .style("top", (event.y) - this.getBoundingClientRect().width + "px")
        }

        const mouseleave = function(d) {
            tooltip.style("opacity", 0);
            d3.select(this)
              .style("stroke", "none");
        }

        // Labels of row and columns
        var myGroups = ["1950-1960", "1960-1970", "1970-1980", "1980-1990", "1990-2000", "2000-2010", "2010-2020"]
        var labels = ["1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s"]
        var myVars = ["blues", "country", "hip hop", "jazz", "pop", "reggae", "rock"]

        // Build X scales and axis:
        const x = d3.scaleBand()
                    .range([0, this.smaller])
                    .domain(myGroups)
                    .padding(0.01);
                
        heatMap.append("g")
               .attr("transform", `translate(${this.centerX - this.smaller / 2}, ${this.centerY + this.smaller / 2})`)
               .call(d3.axisBottom(x).tickFormat((d, i) => labels[i]));

        // Build X scales and axis:
        const y = d3.scaleBand()
                    .range([this.smaller, 0])
                    .domain(myVars)
                    .padding(0.01);

        heatMap.append("g")
               .attr("transform", `translate(${this.centerX - this.smaller / 2}, ${this.centerY - this.smaller / 2})`)
               .call(d3.axisLeft(y));

        // Build color scale
        const myColor = d3.scaleLinear()
                        .range(["white", "#fa3a05"])
                        .domain([0,1200])

        //Read the data
        heatMap.selectAll()
            .data(this.heatData, d => d.group+':'+d.variable)
            .join("rect")
            .attr("class", "heatBlock")
            .attr("x", d => this.centerX - this.smaller / 2 + x(d.group) + x.bandwidth() * 0.02)
            .attr("y", d => this.centerY - this.smaller / 2 + y(d.variable))
            .attr("width", x.bandwidth() * 0.98)
            .attr("height", y.bandwidth() * 0.98)
            .style("fill", d => myColor(d.value))
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
    }
};