const binData = (data, binSize) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const numBins = Math.floor((max - min) / binSize) + 1;

    const bins = Array.from({ length: numBins }, (_, i) => {
        const lowerBound = min + i * binSize;
        const upperBound = lowerBound + binSize;
        return {
            range: `${lowerBound.toLocaleString()} - ${upperBound.toLocaleString()}`,
            count: 0,
            lowerBound,
            upperBound,
        };
    });

    data.forEach((value) => {
        const binIndex = Math.floor((value - min) / binSize);
        bins[binIndex].count += 1;
    });

    return bins;
};