import os
import webapp2

import jinja2

jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.dirname(__file__)))
    
from base_handler import BaseHandler
import json
from trie import load_dict, d3_tree

Root = load_dict()

URLS = []
def create_url(url=None, method='get'):
    def wrapper(func):
        cls = type(func.func_name + 'Handler', (BaseHandler,), {method.lower():func})
        URLS.append((url or '/%s/'%func.func_name, cls))
        def inner(*args, **kwargs):
            return func(*args, **kwargs)
        return inner
    return wrapper

@create_url()
def get_words(self):
    letters = self.request.get('letters')    
    self.response.out.write(json.dumps(d3_tree(''.join(sorted(letters)), Root)))

@create_url('/')
def index(self):
    template = jinja_environment.get_template('templates/index.html')
    self.response.out.write(template.render({}))
    
app = webapp2.WSGIApplication(URLS, debug=os.environ['SERVER_SOFTWARE'].startswith('Dev'))
