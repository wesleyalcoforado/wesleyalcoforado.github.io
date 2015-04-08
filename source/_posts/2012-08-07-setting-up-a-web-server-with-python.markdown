---
layout: posts
title: Setting up a simple web server with Python
description: Sometimes we just need a web server to run our pages, but without all the fancy stuff. If you already have Apache working, this trick may not be so useful, but if you don't, it's way easier.
category: code
---

Sometimes we just need a web server to run our pages, but without all the fancy stuff. If you already have Apache working, this trick may not be so useful, but if you don't, it's way easier.

On the console, type:
{% highlight bash %}
cd /your_folder/your_files/
python -m SimpleHTTPServer
{% endhighlight %}
This will make Python run a web server on _localhost_ at port 8000, serving the contents of the folder "your_files". If there is an *index.html*, it will be shown by default, otherwise, it will show a list of all files.

If you want to start the web server at another port, just add its number in the command.
{% highlight bash %}
python -m SimpleHTTPServer 8080
{% endhighlight %}
