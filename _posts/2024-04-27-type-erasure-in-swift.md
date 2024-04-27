---
layout: post
title:  "Type Erasure in Swift"
author: Sean Zhang
date:   2024-04-27
---

```swift
protocol Shape {

}
```
{% highlight swift %}
class RequestQueue {
    // Error: protocol 'Request' can only be used as a generic
    // constraint because it has Self or associated type requirements
    func add(_ request: Request,
             handler: @escaping Request.Handler) {
        ...
    }
}
{% endhighlight %}

