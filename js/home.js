d3.select('#home')
    .on('click', (event) => this.setup(event));

function setup(event = null) {
    console.log('Check');

    let visContainer = d3.select('.visualization');
    visContainer.html('');

    text = `
        <p id='note'>🎵</p>
        <p id='hometext'>
            The world of music is vast and dynamic. Ever-evolving trends, the fusion of genres, and the creativity of artists shape it. Over the years, the music industry has been constantly changing, driven by technological and social evolution.
            <br><br>This project seeks to explore the rich database of music data, aiming to uncover hidden patterns, tell stories about the past, and help us understand how music has changed. Through effective visualization techniques, we aim to offer a unique perspective on the world of music.
            <br><br>Our motivation lies in our shared passion for music and the opportunity to combine our diverse skills to explore the world of music data. We want to learn more about music trends and contribute to knowledge in the field. This project allows us to merge our interests with academic and professional pursuits.
        </p>   
        `

    visContainer.append('div')
                .html(text)

};

setup();