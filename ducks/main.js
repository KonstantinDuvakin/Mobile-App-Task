import {createAction, createReducer} from "redux-act";

export const setLastData = createAction('действие - сохранить в store предыдущие данные котировок');

/**
 * изначальное состояние куска main
 */
const initialMainState =  {
	lastData : [],
};

/**
 * reducer - описание логики взаимодействия со стором через действия
 */
const main = createReducer({
    [setLastData]: (state, payload) => ({...state, lastData: payload}),
}, initialMainState);

export default main;
