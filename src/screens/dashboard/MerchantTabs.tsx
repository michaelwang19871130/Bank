import { EvilIcons, Feather } from '@expo/vector-icons';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import React, { useContext, useState } from 'react';
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Drawer } from 'react-native-paper';
import { AuthContext } from 'src/auth';
import { UserType } from 'src/auth/types';
import { useUserDetails } from "src/hooks";
import { BUTTON_TYPES } from 'src/constants';
import * as Routes from 'src/navigation/constants';
import MerchantCashoutAmount from "src/screens/merchantCashout/MerchantCashoutAmount";
import MerchantLoadup from "src/screens/merchantLoadup/MerchantLoadup";
import MerchantPayoutSelection from 'src/screens/merchantPayout/MerchantPayoutSelection';
import Report from 'src/screens/report/Report';
import { Button, Dialog } from "src/shared/uielements";
import { colors } from "src/theme/colors";
import { baseHeader, dialogViewBase, wrappingContainerBase } from "src/theme/elements";
import Translation from 'src/translation/en.json';
import MerchantQRCodeScan from "../merchantPayment/MerchantQRCodeScan";
import MerchantRequest from "../merchantPayment/MerchantRequest";
import MerchantReturnQRCodeScan from "../merchantPayment/MerchantReturnQRCodeScan";
import MerchantDashboard from "./MerchantDashboard";
import MerchantSettings from "src/screens/merchantSettings/MerchantSettings";
import MerchantSettingsHelpAndContact from 'src/screens/merchantSettings/MerchantSettingsHelpAndContact';
import { useBusinessWallet, useBanks } from 'src/hooks';

const styles = StyleSheet.create({
	headerText: {
		fontSize: 32,
		lineHeight: 35,
		color: colors.purple
	},
	drawerWrap: {
		flex: 1,
		backgroundColor: colors.greyedPurple,
		paddingVertical: 30
	},
	imageView: {
		justifyContent: 'center',
		alignItems: 'center',
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: colors.white
	},
	image: {
		width: '70%',
		height: '70%',
		borderRadius: 20
	},
	infoView: {
		paddingVertical: 10
	},
	userInfo: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 5,
		paddingHorizontal: 10
	},
	usernameView: {
		paddingHorizontal: 10
	},
	fadeText: {
		color: colors.purple
	},
	berkAmount: {
		fontSize: 32,
		color: colors.lightBg,
		paddingHorizontal: 15,
		paddingTop: 10
	},
	bottomSection: {
		paddingBottom: 10
	},
	inlineView: {
		flexDirection: 'row'
	},
	detailText: {
		fontSize: 16,
		color: colors.bodyText
	},
	dialogBg: {
		backgroundColor: colors.overlayPurple
	}
});

type ReturnPaymentDialogProps = {
	visible: boolean,
	onConfirm: () => void,
	onCancel: () => void
}

const ReturnPaymentDialog = (props: ReturnPaymentDialogProps) => {
	return (
		<Dialog visible={props.visible} onClose={()=>props.onCancel()} backgroundStyle={styles.dialogBg}>
			<View style={dialogViewBase}>
				<View style={wrappingContainerBase}>
					<View style={ baseHeader }>
						<Text style={styles.headerText}>
							{Translation.PAYMENT.SCAN_RECIPIENTS_QR}
						</Text>
					</View>
					<Text style={styles.detailText}>
						{Translation.PAYMENT.SCAN_RECIPIENTS_QR_DETAIL}
					</Text>
				</View>
				<View>
					<Button
						type={BUTTON_TYPES.PURPLE}
						title="Scan"
						onPress={()=>props.onConfirm()}
					/>
				</View>
			</View>
		</Dialog>
	)
}

type CashierViewDialogProps = {
	visible: boolean,
	onConfirm: ()=>void,
	onCancel: ()=>void
}

const CashierViewDialogDialog = (props: CashierViewDialogProps) => {
	return (
		<Dialog visible={props.visible} onClose={()=>props.onCancel()} backgroundStyle={styles.dialogBg}>
			<View style={dialogViewBase}>
				<View style={wrappingContainerBase}>
					<View style={ baseHeader }>
						<Text style={styles.headerText}>{Translation.CASHIER.CASHIER_VIEW_SWITCH}</Text>
					</View>
					<Text style={styles.detailText}>{Translation.CASHIER.CASHIER_VIEW_SWITCH_DETAIL}</Text>
				</View>
				<View>
					<Button
						type={BUTTON_TYPES.PURPLE}
						title={Translation.BUTTON.SWITCH_VIEW}
						onPress={()=>props.onConfirm()}
					/>
				</View>
			</View>
		</Dialog>
	)
}

