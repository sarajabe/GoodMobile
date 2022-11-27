export interface IWebWorkerService {
  run<T>(workerFunction: (param) => T, data?: any): Promise<T>;

  runUrl(url: string, data?: any): Promise<any>;

  terminate<T>(promise: Promise<T>): Promise<T>;
}
