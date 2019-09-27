import { createAction } from 'redux-actions';
import { apiRequest } from '../utils';
import { apiConstants } from '../constants/constants';

const apiWillDelete = createAction(apiConstants.API_WILL_DELETE);
const apiDeleted = createAction(apiConstants.API_DELETED);
const apiDeleteFailed = createAction(apiConstants.API_DELETE_FAILED);

export const deleteResource = (resource) => {
  return (dispatch, getState) => {
    dispatch(apiWillDelete(resource));

    const { axiosConfig } = getState().api.endpoint;
    const endpoint = `${resource.type}/${resource.id}`;

    const options = {
      ... axiosConfig,
      method: 'DELETE'
    };

    return new Promise((resolve, reject) => {
      apiRequest(endpoint, options)
        .then(() => {
          dispatch(apiDeleted(resource));
          resolve();
        })
        .catch(error => {
          const err = error;
          err.resource = resource;

          dispatch(apiDeleteFailed(err));
          reject(err);
        });
    });
  };
};
