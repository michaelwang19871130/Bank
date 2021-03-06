import { Entypo } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import { AuthContext } from 'src/auth';
import { UserType } from "src/auth/types";
import { Button, Dialog } from "src/shared/uielements";
import { dialogViewBase } from "src/theme/elements";
import { colors } from 'src/theme/colors';
import * as Routes from 'src/navigation/constants';
import { BUTTON_TYPES } from 'src/constants';

const styles = StyleSheet.create({
    dialog: {
        height: 480
    },
    pDialogBg: {},
    bDialogBg: {
        backgroundColor: colors.overlayPurple
    },
	dialogWrap: {
		paddingHorizontal: 10,
		flex: 1
	},
	dialogHeader: {
		fontSize: 30,
		lineHeight: 32,
		marginTop: 20,
		marginBottom: 10,
	},
    dialogHeaderB: {
		fontSize: 30,
		lineHeight: 32,
		marginTop: 20,
		marginBottom: 10,
        color: colors.purple
	},
	dialogBottom: {
		paddingTop: 20,
	},
    icon: {
        paddingRight: 5,
        paddingTop: 4
    },
    inlineView: {
        flexDirection: 'row',
        paddingBottom: 10
    }
});

type DwollaDialogProps = {
	visible: boolean,
	onClose: ()=>void,
}

const DwollaDialog = (props: DwollaDialogProps): JSX.Element => {
    const navigation = useNavigation();
    const { userType } = useContext(AuthContext);

    const selectBank = () => {
        props.onClose();
        userType === UserType.Customer ? navigation.navigate(Routes.SELECT_BANK) : navigation.navigate(Routes.MERCHANT_BANK_ACCOUNT);
    }

    const mainTextStyle = userType === UserType.Customer ? {color: colors.darkGreen} : {color: colors.purple};

    return (
        <Dialog 
            visible={props.visible} 
            onClose={()=>props.onClose()} 
            style={styles.dialog} 
            backgroundStyle={userType === UserType.Customer ? styles.pDialogBg : styles.bDialogBg}
        >
            <View style={dialogViewBase}>
                <View style={styles.dialogWrap}>
                    <Text style={userType === UserType.Customer ? styles.dialogHeader : styles.dialogHeaderB}>BerkShares uses Dwolla to link your business bank account.</Text>
                    <View style={styles.inlineView}>
                        <Entypo name="check" size={16} color={colors.darkGreen} style={styles.icon} />
                        <View>
                            <Text h2 style={mainTextStyle}>Secure</Text>
                            <Text style={mainTextStyle}>Secure Encryption helps protect your personal financial data</Text>
                        </View>
                    </View>
                    <View style={styles.inlineView}>
                        <Entypo name="check" size={16} color={colors.darkGreen} style={styles.icon} />
                        <View>
                            <Text h2 style={mainTextStyle}>Private</Text>
                            <Text style={mainTextStyle}>Your credentials will never be made access to BerkShares.</Text>
                        </View>
                    </View>
                    <Text style={mainTextStyle}>By selecting "continue" you agree to the Dwolla Privacy Policy</Text>
                </View>
                <View style={styles.dialogBottom}>
                    <Button
                        type={userType === UserType.Customer ? BUTTON_TYPES.DARK_GREEN : BUTTON_TYPES.PURPLE}
                        title="Continue"
                        onPress={selectBank}
                    />
                </View>
            </View>
        </Dialog>
    )
}

export default DwollaDialog;