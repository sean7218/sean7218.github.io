---
layout: post
title:  "Type Erasure in Swift"
author: Sean Zhang
date:   2024-04-27
---

Why do we need erasing type infomation? Let's dive deeper into some examples and use cases.

## Basic Structs

```swift
struct Biscuit {
    enum Shape {
        case round
        case square
    }
    enum Size {
        case humongo
        case miniature
    }
    
    var shape: Shape
    var size: Size
}

struct Tea {
    enum Variety {
        case oolong
        case puerh
    }
    enum Size {
        case teacup
        case teapot
    }
    
    var variety: Variety
    var size: Size
}

var eats: [Biscuit] = [.init(shape: .round, size: .humongo)]
var drinks: [Tea] = [.init(variety: .oolong, size: .teacup)]
```

Here is a problem, how do we combine eats and drinks into one array since they don't share anything in common?
Yes the `var size: Size` share the same name between Biscuit and Tea but their underlying type is different.
We can introduce a protocol `Snackable` with associated type `Size` and use the new swift feature existential any to combine them.


```swift
protocol Snackable {
    associatedtype Size
    func calories(size: Size) -> Int
}

extension Biscuit: Snackable {
    func calories(size: Size) -> Int {
        return size == .humongo ? 100 : 10
    }
}
extension Tea: Snackable {
    func calories(size: Size) -> Int {
        return size == .teacup ? 1 : 10
    }
}

let existantialSnacks: [any Snackable] = eats + drinks
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

let anySnacks = [
    AnySnackable(Biscuit(shape: .round, size: .humongo)),
    AnySnackable(Tea(variety: .oolong, size: .teacup))
]
```

With `Snackable` in the example above, it is certainly not ideal because we use the type `Any`.
If we examine the Biscuit and Tea closer, we can see the associated type `Size` should be erased from the array perspective.
So let's try to erase the type `Size` only.

```swift

struct SizelessSnackable {
    var calories: (Any) -> Int
    init<T: Snackable>(_ snack: T) {
        self.calories = { size in
            guard let size = size as? T.Size else {
                fatalError("Oops")
            }
            return snack.calories(size: size)
        }
    }
}
```