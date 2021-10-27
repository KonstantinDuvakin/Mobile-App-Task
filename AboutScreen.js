import {ScrollView, StyleSheet, Text, View} from "react-native";
import React from "react";

export const AboutScreen = () => {

	return (
		<ScrollView bounces={false}
		            сontentContainerStyle={{backgroundColor: "#fff"}}
		            showsVerticalScrollIndicator={false}>
			<View style={styles.screen}>
				<Text style={styles.header}>О приложении</Text>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	screen: {
		paddingHorizontal: 20,
		paddingTop: 30,
	},
	header: {
		fontSize: 30,
		marginBottom: 10,
	}
})