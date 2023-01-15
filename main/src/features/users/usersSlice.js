import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {getUsers as fetchUsers, getAlboms as fetchAlboms, getPosts as fetchPosts} from "../../api";

const initialState = {
  status: 'idle',
  users:[],
  posts:{},
  alboms:{},
  activeAlboms:0,
};


export const getUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await fetchUsers();
    const data = await response.json();
    return data;
  }
);
export const getPosts = createAsyncThunk(
  'users/fetchPosts',
  async (id) => {
    const response = await fetchPosts(id);
    const data = await response.json();
    return {id,data};
  }
);
export const getAlboms = createAsyncThunk(
  'users/fetchAlboms',
  async (id) => {
    const response = await fetchAlboms(id);
    const data = await response.json();
    return {id,data};
  }
);

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setActiveAlbom: (state, action) => {
      return {
        ...state,
        activeAlboms:action.payload
      }
    },
    resetActiveAlbom: (state) => {
      return {
        ...state,
        activeAlboms:0
      }
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.status = 'idle';
        state.users = action.payload;
      })
      .addCase(getPosts.pending, (state) => {
      state.status = 'loading';
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.status = 'idle';
        state.posts = {...state.posts,[action.payload.id]:action.payload.data};
      })
      .addCase(getAlboms.pending, (state) => {
      state.status = 'loading';
      })
      .addCase(getAlboms.fulfilled, (state, action) => {
        console.log(action.payload);
        state.status = 'idle';
        state.alboms = {...state.alboms,[action.payload.id]:action.payload.data};
      });
  },
});


export const { setActiveAlbom, resetActiveAlbom } = usersSlice.actions;

export const selectUsers = (state) => state.users.users;
export const selectStatus= (state) => state.users.status;
export const selectPosts= (state) => state.users.posts;
export const selectAlboms= (state) => state.users.alboms;
export const selectActiveAlbom= (state) => state.users.activeAlboms;


export default usersSlice.reducer;
