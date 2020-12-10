import {
  PartialTxParams,
  WalletSubproviderErrors,
} from '../types';

import { BaseWalletSubprovider } from './base_wallet_subprovider';

declare global {
  interface Window {
    web3: any;
    injectWeb3: any;
  }
}

export interface txParams {
  Txtype?: string;
  from?: string;
  to: string;
  data?: string;
  value?: number | string;
  gasPrice?: number | string;
  gasLimit?: number | string;
  nonce?: string;
}

export class WanWalletSubprovider extends BaseWalletSubprovider {

  constructor() {
    super();
  }

  public async getAccountsAsync(): Promise<string[]> {
    return new Promise<string[]>(async (resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error(WalletSubproviderErrors.MethodNotSupported));
      }

      window.web3.eth.getAccounts((err: Error, res: string[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  public async signTransactionAsync(txData: PartialTxParams): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error(WalletSubproviderErrors.MethodNotSupported));
      }
      window.web3.eth.signTx(txData, (err: Error, res: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  public async signPersonalMessageAsync(data: string, address: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error(WalletSubproviderErrors.MethodNotSupported));
      }
      window.web3.eth.sign(data, address, (err: Error, res: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  public async signTypedDataAsync(address: string, typedData: any): Promise<string> {
    throw new Error(WalletSubproviderErrors.MethodNotSupported);
  }

  private isSupported(): boolean {
    if (!!window.web3 && !!window.web3.eth && !!window.injectWeb3) {
      return true;
    } else {
      return false;
    }
  }
}
