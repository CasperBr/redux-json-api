import { createAction } from 'redux-actions';
import { apiConstants } from '../constants/constants';
import { apiRequest, getPaginationUrl } from '../utils';
import { ApiResponse } from '../api-response';

const apiRead = createAction(apiConstants.API_READ);
const apiReadFailed = createAction(apiConstants.API_READ_FAILED);

export const readEndpoint = (endpoint: string, {
  options = {
    indexLinks: undefined
  }
} = {},
  successCb?: () => void,
  failureCb?: () => void
) => {
  return (dispatch: any, getState: any) => {
    const { axiosConfig } = getState().api.endpoint;

    return new Promise((resolve, reject) => {
      apiRequest(endpoint, axiosConfig)
        .then(json => {
          dispatch(apiRead({ endpoint, options, ...json }));
          
          const nextUrl = getPaginationUrl(json, 'next', axiosConfig.baseURL);
          const prevUrl = getPaginationUrl(json, 'prev', axiosConfig.baseURL);

          successCb();
          
          resolve(new ApiResponse(json, dispatch, nextUrl, prevUrl));
        })
        .catch(error => {
          const err = error;
          err.endpoint = endpoint;

          dispatch(apiReadFailed(err));

          failureCb();

          reject(err);
        });
    });
  };
};
