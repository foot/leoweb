const express = require('express');
const dictcc = require('dictcc-js');

const app = express();

app.get('/api/lookup/:fromLang-:toLang/:word', (req, res) => {
  const { fromLang, toLang, word } = req.params;
  console.log(JSON.stringify({ fromLang, toLang, word }));
  dictcc.translate(fromLang, toLang, encodeURIComponent(word), (data, error) => {
    if (error) {
      return res.status(500).json({ error });
    }

    return res.json({ data });
  });
});

app.listen(5000, () => console.log('App server listening on port 5000!'))
