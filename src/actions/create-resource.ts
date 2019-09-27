import { createAction } from 'redux-actions';
import { apiConstants } from '../constants/constants';
import { apiRequest } from '../utils';

const apiWillCreate = createAction(apiConstants.API_WILL_CREATE);
const apiCreated = createAction(apiConstants.API_CREATED);
const apiCreateFailed = createAction(apiConstants.API_CREATE_FAILED);

export const createResource = (resource) => {
  return (dispatch, getState) => {
    dispatch(apiWillCreate(resource));

    const { axiosConfig } = getState().api.endpoint;
    const options = {
      ... axiosConfig,
      method: 'POST',
      data: JSON.stringify({
        data: resource
      })
    };

    return new Promise((resolve, reject) => {
      apiRequest(resource.type, options).then(json => {
        dispatch(apiCreated(json));
        resolve(json);
      }).catch(error => {
        const err = error;
        err.resource = resource;

        dispatch(apiCreateFailed(err));
        reject(err);
      });
    });
  };
};