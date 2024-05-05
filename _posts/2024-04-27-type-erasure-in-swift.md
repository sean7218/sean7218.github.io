---
layout: post
title:  "Type Erasure in Swift"
author: Sean Zhang
date:   2024-04-27
---

Why do we need erasing type infomation? Let's dive deeper into some examples and use cases.

## Basic types

Let's indroduce some basic types.

```swift
enum WeirdSize {
    case humongo
    case miniature
}

enum NormalSize {
    case teacup
    case teapot
}

struct Biscuit {
    var size: WeirdSize
}

struct Tea {
    var size: NormalSize
}

var eats: [Biscuit] = [Biscuit(size: .humongo)]
var drinks: [Tea] = [Tea(size: .teapot)]

// what if I want to combine eats and drinks array into one and what the type would it be?
var snacks: [Any] = eats + drinks
```


Here is a problem, how do we combine eats and drinks into one array since they don't share anything in common?
Yes the `var size` share the same name between Biscuit and Tea but their underlying type is different.
We can introduce a protocol `Snackable` with associated type `Size` and use the new swift feature existential any to combine them.  


```swift
protocol Snackable {
    associatedtype Size
    var size: Size { get }
}

extension Biscuit: Snackable {}
extension Tea: Snackable {}

var snacks: [any Snackable] = eats + drinks
```

With existential type, there is a performance hit because it is using dynamic dispatch during the runtime.
The next natural step is to use generic and type constraint to Snackable by using a wrapper type.


```swift
struct AnySnackable {
    var snack: Any
    init<T: Snackable>(_ snack: T) {
        self.snack = snack
    }
}

var snacks = [
    AnySnackable(Biscuit(shape: .round, size: .humongo)),
    AnySnackable(Tea(variety: .oolong, size: .teacup))
]
```

With `Snackable` in the example above, it is certainly not ideal because we use the type `Any`.
If we examine the Biscuit and Tea closer, we can see the associated type `Size` can be erased from the array perspective.
So let's try to erase the type `Size` only.  

Here we further refine the `AnySnackable` protocol by adding a generic for the associated type `Size`

```swift

struct AnySnack<S>: Snackable {
    var erasure: () -> S
    init<T: Snackable>(_ concrete: T) where T.Size == S {
        /// By wrapping the size property in a closure, we capture the concrete type T's Size type info and effectively erased all other type info of concrete T.
        /// For example, the oreo and cheetos are treated as same type now and all other type info of oreo and cheetos are gone.
        ///     var oreo: AnySnack<WeirdSize> = .init(Biscuit(size: .humongo))
        ///     var cheetos: AnySnack<WeirdSize> = .init(Biscuit(size: .miniature))
        self.erasure = {
            return concrete.size
        }
    }
    
    var size: S {
        self.erasure()
    }
}

let cookies: [AnySnack<WeirdSize>] = [
    AnySnack(Biscuit(size: .humongo)),
    AnySnack(Biscuit(size: .miniature)),
]

let teas: [AnySnack<NormalSize>] = [
    AnySnack(Tea(size: .teacup)),
    AnySnack(Tea(size: .teapot)),
]

// this will give you an error because WeirdSize and NormalSize doesn't match
// var snacks = cookies + teas 
```

## How do we achieve this goal?