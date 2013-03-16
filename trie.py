import string

class Node(object):
    def __init__(self, ch, root=None):
        self.ch = ch
        self.children = {}  
        self.words = {}
        self.root = root or self
    
    def get_parent(self, word):
        l = len(word)
        word = word.lower()
        for i in range(1,l):
            if self.root.is_word(word[:l-i]):
                return word[:l-i]
        return None
        
    def add(self, sword, word):
        if not sword:            
            self.words[word] = self.get_parent(word)
            return
        chnode = self.children.get(sword[0], Node(sword[0], self.root))
        chnode.add(sword[1:], word)
        self.children[sword[0]] = chnode
    
    def is_word(self, word):
        word=word.lower()
        sword = sorted(word)
        root = self
        for e in sword:
            root = root.children.get(e)
            if root is None:return False
        if word in root.words:return True
        return False

def find_words(letters, root):
    res = root.words.copy()
    if not letters:return res
    seen={}
    for i in range(len(letters)):
        if seen.get(letters[i]):continue
        seen[letters[i]] = 1    
        if letters[i] in root.children.keys():
            res.update(find_words(letters[i+1:], root.children[letters[i]]))
    return res

def d3_tree(letters, root):
    res = {}
    res2={"name":"root", "children":[]}
    for key,value in find_words(letters, root).items():
        k = res.setdefault(value, [])
        k.append(key)
    for e in string.lowercase:
        if e in letters.lower():
            res2["children"].append(get_array(res, e))
    return res2

def get_array(data, key):
    if not data.get(key):return {"name":key}
    res=[]
    for e in data[key]:
        x = get_array(data, e)
        res.append(x)
    return {"name":key, "children":res}
        
def load_dict():
    f=open('wordlist.txt')
    words = [e.strip() for e in f]
    root = Node(None)
    for e in words:root.add(sorted(e.lower()), e)
    return root
    
if __name__ == '__main__':
    load_dict()
    
    
