class cluster {
    constructor(globalApplicationState) {
        this.globalApplicationState = globalApplicationState;
        this.clusterData = globalApplicationState.clusterData;
        d3.select('#cluster')
            .on('click', (event) => this.setup(event));
    }

    setup(event) {
        console.log('Plotting heat map...');

        let visContainer = d3.select('.visualization');

        visContainer.html('');

        visContainer
            .append('svg')
            .attr('id', 'clusterMap');

        let divElement = d3.select('.visualization').node();

        // Get the width and height using standard JavaScript properties
        let divWidth = divElement.clientWidth;
        let divHeight = divElement.clientHeight;

        let clusterMap = d3.select("#clusterMap");
        clusterMap.attr("width", divWidth)
            .attr("height", divHeight)
            .append('rect')
            .attr('class', 'mainCanvas')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('fill', '#15150d');

        // const buttonNames = ['0.5% Words', '1.0% Words', '1.5% Words', '2.0% Words'];
        // const classesToKeep = ['mainCanvas', 'buttonGrp']

        // // Add buttons to the left edge in the middle of the y position
        // const buttons = clusterMap.selectAll('button')
        //     .data(buttonNames)
        //     .enter()
        //     .append('g')
        //     .attr('transform', (d, i) => `translate(0, ${divHeight / 2 + i * 40})`)
        //     .on('click', (event, i) => {
        //         // const elementsToKeep = clusterMap.selectAll(classesToKeep.map(className => `.${className}`).join(','));
        //         clusterMap.selectAll(`:not(:is(${classesToKeep.map(className => `.${className}`).join(',')}))`).remove();
        //         this.plotCluster(buttonNames.indexOf(i) + 1);
        //     });

        // d3.selectAll('.visualization g').attr('class', 'buttonGrp'); 

        // buttons.append('rect')
        //     .attr('width', 100)
        //     .attr('height', 30)
        //     .attr('fill', 'rgba(255,255,255,0.1)')
        //     .attr('stroke', 'white');

        // buttons.append('text')
        //     .text(d => d)
        //     .attr('x', 10)
        //     .attr('y', 20)
        //     .style('pointer-events', 'none')
        //     .attr('fill', "white");

            this.plotCluster(2);
    }

