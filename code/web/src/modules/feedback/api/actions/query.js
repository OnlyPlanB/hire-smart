// Imports
import axios from 'axios'
import queryBuilder from 'gql-query-builder'

// App Imports
import { API_URL } from '../../../../setup/config/env'
import { MESSAGE_SHOW } from '../../../common/api/actions'
import { LIST_DONE, LIST_REQUEST, LIST_RESPONSE } from './types'

// Actions

// Get list
export function getList(isLoading = true) {
  return async dispatch => {
    dispatch({
      type: LIST_REQUEST,
      isLoading
    })

    try {
      const { data } = await axios.post(API_URL, queryBuilder({
        type: 'query',
        operation: 'invitesByOrganization',
        fields: ['_id', 'name', 'email', 'createdAt']
      }))

      if(data.errors && data.errors.length > 0) {
        dispatch({
          type: MESSAGE_SHOW,
          message: data.errors[0].message
        })
      } else {
        dispatch({
          type: LIST_RESPONSE,
          list: data.data.invitesByOrganization
        })
      }
    } catch(error) {
      dispatch({
        type: MESSAGE_SHOW,
        message: 'Some error occurred. Please try again.'
      })
    } finally {
      dispatch({
        type: LIST_DONE,
        isLoading: false
      })
    }
  }
}

// Get by id
export function get(id) {
  return dispatch => {
    return axios.post(API_URL, queryBuilder({
      type: 'query',
      operation: 'invite',
      data: { id },
      fields: ['_id', 'organizationId { _id, name }', 'email', 'name', 'createdAt']
    }))
  }
}
