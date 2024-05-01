---
layout: post
title:  "Type Erasure in Swift"
author: Sean Zhang
date:   2024-04-27
---

Why do we need erasing type infomation? Let's dive deeper into some examples and use cases.

## Basic Shape

{% highlight swift %}
// Circiles and Squares
// 1. don't need a base class
// 2. don't know about each other
// 3. don't know anything about their operations (affordances)
struct Square {
    var side: Double
}

struct Circle {
    var radius: Double
}

// How do I store an array of shapes that can be either Circle or Square?

var shapes: [Shape] = [circle1, sqaure1, circle2]

{% endhighlight %}

Because there is really nothing in common between the two types, we need to create a wrapper type so that we can have something in common.

{% highlight swift %}
// A wrapper type that we can erasing wrapped types such as Sqaure or Circle
protocol ShapeConcept {
    func doSerialize() {}
    func doDraw() {}
}

extension Square: ShapeConcept {
  // ...
}

extension Circle: ShapeConcept {
  // ...
}

var shapes: [ShapeConcept] = [
  Circle(radius: 1),
  Square(side: 2),
  Circle(radius: 2)
]
{% endhighlight %}