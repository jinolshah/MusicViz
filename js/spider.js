class spider {

    constructor(globalApplicationState) {
        this.globalApplicationState = globalApplicationState;
        d3.select('#spider')
          .on('click', (event) => this.setup(event));
    }

    setup(event) {
        console.log('Plotting spider chart...');

        let visContainer = d3.select('.visualization');

        visContainer.html('');

        let dropContainer = visContainer
                                .append('div')
                                .attr('id', 'dropContainer');

        let dropdown1 = dropContainer
                            .append('div')
                            .attr('class', 'spiderDataRow')
                            .attr('id', 'dropdown1div')
                            .append('select')
                            .attr('id', 'options1')
                            .on('change', (event) => {
                                this.plotSpider1(event.target.value);
                            });
        
        d3.select('#dropdown1div')
            .append('div')
            .attr('id', 'data1')

        let dropdown2 = dropContainer
                            .append('div')
                            .attr('class', 'spiderDataRow')
                            .attr('id', 'dropdown2div')
                            .append('select')
                            .attr('id', 'options2')
                            .on('change', (event) => {
                                this.plotSpider2(event.target.value);
                            });
            
        d3.select('#dropdown2div')
            .append('div')
            .attr('id', 'data2')

        dropdown1
            .selectAll('option')
            .data(Object.keys(this.globalApplicationState.spiderData))
            .enter()
            .append('option')
            .text(d => this.globalApplicationState.spiderData[d]['name'])
            .attr('value', d => d);
        
        dropdown2
            .selectAll('option')
            .data(Object.keys(this.globalApplicationState.spiderData))
            .enter()
            .append('option')
            .text(d => this.globalApplicationState.spiderData[d]['name'])
            .attr('value', d => d);

        visContainer
            .append('div')
            .attr('id', 'spiderGraphAndDesc')
            .append('div')
            .attr('id', 'spiderMainGraph')
            .append('svg')
            .attr('id', 'spiderChart')
            .append('g')
            .attr('id', 'grid');

        let description = `
        <div id="sliderBar">
            <div id="arrowIcon">&#9650;</div>
        </div>
        <div id="sliderContent">
        <p id="spiderDesc">
            <strong>All measures range from 0 to 1</strong>
            <br><br>
            <strong>Danceability:</strong> Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity.
            <br><br>
            <strong>Energy:</strong> Energy represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. For example, death metal has high energy, while a Bach prelude scores low on the scale. Perceptual features contributing to this attribute include dynamic range, perceived loudness, timbre, onset rate, and general entropy.
            <br><br>
            <strong>Acousticness:</strong> A confidence measure of whether the track is acoustic.
            <br><br>
            <strong>Speechiness:</strong> Speechiness detects the presence of spoken words in a track i.e. how wordy the song in comparison to the instruments.
            <br><br>
            <strong>Valence:</strong> Describes the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry)
        </p>
        </div>
        `

        d3.select('#spiderGraphAndDesc')
            .append('div')
            .attr('id', 'sliderContainer')
            .html(description)

        d3.select('#sliderBar').on('click', function() {
            const sliderContent = d3.select('#sliderContent');
            const isOpen = sliderContent.style('max-height') !== '0px';
            
            if (isOpen) {
                sliderContent.style('max-height', '0');
                d3.select('#arrowIcon').html('&#9650;');
            } else {
                sliderContent.style('max-height', '50vh'); // Adjust the maximum height as needed
                d3.select('#arrowIcon').html('&#9660;');
            }
        });

        this.setupAxes();
        
        let initSong1 = dropdown1.property('value');
        this.plotSpider1(initSong1);

        let initSong2 = dropdown2.property('value');
        this.plotSpider2(initSong2);
    }

    setupAxes() {
        let data = [[0, 'danceability', 'middle'], [1,'energy', 'start'], [2, 'acousticness', 'start'], [3, 'speechiness', 'end'], [4, 'valence', 'end']];

        let spiderChart = d3.select('#spiderChart');

        let axes = 5;
        
        let centerX = parseInt(spiderChart.style('width'))/2;
        this.centerX = centerX;
        let centerY = parseInt(spiderChart.style('height'))/2;
        this.centerY = centerY;

        let radius = 0.50 * Math.min(centerX, centerY);
        this.radius = radius;

        let scale = d3.scaleLinear()
                      .domain([0, 1])
                      .range([0, radius]);
        this.scale=scale;

        let ticks = [0.2, 0.4, 0.6, 0.8, 1.0];

        let angles = d3.scaleLinear()
                       .domain([0, axes])
                       .range([(3/2) * Math.PI, (3/2) * Math.PI + 2 * Math.PI]);
        this.angles = angles;

        // function angleToCoordinate(d) {
        //     console.log(d)
        //     let x = Math.cos(angles(d[0])) * scale(d[1]);
        //     let y = Math.sin(angles(d[0])) * scale(d[1]);
        //     return [centerX + x, centerY]
        // }

        // this.angleToCoordinate = angleToCoordinate;

        let line = d3.line()
                    .x(d => this.centerX + Math.cos(this.angles(d[0])) * this.scale(d[1]))
                    .y(d => this.centerY + Math.sin(this.angles(d[0])) * this.scale(d[1]));
        this.line = line;

        let group = d3.select('#grid');

        group
            .selectAll('circle')
            .data(ticks)
            .enter()
            .append('circle')
            .attr('cx', centerX)
            .attr('cy', centerY)
            .attr('fill', 'none')
            .attr('stroke', 'gray')
            .attr('stroke-width', 1)
            .attr('r', d => scale(d));

        group
            .selectAll('.ticklabel')
            .data(ticks)
            .enter()
            .append('text')
            .attr('class', 'ticklabel')
            .attr('x', centerX + 4)
            .attr('y', d => centerY - scale(d) + 20 -d)
            .text(d => d.toString());

        group
            .selectAll('line')
            .data(data)
            .enter()
            .append('line')
            .attr('stroke', 'gray')
            .attr('stroke-width', 1)
            .attr('x1', centerX)
            .attr('y1', centerY)
            .attr('x2', d => {
                return centerX + radius * Math.cos(angles(d[0]))
            })
            .attr('y2', d => {
                return centerY + radius * Math.sin(angles(d[0]))
            });

        group
            .selectAll('.axislabel')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'ticklabel')
            .attr('x', d => {
                return centerX + (radius + 15)* Math.cos(angles(d[0]))
            })
            .attr('y', d => {
                return centerY + (radius + 15) * Math.sin(angles(d[0]))
            })
            .attr('text-anchor', d => d[2])
            .text(d => d[1]);
    }

    plotSpider1(song) {
        console.log('plotting song', this.globalApplicationState.spiderData[song].name, song)
        
        let songFeatures = this.globalApplicationState.spiderData[song]

        let data = [[0, songFeatures.danceability], [1, songFeatures.energy], [2, songFeatures.acousticness], [3, songFeatures.speechiness], [4, songFeatures.valence], [0, songFeatures.danceability]];

        d3.select('.dataplot1').remove()

        let dataPlot = d3.select('#spiderChart')
                         .append('g')
                         .attr('class', 'dataplot1');

        console.log(data);

        dataPlot
            .selectAll('path')
            .data([data])
            .enter()
            .append('path')
            .attr('d', this.line)
            .attr('stroke-width', 2)
            .attr('stroke', 'blue')
            .attr('fill', 'blue')
            .attr('stroke-opacity', 0.5)
            .attr('fill-opacity', 0.3)
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round');
        
        d3.select('#data1text').remove()

        let dataText = d3.select('#data1')
                            .append('p')
                            .attr('id', 'data1text');

        dataText.html(`
            Song #1<br>
            Danceability: ${songFeatures.danceability}<br>
            Energy: ${songFeatures.energy}<br>
            Acousticness: ${songFeatures.acousticness}<br>
            Speechiness: ${songFeatures.speechiness}<br>
            Valence: ${songFeatures.valence}
        `);
    }

    plotSpider2(song) {
        console.log('plotting song', this.globalApplicationState.spiderData[song].name, song)
        
        let songFeatures = this.globalApplicationState.spiderData[song]

        let data = [[0, songFeatures.danceability], [1, songFeatures.energy], [2, songFeatures.acousticness], [3, songFeatures.speechiness], [4, songFeatures.valence], [0, songFeatures.danceability]];

        d3.select('.dataplot2').remove()

        let dataPlot = d3.select('#spiderChart')
                         .append('g')
                         .attr('class', 'dataplot2');

        console.log(data);

        dataPlot
            .selectAll('path')
            .data([data])
            .enter()
            .append('path')
            .attr('d', this.line)
            .attr('stroke-width', 2)
            .attr('stroke', 'red')
            .attr('fill', 'red')
            .attr('stroke-opacity', 0.5)
            .attr('fill-opacity', 0.3)
            .attr('stroke-linejoin', 'round')
            .attr('stroke-linecap', 'round');

        d3.select('#data2text').remove()

        let dataText = d3.select('#data2')
                            .append('p')
                            .attr('id', 'data2text');
        
        dataText.html(`
            Song #2<br>
            Danceability: ${songFeatures.danceability}<br>
            Energy: ${songFeatures.energy}<br>
            Acousticness: ${songFeatures.acousticness}<br>
            Speechiness: ${songFeatures.speechiness}<br>
            Valence: ${songFeatures.valence}
        `);
    }
};