import React from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {AboutScreen} from './AboutScreen';
import {QuotesScreen} from './QuotesScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {configureStore} from './store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

const Tabs = createBottomTabNavigator();
const storage = configureStore();

const App = () =>
{
	const isDarkMode = useColorScheme() === 'dark';

	const backgroundStyle = {
		backgroundColor: '#fff',
		flex: 1,
	};

	return (
		<Provider store={storage.store}>
			<PersistGate loading={null} persistor={storage.persistor}>
				<SafeAreaView style={backgroundStyle}>
					<StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'}/>
					<NavigationContainer>
						<Tabs.Navigator
							screenOptions={({route}) => ({
									tabBarIcon: () => null
							})}
						>
							<Tabs.Screen name="About" component={AboutScreen} options={{title: 'О приложении'}}/>
							<Tabs.Screen name="Quotes" component={QuotesScreen} options={{title: 'Котировки'}}/>
						</Tabs.Navigator>
					</NavigationContainer>
				</SafeAreaView>
			</PersistGate>
		</Provider>
	);
};

export default App;
