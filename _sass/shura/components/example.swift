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
