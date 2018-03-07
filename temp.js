    const ffmpeg = require('fluent-ffmpeg');
    const inputFilename = 'N:/zzzTag/temp/Andrew_Miller_-_Pure_-_10._Episode_10_b01m7qr1_original.m4a';
    const outputFilename = 'N:/zzzTag/output/temp_output_file.m4a';

    const artist = 'Someone';
    const album = 'Some title';

    const options = [
        '-metadata', 'artist=Someone',
        '-metadata', 'album=Some title ',
        '-metadata', 'track=1'
       ];
   
    ffmpeg(inputFilename)
      .outputOptions(options)
      .saveToFile(outputFilename);

