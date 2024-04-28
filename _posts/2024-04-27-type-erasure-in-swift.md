---
layout: post
title:  "Type Erasure in Swift"
author: Sean Zhang
date:   2024-04-27
---

Why do we need erasing type infomation? Let's dive deeper into some examples and use cases.

## What is type erasure?



{% highlight swift %}
protocol Shape {
  func draw()
}

// Some Comments
/*

*/
///

protocol Human {
  associatedtype Interest
  func share(with person: Human, interest: Interest) -> Bool
}

class Circle: Shape {
  func draw() {
    print("Drawing Circle")
  }

  public static var D: String = ""

  var radius: Double {
    return 31.2
  }
}

typealias Closure = (String) -> Bool

enum Actions {
  case fetch(Data?)
  case loaded(Data?)
}
{% endhighlight %}

