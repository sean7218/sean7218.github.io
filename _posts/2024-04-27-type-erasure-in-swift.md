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

> Note that the above example, as well as the other pieces of sample code in this article, is not thread-safe — in order to keep things simple. For more info on thread safety, check out “Avoiding race conditions in Swift”.


Maybe we can try some of these?

{% highlight swift %}
class RequestQueue<Response, Error: Swift.Error> {
    private typealias TypeErasedRequest = AnyRequest<Response, Error>

    private var queue = [TypeErasedRequest]()
    private var ongoing: TypeErasedRequest?

    // We modify our 'add' method to include a 'where' clause that
    // gives us a guarantee that the passed request's associated
    // types match our queue's generic types.
    func add<R: Request>(
        _ request: R,
        handler: @escaping R.Handler
    ) where R.Response == Response, R.Error == Error {
        // To perform our type erasure, we simply create an instance
        // of 'AnyRequest' and pass it the underlying request's
        // 'perform' method as a closure, along with the handler.
        let typeErased = AnyRequest(
            perform: request.perform,
            handler: handler
        )

        // Since we're implementing a queue, we don't want to perform
        // two requests at once, but rather save the request for
        // later in case there's already an ongoing one.
        guard ongoing == nil else {
            queue.append(typeErased)
            return
        }

        perform(typeErased)
    }

    private func perform(_ request: TypeErasedRequest) {
        ongoing = request

        request.perform { [weak self] result in
            request.handler(result)
            self?.ongoing = nil

            // Perform the next request if the queue isn't empty
            ...
        }
    }
}
{% endhighlight %}
