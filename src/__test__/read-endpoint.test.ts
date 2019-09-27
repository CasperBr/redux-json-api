import { createAction } from 'redux-actions';
import {
  reducer,
  
} from '..';

const apiRead = createAction('API_READ');

const state = {
  endpoint: {
    axiosConfig: {}
  },
  users: {
    data: [
      {
        type: 'users',
        id: '1',
        attributes: {
          name: 'John Doe'
        },
        relationships: {
          companies: {
            data: null
          }
        }
      },
      {
        type: 'users',
        id: '2',
        attributes: {
          name: 'Emily Jane'
        },
        relationships: {
          companies: {
            data: null
          }
        }
      }
    ]
  },
  transactions: {
    data: [
      {
        type: 'transactions',
        id: '34',
        attributes: {
          description: 'ABC',
          createdAt: '2016-02-12T13:34:01+0000',
          updatedAt: '2016-02-19T11:52:43+0000',
        },
        relationships: {
          task: {
            data: null
          }
        },
        links: {
          self: 'http://localhost/transactions/34'
        }
      }
    ]
  },
  isCreating: 0,
  isReading: 0,
  isUpdating: 0,
  isDeleting: 0
};

const taskWithTransaction = {
  data: {
    type: 'tasks',
    id: '43',
    attributes: {
      name: 'ABC',
      createdAt: '2016-02-19T11:52:43+0000',
      updatedAt: '2016-02-19T11:52:43+0000'
    },
    relationships: {
      taskList: {
        data: {
          type: 'taskLists',
          id: '1'
        }
      },
      transaction: {
        data: {
          type: 'transactions',
          id: '34'
        }
      }
    },
    links: {
      self: 'http://localhost/tasks/43'
    }
  }
};

const readResponse = {
  data: [
    taskWithTransaction.data
  ]
};

const readResponseWithIncluded = {
  ... readResponse,
  included: [
    {
      type: 'transactions',
      id: '35',
      attributes: {
        description: 'DEF',
        createdAt: '2016-02-12T13:35:01+0000',
        updatedAt: '2016-02-19T11:52:43+0000',
      },
      relationships: {
        task: {
          data: null
        }
      },
      links: {
        self: 'http://localhost/transactions/35'
      }
    }
  ]
};

const responseDataWithSingleResource = {
  data: {
    type: 'companies',
    id: '1',
    attributes: {
      name: 'Dixie.io',
      slug: 'dixie.io',
      createdAt: '2016-04-08T08:42:45+0000',
      updatedAt: '2016-04-08T08:42:45+0000',
      role: 'bookkeeper'
    },
    relationships: {
      users: {
        data: [{
          type: 'users',
          id: '1'
        }]
      },
      employees: {
        data: [{
          type: 'users',
          id: '1'
        }]
      },
      bookkeepers: {
        data: [{
          type: 'users',
          id: '4'
        }]
      },
      bookkeeper_state: {
        data: {
          type: 'bookkeeper_state',
          id: '2'
        }
      }
    },
    links: {
      self: 'http:\/\/gronk.app\/api\/v1\/companies\/1'
    }
  },
  included: [{
    type: 'users',
    id: '1',
    attributes: {
      name: 'Ron Star',
      email: 'stefan+stefan+ronni-dixie.io-dixie.io@dixie.io',
      createdAt: '2016-04-08T08:42:45+0000',
      updatedAt: '2016-04-13T08:28:58+0000'
    },
    relationships: {
      companies: {
        data: [{
          type: 'companies',
          id: '1'
        }]
      }
    }
  }]
};

const responseDataWithOneToManyRelationship = {
  data: [
    {
      type: 'companies',
      id: '1',
      attributes: {
        name: 'Dixie.io',
        slug: 'dixie.io',
        createdAt: '2016-04-08T08:42:45+0000',
        updatedAt: '2016-04-08T08:42:45+0000'
      },
      relationships: {
        user: {
          data: {
            type: 'users',
            id: '1'
          }
        }
      },
      links: {
        self: 'http:\/\/gronk.app\/api\/v1\/companies\/1'
      }
    },
    {
      type: 'companies',
      id: '2',
      attributes: {
        name: 'Dixie.io',
        slug: 'dixie.io',
        createdAt: '2016-04-08T08:42:45+0000',
        updatedAt: '2016-04-08T08:42:45+0000'
      },
      relationships: {
        user: {
          data: {
            type: 'users',
            id: '1'
          }
        }
      },
      links: {
        self: 'http:\/\/gronk.app\/api\/v1\/companies\/2'
      }
    }
  ]
};

describe('Reading resources', () => {
  it('should append read resources to state', () => {
    const updatedState = reducer(state, apiRead(readResponse));
    expect(typeof updatedState.tasks).toBe('object');
    expect(Object.keys(updatedState.tasks.tasks).length).toEqual(1);
  });

  it('should append included resources in state', () => {
    const updatedState = reducer(state, apiRead(readResponseWithIncluded));
    expect(typeof updatedState.transactions).toBe('object');
    expect(Object.keys(updatedState.transactions.transactions).length).toEqual(state.transactions.data.length + 1);
  });

  it('should handle response where data is an object', () => {
    const updatedState = reducer(undefined, apiRead(responseDataWithSingleResource));
    expect(typeof updatedState.users).toBe('object');
    expect(typeof updatedState.companies).toBe('object');
  });

  it('should handle response with a one to many relationship', () => {
    const updatedState = reducer(state, apiRead(responseDataWithOneToManyRelationship));
    expect(typeof updatedState.users).toBe('object');
    expect(typeof updatedState.companies).toBe('object');
    // expect(typeof updatedState.users.users[1].relationships.companies.data).toBe('array');
  });
});