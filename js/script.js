async function loadData () {
    // const artistsData = await d3.json('Data/artist_details.csv');
    const songsData = await d3.json('Data/songs.json');
    const songsFeaturesData = await d3.json('Data/song_features.json');
    const heatMapData = await d3.csv("Data/genreDistribution.csv");

    const clusterPlotData1 = await d3.json("Data/wordDistribution1.json");
    const clusterPlotData2 = await d3.json("Data/wordDistribution2.json");
    const clusterPlotData3 = await d3.json("Data/wordDistribution3.json");
    const clusterPlotData4 = await d3.json("Data/wordDistribution4.json");
    const clusterMetaData = await d3.json("Data/wordMetaData.json");

    for (const key in songsData) {
        songsFeaturesData[key]['name'] = songsData[key]['name'];
    }

    return {
        "songsFeaturesData" : songsFeaturesData, 
        "heatMapData" : heatMapData,
        "clusterPlotData": {
            "clusterPlotData1": clusterPlotData1,
            "clusterPlotData2": clusterPlotData2,
            "clusterPlotData3": clusterPlotData3,
            "clusterPlotData4": clusterPlotData4,
            "clusterMetaData": clusterMetaData,
        }
    };
}

const globalApplicationState = {
    spiderData: null,
    spiderChart: null,
    heatData: null,
    heatMap: null
};

loadData().then(loadedData => {
    globalApplicationState.spiderData = loadedData.songsFeaturesData;
    globalApplicationState.heatData = loadedData.heatMapData;
    globalApplicationState.clusterData = loadedData.clusterPlotData;

    let spiderChart = new spider(globalApplicationState);
    let heatMap = new heat(globalApplicationState);
    let clusterPlot = new cluster(globalApplicationState);

    globalApplicationState.spiderChart = spiderChart;
    globalApplicationState.heatMap = heatMap;
    globalApplicationState.clusterPlot = clusterPlot;
});