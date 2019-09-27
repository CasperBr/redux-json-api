import { createAction } from 'redux-actions';
import { apiRequest } from '../utils';
import { apiConstants } from '../constants/constants';

const apiWillUpdate = createAction(apiConstants.API_WILL_UPDATE);
const apiUpdated = createAction(apiConstants.API_UPDATED);
const apiUpdateFailed = createAction(apiConstants.API_UPDATE_FAILED);

export const updateResource = (resource) => {
  return (dispatch, getState) => {
    dispatch(apiWillUpdate(resource));

    const { axiosConfig } = getState().api.endpoint;
    const endpoint = `${resource.type}/${resource.id}`;

    const options = {
      ... axiosConfig,
      method: 'PATCH',
      data: {
        data: resource
      }
    };

    return new Promise((resolve, reject) => {
      apiRequest(endpoint, options)
        .then(json => {
          dispatch(apiUpdated(json));
          resolve(json);
        })
        .catch(error => {
          const err = error;
          err.resource = resource;

          dispatch(apiUpdateFailed(err));
          reject(err);
        });
    });
  };
};
