import { NgxUiLoaderConfig, SPINNER } from 'ngx-ui-loader';

export class LoaderConfigProvider {

  static getLoaderConfig(): NgxUiLoaderConfig {
    return {
      bgsColor: '#5d78ff',
      bgsOpacity: 0.1,
      fgsColor: '#5d78ff',
      fgsType: SPINNER.threeBounce,
      //logoUrl: './assets/media/logos/logo-FC-icon.png',
      masterLoaderId: this.getLoaderId(),
      pbColor: '#5d78ff',
      overlayColor: 'rgba(40,40,40,0.62)'
    }
  }

  static getLoaderId(): string {
    return Math.random().toString(36).substring(7);
  }
}
