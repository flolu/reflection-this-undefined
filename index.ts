import "reflect-metadata";

const METHODS = "__methods__";
const Method = (obj: object) => {
  return function MethodDecorator(
    target: object,
    methodName: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    const metadata = Reflect.getMetadata(METHODS, obj);

    Reflect.defineMetadata(
      METHODS,
      { ...metadata, [methodName]: descriptor.value },
      obj
    );
  };
};

const someObject: object = new Object();
class Main {
  private num = 42;

  constructor(other: Other) {
    other.init(someObject);
  }

  @Method(someObject)
  myMethod() {
    console.log("hello");
    console.log(this.num); // this is undefined
  }
}

class Other {
  private methods: Record<string, Function> = {};

  init(obj: object) {
    this.methods = Reflect.getMetadata(METHODS, obj);
  }

  trigger(methodName: string) {
    this.methods[methodName]();
  }
}

const other = new Other();
new Main(other);
other.trigger("myMethod");
