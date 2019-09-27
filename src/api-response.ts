import { readEndpoint } from './actions/read-endpoint';

export interface ApiResponse {
  body: any,
  dispatch: any,
  nextUrl: string,
  prevUrl: string
}

export class ApiResponse {
  constructor(response: any, dispatch: any, nextUrl: string, prevUrl: string) {
    this.body = response;
    this.dispatch = dispatch;
    this.nextUrl = nextUrl;
    this.prevUrl = prevUrl;
  }

  loadNext = () => this.dispatch(readEndpoint(this.nextUrl));
  loadPrev = () => this.dispatch(readEndpoint(this.prevUrl));
}
