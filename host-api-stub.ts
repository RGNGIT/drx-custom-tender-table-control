import { IEntity, IRemoteComponentCardApi } from '@directum/sungero-remote-component-types';

class HostStubApi implements IRemoteComponentCardApi {
  public executeAction(actionName: string): Promise<void> {
    console.log(`Action ${actionName} executed.`)
    return Promise.resolve();
  }

  public canExecuteAction(actionName: string): boolean {
    return true;
  }

  public getEntity<T extends IEntity>(): T {
    return {} as T;
  }

  public onControlUpdate?: (() => void);
}

const api: IRemoteComponentCardApi = new HostStubApi();

export default api;
