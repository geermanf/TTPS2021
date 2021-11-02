import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Action, createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { NotifyService } from '..';
import { environment } from '../../../environments/environment';
import { RestError } from '../models/error.model';

@Injectable()
export class GlobalErrorService {
	private name = 'GlobalErrorService';
	private message = 'Error.';
	private notifyService: NotifyService;


	constructor(private injector: Injector) { }

	logError(error: any) {

		//if (!this._notifiService) {
		//    this._notifiService = this.injector.get(NotificationService);
		//}

		//if (!this._messageService) {
		//	this._messageService = this.injector.get(MessageService);
		//}

		if (!this.notifyService) {
			this.notifyService = this.injector.get(NotifyService);
		}

		const date = new Date().toString();

		const _restError = (error) as RestError;

		if (error instanceof HttpErrorResponse) {
			try {
        const errorBody = error.error as RestError;
        if (errorBody.Status === "2") { //Warning
          this.notifyService.toastWarn(errorBody.Messages.toString());

					//this.store.dispatch(new WarningError({ errorMessage: errorBody.Messages.toString() }));
				}
				else if (errorBody.Status === "3") { //Validation
          this.notifyService.toastError(errorBody.Messages.toString(), ' ');
				}
				else if (errorBody.Messages.length > 0 && errorBody.Messages[0] === "Logout") {
					//this.store.dispatch(new Logout());
				}
				else {
          this.notifyService.toastError(errorBody.Messages.toString());
				}
			} catch (ex) {

			}
		}
		else if (_restError) {
			try {
				// var errorBody = JSON.parse(error) as RestError;
				if (!environment.production) {
          this.notifyService.toastError(_restError.message);
				}
				else {
					console.error(date, 'There was a Type error.', _restError);
				}
			} catch (error) {
        if (!environment.production) {
          this.notifyService.toastError(error.message);
				}
				else {
					console.error(date, 'There was a Type error.', error.message);
				}
			}

		} else if (error instanceof TypeError) {
			console.error(date, 'There was a Type error.', error.message);
		} else if (error instanceof Error) {
			console.error(date, 'There was a general error.', error.message);
		} else {
			console.error(date, 'Nobody threw an error but something happened!', error);
		}

		console.error(date, 'Nobody threw an error but something happened!', error);
	}
}

const getErrorState = createFeatureSelector<ErrorState>(
	"error"
);

export const warningError = createSelector(
	getErrorState,
	(state: ErrorState) => state
);

export interface ErrorState {
	errorMessage: any;
}

//Action
export enum ErrorActionTypes {
	WarningError = 'WarningError'
}

export class WarningError implements Action {
	readonly type = ErrorActionTypes.WarningError;
	constructor(public payload: { errorMessage: string }) { }
}

export type ErrorActions = WarningError;
//Action

//Reducers
export interface State {
	errorMessage?: any;
}

export const initialState: State = {
	errorMessage: null
};

export function errorReducer(state = initialState, action: ErrorActions): ErrorState {
	switch (action.type) {
		case ErrorActionTypes.WarningError: {
			return {
				...state, errorMessage: action.payload.errorMessage
			}
		}
	}
}
//Reducers
