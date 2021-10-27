import {FlatList, Text, StyleSheet, View, Dimensions, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from "react";
import {useRequest} from './useRequest';
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {setLastData} from './ducks/main';

export const QuotesScreen = () => {
	const {request} = useRequest();

	const lastDataFromStore = useSelector(state => state.main.lastData);
	const [data, setData] = useState([])
	const [error, setError] = useState(null)
	const [colorChanges, setColorChanges] = useState(false);
	const isFocused = useIsFocused();

	let fetchData = async () => {

		try {

			const result = await request('/public?command=returnTicker', {
				method: "GET",
			});

			if (result.success === false) {
				alert(result.message);
				return;
			}

			let arr = Object.keys(result).map(key => {
				let newData = result[key]
				newData.name = key
				return newData
			})


			setData(prevData => {

				/**
				 * сохраняем в storage предыдущие котировки для последующего сравнения
			 	*/
				setLastData(data);

				return arr

			});

			setError(false);

			/**
			 * ставим флаг, чтобы делать подсветку ячеек. убираем флаг через 1.5 сек
			 */
			setColorChanges(true);
			setTimeout(() => setColorChanges(false), 1500);

		} catch (e) {
			setError(true);
			// setTimeout(() => setError(false), 5000);
			console.warn('Произошла какая-то ошибка:' + e.toString());
		}
	}

	useEffect(() => {

		if (isFocused)
		{
			fetchData();
			const query = setInterval(() => {fetchData()}, 5000);
			return () => clearInterval(query);
		}
		else
		{

		}
	}, [isFocused])

	const formatValue = (val) =>
	{
		return +val > 1 ? Math.round(+val * 1000) / 1000 : val;
	}

	const item = ({item}) => {

		let changed = false;
		const previousQuoteItem = (lastDataFromStore || []).find(previousQuoteItem => previousQuoteItem.name === item.name);
		if (previousQuoteItem !== undefined &&
			(previousQuoteItem.last !== item.last || previousQuoteItem.highestBid !== item.highestBid || previousQuoteItem.percentChange !== item.percentChange))
		{
			changed = true;
		}


		return (
			<View style={[styles.spaceBetween, {backgroundColor: changed && colorChanges ? 'rgba(231, 76, 60, 0.6)' : '#fff'}]}>
				<View style={styles.tableCells}>
					<Text style={{fontSize: 10}}>{item.name}</Text>
				</View>
				<View style={styles.tableCells}>
					<Text style={{fontSize: 10}}>{formatValue(item.last)}</Text>
				</View>
				<View style={styles.tableCells}>
					<Text style={{fontSize: 10}}>{formatValue(item.highestBid)}</Text>
				</View>
				<View style={styles.tableCells}>
					<Text style={{fontSize: 10}}>{formatValue(item.percentChange)}</Text>
				</View>
			</View>
	);
	}

	return (data.length === 0 && !error) ? <ActivityIndicator style={{marginTop: 10}}/> :  (
		<FlatList
			contentContainerStyle={styles.wrapper}
			ListHeaderComponent={
				<>
					<Text style={styles.header}>Котировки</Text>
					{
						error &&
						<View style={styles.alert}>
							<Text>Ошибка</Text>
						</View>
					}

					<View style={styles.spaceBetween}>
						<View style={[styles.tableHeader]}>
							<Text style={{fontSize: 12, fontWeight: 'bold'}}>Имя тикера</Text>
						</View>
						<View style={[styles.tableHeader, {borderLeftWidth: 0}]}>
							<Text style={{fontSize: 12, fontWeight: 'bold'}}>last</Text>
						</View>
						<View style={[styles.tableHeader, {borderLeftWidth: 0}]}>
							<Text style={{fontSize: 12, fontWeight: 'bold'}}>highestBid</Text>
						</View>
						<View style={[styles.tableHeader, {borderLeftWidth: 0}]}>
							<Text style={{fontSize: 12, fontWeight: 'bold'}}>percentChange</Text>
						</View>
					</View>
				</>
			}
			data={data}
			renderItem={item}
			keyExtractor={item => item.id}
			showsVerticalScrollIndicator={false}
		/>
	);
}

const styles = StyleSheet.create({
	header: {
		fontSize: 30,
		marginBottom: 10,
	},
	spaceBetween : {
		flexDirection: "row",
		justifyContent: "space-between"
	},
	tableHeader: {
		borderColor: '#000000',
		borderWidth: 1,
		paddingHorizontal: 4,
		paddingVertical: 6,
		marginHorizontal: 0,
		width: (Dimensions.get('window').width - 40) / 4,
		height: 30,
		alignItems: 'center',
		justifyContent: 'center',
	},
	tableCells: {
		paddingHorizontal: 4,
		paddingVertical: 6,
		width: (Dimensions.get('window').width - 40) / 4,
		height: 30,
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#333333'
	},
	alert: {
		backgroundColor: 'rgba(231, 76, 60, 0.2)',
		borderColor: 'rgba(231, 76, 60, 0.6)',
		borderRadius: 10,
		borderWidth: 1,
		paddingVertical: 12,
		paddingHorizontal: 32,
		marginBottom: 10,
	},
	wrapper: {
		padding: 20,
		backgroundColor: "#fff",
	}
});