type BankLinkDialogProps = {
	visible: boolean,
	onConfirm: ()=>void,
	onCancel: ()=>void
}

const BankLinkDialog = (props: BankLinkDialogProps) => {
	return (
		<Dialog visible={props.visible} onClose={()=>props.onCancel()} backgroundStyle={styles.dialogBg}>
			<View style={dialogViewBase}>
				<View style={wrappingContainerBase}>
					<View style={ baseHeader }>
						<Text style={styles.headerText}>{Translation.PAYMENT.PAYMENT_NO_BANK_TITLE}</Text>
					</View>
					<Text style={styles.detailText}>{Translation.PAYMENT.PAYMENT_NO_BANK_DETAIL}</Text>
				</View>
				<View>
				<Button
						type={BUTTON_TYPES.PURPLE}
						title={Translation.BUTTON.LINK_BANK}
						onPress={props.onConfirm}
					/>
				</View>
			</View>
		</Dialog>
	)
}

const DrawerContent = (props: DrawerContentComponentProps) => {
	const { userAttributes } = useContext(AuthContext);
	const { signOut, updateUserType, completedCustomerVerification } = useContext(AuthContext);
	const { hasBusinessBank } = useBanks();
	const { wallet } = useBusinessWallet();
	const { authorization } = useUserDetails();
	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const [isCashierView, setIsCashierView] = useState<boolean>(false);
	const [isBankDialog, setIsBankDialog] = useState<boolean>(false);

	const onScanConfirm = () => {
		setIsVisible(false);
		props.navigation.navigate(Routes.MERCHANT_RETURN_QRCODE_SCAN);
	}

	const onScanCancel = () => {
		setIsVisible(false);
	}

	const onCashierViewConfirm = () => {
		setIsCashierView(false);
		updateUserType(UserType.Cashier);
	}

	const onCashierViewCancel = () => {
		setIsCashierView(false);
	}

	const onBankDialogConfirm = () => {
		setIsBankDialog(false);
		props.navigation.navigate(Routes.MERCHANT_BANK_ACCOUNT);
	}

	const onBankDialogCancel = () => {
		setIsBankDialog(false);
	}

	const onPersonal = () => {
		updateUserType(UserType.Customer);
	}

	const userTag = userAttributes?.["custom:personal.tag"] || undefined
	const businessTag = userAttributes?.["custom:business.tag"] || undefined

	return (
		<View style={styles.drawerWrap}>
			<DrawerContentScrollView {...props}>
				<View>
					<View style={styles.infoView}>
						<TouchableWithoutFeedback
							onPress={() => setIsExpanded(!isExpanded)}>
							<View style={styles.userInfo}>
								<View style={styles.imageView}>
									<Image
										source={require("../../../assets/images/placeholder5.png")}
										style={styles.image}
									/>
								</View>
								<View style={styles.usernameView}>
									<Text>{businessTag}</Text>
									{(completedCustomerVerification || isCashierView) && <View style={styles.inlineView}>
										<Text style={styles.fadeText}>
											Switch account
										</Text>
										<EvilIcons
											name="chevron-down"
											size={26}
											color={colors.purple}
										/>
									</View>}
								</View>
							</View>
						</TouchableWithoutFeedback>
						{isExpanded && (
							<View>
								{userTag ? (
									<TouchableWithoutFeedback
										onPress={onPersonal}>
										<View style={styles.userInfo}>
											<View style={styles.imageView}>
												<Image
													source={require("../../../assets/images/placeholder5.png")}
													style={styles.image}
												/>
											</View>
											<View style={styles.usernameView}>
												<Text>{userTag}</Text>
											</View>
										</View>
									</TouchableWithoutFeedback>
								) : null}
								{authorization.cashierView ? (<TouchableWithoutFeedback
									onPress={() => setIsCashierView(true)}>
									<View style={styles.userInfo}>
										<View style={styles.imageView}>
											<Image
												source={require("../../../assets/images/placeholder5.png")}
												style={styles.image}
											/>
										</View>
										<View style={styles.usernameView}>
											<Text>Cashier</Text>
										</View>
									</View>
								</TouchableWithoutFeedback>
								) : null}
							</View>
						)}
					</View>
					<Text style={styles.berkAmount}>B$ {wallet.availableBalance}</Text>
					<Drawer.Section>
						<DrawerItem
							label={Translation.TABS.RECEIVE_PAYMENT}
							onPress={() => hasBusinessBank ?  props.navigation.navigate(Routes.MERCHANT_REQUEST) : setIsBankDialog(true)}
						/>
						<DrawerItem
							label={Translation.TABS.SCAN_TO_PAY}
							onPress={() => hasBusinessBank ?  props.navigation.navigate(Routes.MERCHANT_QRCODE_SCAN) : setIsBankDialog(true)}
						/>
						<DrawerItem
							label={Translation.TABS.MAKE_RETURN}
							onPress={() => hasBusinessBank ?  setIsVisible(true) : setIsBankDialog(true)}
						/>
						<DrawerItem
							label={Translation.TABS.LOADUP}
							onPress={() => hasBusinessBank ?  props.navigation.navigate(Routes.MERCHANT_LOADUP) : setIsBankDialog(true)}
						/>
						<DrawerItem
							label={Translation.TABS.SEND_TO_SOMEONE}
							onPress={() => hasBusinessBank ?  props.navigation.navigate(Routes.MERCHANT_PAYOUT_SELECTION) : setIsBankDialog(true)}
						/>
						<DrawerItem
							label={Translation.TABS.CASHOUT}
							onPress={() => hasBusinessBank ?  props.navigation.navigate(Routes.MERCHANT_CASHOUT_AMOUNT) : setIsBankDialog(true)}
						/>
					</Drawer.Section>
					<Drawer.Section>
						<DrawerItem
							label={Translation.TABS.REPORT}
							onPress={() => {
								props.navigation.navigate(Routes.REPORT);
							}}
						/>
						<DrawerItem
							label={Translation.TABS.SETTINGS}
							onPress={() => {
								props.navigation.navigate(
									Routes.MERCHANT_SETTINGS
								);
							}}
						/>
						<DrawerItem
							label={Translation.TABS.HELP_AND_CONTACT}
							onPress={() => {
								props.navigation.navigate(
									Routes.MERCHANT_HELP_AND_CONTACT
								);
							}}
						/>
					</Drawer.Section>
				</View>
			</DrawerContentScrollView>
			<Drawer.Section style={styles.bottomSection}>
				<DrawerItem
					icon={() => (
						<Feather
							name="log-out"
							size={24}
							color={colors.purple}
						/>
					)}
					label={Translation.TABS.SIGN_OUT}
					onPress={signOut}
				/>
			</Drawer.Section>
			{isVisible && (
				<ReturnPaymentDialog
					visible={isVisible}
					onConfirm={onScanConfirm}
					onCancel={onScanCancel}
				/>
			)}
			{isCashierView && (
				<CashierViewDialogDialog
					visible={isCashierView}
					onConfirm={onCashierViewConfirm}
					onCancel={onCashierViewCancel}
				/>
			)}
			{isBankDialog && (
				<BankLinkDialog 
					visible={isBankDialog}
					onConfirm={onBankDialogConfirm}
					onCancel={onBankDialogCancel}
				/>
			)}
		</View>
	);
}

