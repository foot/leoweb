from leo import leo
from flask import Flask, jsonify
import json

app = Flask(__name__)

def save_lookup(src, dst):
    try:
        with open('db.json', 'r') as f:
            db = json.loads(f.read())
    except (IOError, ValueError):
        db = []
    db.append({ 'src': src, 'dst': dst })
    with open('db.json', 'w') as f:
        f.write(json.dumps(db))

@app.route("/lookup/<word>")
def hello(word):
    dst, src = lookup(word)
    save_lookup(src, dst)
    return jsonify(en=src, de=dst)

def lookup(word):
    res = leo.get([word])
    [en, de] = res[0]
    return en.replace(u'\xa0', u' '), de.replace(u'\xa0', u' ')
