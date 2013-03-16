# Problem

How quickly can you find all words that can be constructed from a particular set of letters?
Given a list of English words and a set of letters (say “yxmijcmknbshdwifzrsmueist”), display all the words that can possibly be constructed from any subset (or all) those letters.

Assume the goal is to minimize the time between receiving the letters and displaying the possible words. 

Your algorithm should work with letter strings of arbitrary length. Try testing it with strings of 100 or 200 letters to see if it can scale.

Consider the case where input string is short (let's say <16 letters)?

# Solution

Create a Trie and add the list of words.
While adding the list of word, each word is stored as a tuple of (word, parentword)

To query the Trie, a function called find_word is written which expects a sorted string

A demo of trie using GAE and d3.js is also include here. Just change the appname in app.yaml and upload to app engine.
You can check out the demo [here](http://fzfindword.appspot.com/) 

Even though trie.py will scale to large strings (I queried string length of 200 and got reult in 4 seconds), d3.js is not able to handle that big result.
