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
        res.end(pollyResponse.AudioStream);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/semantics', async function (req, res) {
    try {
        const comprehend = new AWS.Comprehend({apiVersion: '2017-11-27', region: 'us-west-2'});
        console.log(req.query)
        const params = {
            LanguageCode: req.query.languageCode,
            Text: req.query.analysisText
        };
        const comprehendResponse = await comprehend.detectSentiment(params).promise();
        res.send(comprehendResponse.Sentiment);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/syntax', async function (req, res) {
    try {
        const comprehend = new AWS.Comprehend({apiVersion: '2017-11-27', region: 'us-west-2'});
        console.log(req.query);
        const params = {
            LanguageCode: req.query.languageCode,
            Text: req.query.analysisText
        };
        const comprehendResponse = await comprehend.detectSyntax(params).promise();
        res.send(comprehendResponse.SyntaxTokens);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/keyphrases', async function (req, res) {
    try {
        const comprehend = new AWS.Comprehend({apiVersion: '2017-11-27', region: 'us-west-2'});
        console.log(req.query);
        const params = {
            LanguageCode: req.query.languageCode,
            Text: req.query.analysisText
        };
        const comprehendResponse = await comprehend.detectKeyPhrases(params).promise();
        res.send(comprehendResponse.KeyPhrases);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/translate', async function (req, res) {
    try {
        const translate = new AWS.Translate({apiVersion: '2017-07-01', region: 'us-west-2'});
        console.log(req.query);
        const params = {
            SourceLanguageCode: req.query.languageCode,
            TargetLanguageCode: req.query.translationLanguageCode,
            Text: req.query.analysisText
        };
        const translateResponse = await translate.translateText(params).promise();
        res.send(translateResponse.TranslatedText);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});