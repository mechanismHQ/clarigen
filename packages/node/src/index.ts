import {
  ContractCall,
  broadcast,
  ro,
  roOk,
  roErr,
  Response,
  JsonIfOption,
  ApiOptions,
  Network,
} from '@clarigen/core';

export interface NodeOptions {
  url: string;
  privateKey?: string;
}

type ClientRoOptions = Omit<ApiOptions, 'url'>;

type JsonIf<O extends ClientRoOptions, T> = JsonIfOption<O & { url: string }, T>;

export class ClarigenNodeClient {
  public url: string;

  constructor(networkOrUrl: Network | string) {
    if (typeof networkOrUrl === 'string') {
      this.url = networkOrUrl;
    } else {
      this.url = networkOrUrl.getCoreApiUrl();
    }
  }

  private roOptions(options: ClientRoOptions): ApiOptions {
    return {
      url: this.url,
      ...options,
    };
  }

  ro<T, O extends ClientRoOptions>(tx: ContractCall<T>, options?: O): Promise<JsonIf<O, T>> {
    return ro(tx, this.roOptions(options || {})) as Promise<JsonIf<O, T>>;
  }

  roOk<T, O extends ClientRoOptions>(
    tx: ContractCall<Response<T, any>>,
    options?: O
  ): Promise<JsonIf<O, T>> {
    return roOk(tx, this.roOptions(options || {})) as Promise<JsonIf<O, T>>;
  }

  roErr<T, O extends ClientRoOptions>(
    tx: ContractCall<Response<any, T>>,
    options?: O
  ): Promise<JsonIf<O, T>> {
    return roErr(tx, this.roOptions(options || {})) as Promise<JsonIf<O, T>>;
  }
}