const DrawerNav = createDrawerNavigator();

const MerchantTabs: React.FC = () => {
	return (
		<DrawerNav.Navigator initialRouteName={Routes.MERCHANT_DASHBOARD} drawerContent={ props => <DrawerContent {...props} />}>
			<DrawerNav.Screen name={Routes.MERCHANT_DASHBOARD} component={MerchantDashboard} />
			<DrawerNav.Screen name={Routes.MERCHANT_REQUEST} component={MerchantRequest} />
			<DrawerNav.Screen name={Routes.MERCHANT_QRCODE_SCAN} component={MerchantQRCodeScan} />
			<DrawerNav.Screen name={Routes.MERCHANT_RETURN_QRCODE_SCAN} component={MerchantReturnQRCodeScan} />
			<DrawerNav.Screen name={Routes.MERCHANT_CASHOUT_AMOUNT} component={MerchantCashoutAmount} />
			<DrawerNav.Screen name={Routes.MERCHANT_LOADUP} component={MerchantLoadup} />
			<DrawerNav.Screen name={Routes.MERCHANT_PAYOUT_SELECTION} component={MerchantPayoutSelection} />
			<DrawerNav.Screen name={Routes.REPORT} component={Report} />
			<DrawerNav.Screen name={Routes.MERCHANT_SETTINGS} component={MerchantSettings} />
			<DrawerNav.Screen name={Routes.MERCHANT_HELP_AND_CONTACT} component={MerchantSettingsHelpAndContact} />
		</DrawerNav.Navigator>
	);
}

export default MerchantTabs