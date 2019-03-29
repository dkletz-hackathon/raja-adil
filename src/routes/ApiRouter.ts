import {Router} from 'express';

const errHandlerWrapper = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    next(err);
  });
};

const generateErrorHandler = (controllers) => {
  if (!controllers) {
    return [];
  }
  if (Array.isArray(controllers)) {
    return controllers.map(controller => {
      return errHandlerWrapper(controller);
    });
  }
  return errHandlerWrapper(controllers);
};

// Extensible router to create resource router
class ApiRouter {

  public router: Router;
  public resourceController: any;
  public resourceMiddleware: any = {};
  public excepts: string[];

  constructor() {
    this.router = Router();
    this.excepts = [];
  }

  resource(controller) {
    this.resourceController = controller;
    return this;
  }

  middlewareResource(middleware) {
    this.resourceMiddleware = middleware;
    return this;
  }

  exceptResource(excepts) {
    this.excepts = excepts;
    return this;
  }

  executeResource() {
    if (this.excepts.indexOf("show") < 0 && typeof this.resourceController.show === "function") {
      this.router.get(
        "/:id",
        this.resourceMiddleware.show ?
          generateErrorHandler([...this.resourceMiddleware.show, this.resourceController.show]) :
          generateErrorHandler(this.resourceController.show)
      );
    }
    if (this.excepts.indexOf("index") < 0 && typeof this.resourceController.index === "function") {
      this.router.get(
        "",
        this.resourceMiddleware.index ?
          generateErrorHandler([...this.resourceMiddleware.index, this.resourceController.index]) :
          generateErrorHandler(this.resourceController.index)
      );
    }
    if (this.excepts.indexOf("store") < 0 && typeof this.resourceController.store === "function") {
      this.router.post(
        "",
        this.resourceMiddleware.store ?
          generateErrorHandler([...this.resourceMiddleware.store, this.resourceController.store]) :
          generateErrorHandler(this.resourceController.store)
      );
    }
    if (this.excepts.indexOf("update") < 0 && typeof this.resourceController.update === "function") {
      ["put", "patch"].forEach((method) => {
        this.router[method](
          "/:id",
          this.resourceMiddleware.update ?
            generateErrorHandler([...this.resourceMiddleware.update ,this.resourceController.update]) :
            generateErrorHandler(this.resourceController.update)
        );
      })
    }
    if (this.excepts.indexOf("destroy") < 0 && typeof this.resourceController.destory === "function") {
      this.router.delete(
        "/:id",
        this.resourceMiddleware.destroy ?
          generateErrorHandler([...this.resourceMiddleware.destroy, this.resourceController.destroy]) :
          generateErrorHandler(this.resourceController.destroy)
      );
    }
  }

  get(route, ...args) {
    this.router.get(route, generateErrorHandler(args));
  }

  post(route, ...args) {
    this.router.post(route, generateErrorHandler(args));
  }

  put(route, ...args) {
    this.router.put(route, generateErrorHandler(args));
  }

  patch(route, ...args) {
    this.router.patch(route, generateErrorHandler(args));
  }

  delete(route, ...args) {
    this.router.delete(route, generateErrorHandler(args));
  }

}


export default ApiRouter;