    plotCluster(dropDownVal) {
        let divElement = d3.select('.visualization').node();

        // Get the width and height using standard JavaScript properties
        let divWidth = divElement.clientWidth;
        let divHeight = divElement.clientHeight;

        const margin = { top: 0, right: 0, bottom: 0, left: 0 };
        const width = divWidth - margin.left - margin.right;
        const height = divHeight - margin.top - margin.bottom;

        let visContainer = d3.select("#clusterMap");
        // visContainer.attr("width", width)
        //     .attr("height", height)
        //     .append('rect')
        //     .attr('width', '100%')
        //     .attr('height', '100%')
        //     .attr('fill', '#15150d');

        // let dropDownVal = 4;
        let percent = ["0.5", "1", "1.5", "2"];
        let metaData = this.clusterData["clusterMetaData"][percent[dropDownVal - 1]];
        let datasetNm = `clusterPlotData${dropDownVal}`;
        let clusterPlotData = []
        for (let [key, value] of Object.entries(this.clusterData[datasetNm])) {
            let rank = 1;
            for (let [keyword, value2] of Object.entries(value)) {
                let dict = {};
                dict["decade"] = Number(key);
                dict["word"] = keyword;
                dict["count"] = value2[0];
                dict["rank"] = rank++;
                dict["radius"] = value2[1];
                dict["group"] = (Number(key) - 1940) / 10;
                clusterPlotData.push(dict);
            }
        }
        // console.log(clusterPlotData);



        const xScale = d3.scaleBand()
            .domain([1, 2, 3, 4, 5, 6, 7])
            .rangeRound([0, width]);

        const color = d3.scaleOrdinal()
            .domain([1, 2, 3, 4, 5, 6, 7])
            .range(d3.schemeCategory10);

        const node = visContainer.append("g")
            .selectAll("circle")
            .data(clusterPlotData)
            .join("circle")
            .attr("class", d => `node ${d.word}`)
            .attr("r", d => d.radius)
            .style("fill", d => color(d.group))
            .style("opacity", 0.6)
            .attr("stroke", "white")
            .style("stroke-width", 0)
            .on('mouseover', handleMouseOver)
            .on('mouseout', handleMouseOut)

        const tickTexts = xScale.domain();
        visContainer.selectAll('text')
            .data(tickTexts)
            .enter()
            .append('text')
            .text(d => 1940 + d * 10 + 's')
            .attr('x', d => xScale(d) + xScale.bandwidth() / 2)
            .attr('y', 50)
            .attr('text-anchor', 'middle')
            .attr('fill', "white");

        metaData.forEach(function (decadeInfo) {
            let xPos = ((decadeInfo.decade - 1940) / 10) * (width / 7) - width / 14;
            let yPos = height / 15;

            let metaInfo = visContainer.append('g')
                .attr('class', 'metaInfo')
                .style('opacity', 0);

            metaInfo.append('text')
                .text('Total Unique Words: ' + decadeInfo.totalWords)
                .attr('x', xPos)
                .attr('y', yPos + 20)
                .attr('fill', 'white');

            metaInfo.append('text')
                .text('Top Repeated Words: ' + decadeInfo.topWordsCount)
                .attr('x', xPos)
                .attr('y', yPos + 40)
                .attr('fill', 'white');

            // Show the tooltip
            metaInfo.transition()
                .duration(200)
                .style('opacity', 1);
        });

        function handleMouseOver(event, d) {
            d3.selectAll(`.${d.word}`).style("stroke-width", 3)
                .style('opacity', 1);

            let wordList = clusterPlotData.filter(wordDict => wordDict.word === d.word);

            wordList.forEach(function (wordDict) {
                let xPos = ((wordDict.decade - 1940) / 10) * (width / 7) - width / 14;
                let yPos = height - height / 8;

                let tooltip = visContainer.append('g')
                    .attr('class', 'tooltip')
                    .style('opacity', 0);

                // Create a white rectangle with border
                tooltip.append('rect')
                    .attr('width', width/14)
                    .attr('height', '80px')
                    .attr('fill', 'rgba(255,255,255,0.1)') // Transparent white background
                    .attr('stroke', 'white') // White border
                    .attr('stroke-width', 2)
                    .attr('rx', 2)
                    .attr('x', xPos - width/14 + width/28)
                    .attr('y', yPos);

                // Add text to the tooltip
                tooltip.append('text')
                    .text('Decade: ' + wordDict.decade + 's')
                    .attr('x', xPos)
                    .attr('y', yPos + 13)
                    .attr('fill', 'white');

                tooltip.append('text')
                    .text('Word: ' + wordDict.word)
                    .attr('x', xPos)
                    .attr('y', yPos + 33)
                    .attr('fill', 'white');

                tooltip.append('text')
                    .text('Count: ' + wordDict.count)
                    .attr('x', xPos)
                    .attr('y', yPos + 53)
                    .attr('fill', 'white');

                tooltip.append('text')
                    .text('Rank: ' + wordDict.rank)
                    .attr('x', xPos)
                    .attr('y', yPos + 73)
                    .attr('fill', 'white');

                // Show the tooltip
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 1);
            });
        }

        function handleMouseOut(event, d) {
            d3.selectAll('.tooltip').remove();
            d3.selectAll(`.${d.word}`).style("stroke-width", 0)
                .style('opacity', 0.6);
        }

        const simulation = d3.forceSimulation()
            .force("x", d3.forceX().strength(1.0).x(d => xScale(d.group) - xScale(d.group) * 0.2))
            .force("y", d3.forceY().strength(0.5).y(height / 2))
            .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
            .force("charge", d3.forceManyBody().strength(8.0)) // Nodes are attracted one each other of value is > 0
            .force("collide", d3.forceCollide().strength(0.3).radius(d => d.radius + 1).iterations(8)) // Force that avoids circle overlapping
            .alpha(0.4)
            .alphaDecay(0.05)


        simulation.nodes(clusterPlotData)
            .on("tick", function (d) {
                node.attr("cx", d => d.x)
                    .attr("cy", d => d.y)
            });

        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(.03).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }
        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(.03);
            d.fx = null;
            d.fy = null;
        }
    }
}

