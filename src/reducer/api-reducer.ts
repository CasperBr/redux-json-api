import { createAction, handleActions } from 'redux-actions';
import imm from 'object-path-immutable';
import { apiConstants } from '../constants/constants';

import {
  addLinksToState,
  removeResourceFromState,
  updateOrInsertResourcesIntoState,
  setIsInvalidatingForExistingResource,
  ensureResourceTypeInState,
  addNormalizationToState
} from '../state-mutation';

// Resource isInvalidating values
export const IS_DELETING = 'IS_DELETING';
export const IS_UPDATING = 'IS_UPDATING';

// Action creators
export const setAxiosConfig = createAction(apiConstants.API_SET_AXIOS_CONFIG);
export const hydrateStore = createAction(apiConstants.API_HYDRATE);

export const reducer = handleActions({
  /**
   * Config reducers
   */
  [apiConstants.API_SET_AXIOS_CONFIG]: (state, { payload: axiosConfig }) => {
    return imm(state).set(['endpoint', 'axiosConfig'], axiosConfig).value();
  },

  /**
   * Read reducers
   */
  [apiConstants.API_READ]: (state, { payload }) => {
    const resources = (
      Array.isArray(payload.data)
        ? payload.data
        : [payload.data]
    ).concat(payload.included || []);

    const newState = updateOrInsertResourcesIntoState(state, resources);
    const linkedState = addLinksToState(newState, payload.links, payload.options);
    const normalizedState = addNormalizationToState(linkedState);

    return imm(normalizedState)
      .set('isReading', state.isReading - 1)
      .value();
  },

  [apiConstants.API_READ_FAILED]: (state) => {
    console.log("API Reading FAILED");

    return imm(state).set(['isReading'], state.isReading - 1).value();
  },

  /**
   * Hydrate reducers
   */
  [apiConstants.API_HYDRATE]: (state, { payload: resources }) => {
    console.log("Hydrating");
    const entities = Array.isArray(resources.data) ? resources.data : [resources.data];

    const newState = updateOrInsertResourcesIntoState(
      state,
      entities.concat(resources.included || [])
    );

    return imm(newState).value();
  },

  /**
   * Create reducers
   */
  [apiConstants.API_WILL_CREATE]: (state) => {
    return imm(state).set(['isCreating'], state.isCreating + 1).value();
  },

  [apiConstants.API_CREATED]: (state, { payload: resources }) => {
    const entities = Array.isArray(resources.data) ? resources.data : [resources.data];

    const newState = updateOrInsertResourcesIntoState(
      state,
      entities.concat(resources.included || [])
    );

    return imm(newState)
      .set('isCreating', state.isCreating - 1)
      .value();
  },

  [apiConstants.API_CREATE_FAILED]: (state) => {
    return imm(state).set(['isCreating'], state.isCreating - 1).value();
  },

  [apiConstants.API_WILL_READ]: (state) => {
    return imm(state).set(['isReading'], state.isReading + 1).value();
  },

  [apiConstants.API_WILL_UPDATE]: (state, { payload: resource }) => {
    const { type, id } = resource;

    const newState = ensureResourceTypeInState(state, type);

    return setIsInvalidatingForExistingResource(newState, { type, id }, IS_UPDATING)
      .set('isUpdating', state.isUpdating + 1)
      .value();
  },

  [apiConstants.API_UPDATED]: (state, { payload: resources }) => {
    const entities = Array.isArray(resources.data) ? resources.data : [resources.data];

    const newState = updateOrInsertResourcesIntoState(
      state,
      entities.concat(resources.included || [])
    );

    return imm(newState)
      .set('isUpdating', state.isUpdating - 1)
      .value();
  },

  [apiConstants.API_UPDATE_FAILED]: (state, { payload: { resource } }) => {
    const { type, id } = resource;

    return setIsInvalidatingForExistingResource(state, { type, id }, IS_UPDATING)
      .set('isUpdating', state.isUpdating - 1)
      .value();
  },

  [apiConstants.API_WILL_DELETE]: (state, { payload: resource }) => {
    const { type, id } = resource;

    return setIsInvalidatingForExistingResource(state, { type, id }, IS_DELETING)
      .set('isDeleting', state.isDeleting + 1)
      .value();
  },

  [apiConstants.API_DELETED]: (state, { payload: resource }) => {
    return removeResourceFromState(state, resource)
      .set('isDeleting', state.isDeleting - 1)
      .value();
  },

  [apiConstants.API_DELETE_FAILED]: (state, { payload: { resource } }) => {
    const { type, id } = resource;

    return setIsInvalidatingForExistingResource(state, { type, id }, IS_DELETING)
      .set('isDeleting', state.isDeleting - 1)
      .value();
  }

}, {
  isCreating: 0,
  isReading: 0,
  isUpdating: 0,
  isDeleting: 0,
  endpoint: {
    axiosConfig: {}
  }
});