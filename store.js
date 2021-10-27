import {persistReducer, persistStore} from "redux-persist";
import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import main, {setLastData} from './ducks/main';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function configureStore ()
{
    const middlewares = [];

    const rootReducer = combineReducers({
        main : persistReducer({key: "main", storage : AsyncStorage}, main),
    });

    const enhancer = compose(applyMiddleware(...middlewares));
    const store = createStore(rootReducer, enhancer);
    const persistor = persistStore(store);

    assignActionsCreators(store);

    return {store, persistor};
}

/**
 * связка действия - стор, чтобы действия можно было использовать глобальное без обертывания каждого компонента или экрана в спец. функцию
 */
function assignActionsCreators (store) {
	setLastData.assignTo(store);
}
