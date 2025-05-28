import { AsyncThunk, UnknownAction } from '@reduxjs/toolkit';

type BaseAsyncThunk = AsyncThunk<unknown, unknown, any>;

type PendingAction = ReturnType<BaseAsyncThunk['pending']>;
type FulfilledAction = ReturnType<BaseAsyncThunk['fulfilled']>;
type RejectedAction = ReturnType<BaseAsyncThunk['rejected']>;

const hasPrefix = (action: UnknownAction, prefix: string): boolean =>
  action.type.startsWith(prefix);

const isPending = (action: UnknownAction): action is PendingAction =>
  action.type.endsWith('/pending');

const isFulfilled = (action: UnknownAction): action is FulfilledAction =>
  action.type.endsWith('/fulfilled');

const isRejected = (action: UnknownAction): action is RejectedAction =>
  action.type.endsWith('/rejected');

export const isActionPending =
  (prefix: string) =>
  (action: UnknownAction): action is PendingAction =>
    hasPrefix(action, prefix) && isPending(action);

export const isActionRejected =
  (prefix: string) =>
  (action: UnknownAction): action is RejectedAction =>
    hasPrefix(action, prefix) && isRejected(action);

export const isActionFulfilled =
  (prefix: string) =>
  (action: UnknownAction): action is FulfilledAction =>
    hasPrefix(action, prefix) && isFulfilled(action);
