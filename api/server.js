const app = require('express')();
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.get('/', async function (req, res) {
    try {
        const polly = new AWS.Polly({ apiVersion: '2016-06-10', region: 'us-west-2' });
        console.log(req.query)
        const params = {
            OutputFormat: req.query.format,
            SampleRate: "8000",
            Text: req.query.text,
            TextType: "text",
            VoiceId: req.query.voice
        };
        const pollyResponse = await polly.synthesizeSpeech(params).promise();
        res.writeHead(200, {
            'Content-Type': 'audio/mp3',
            'Content-disposistion': 'attachment;filename=hello.mp3',
            'Content-Length': pollyResponse.AudioStream.length
        });
        res.end(pollyResponse.AudioStream)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});