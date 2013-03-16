from flask import Flask, url_for, jsonify, redirect
from flask import render_template
from datetime import date
import json
from functools import wraps
from flask import redirect, request, current_app
from trie import *

Root = load_dict()

def support_jsonp(f):
    """Wraps JSONified output for JSONP"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        callback = request.args.get('callback', False)
        if callback:
            content = str(callback) + '(' + str(f().data) + ')'
            return current_app.response_class(content, mimetype='application/json')
        else:
            return f(*args, **kwargs)
    return decorated_function
    
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_words/<letters>')
@support_jsonp
def get_words(letters):
    print letters
    return jsonify(d3_tree(''.join(sorted(letters)), Root))




if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
