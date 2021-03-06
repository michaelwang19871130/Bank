import { BusinessBasicVerification, CustomerBasicVerification, DwollaInfo } from './types';

export const buisnessBasicVerificationInitialState: BusinessBasicVerification = {
	story: "tell a story story",
	tag: "store tag(username)",
	avatar: "",
	type: "business type",
	owner: {
		firstName: "Owner first name",
		lastName: "Owner last name",
		address1: "Satoshi Street 21",
		address2: "Nakamoto Street 21",
		city: "Sato",
		state: "a",
		postalCode: "2100000000",
	},
	registeredBusinessName: "Registered Name",
	industry: "Industry",
	ein: "Employee Identification Number",
	address1: "Satoshi Street 21",
	address2: "Nakamoto Street 21",
	city: "Sato",
	state: "a",
	postalCode: "2100000000",
}

export const customerBasicVerificationInitialState: CustomerBasicVerification = {
	type: "personal",
	tag: "sat",
	avatar: "",
	firstName: "Satoshi",
	lastName: "Nakamoto",
	address1: "Satoshi Street 21",
	address2: "Nakamoto Street 21",
	city: "Sato",
	state: "a",
	postalCode: "2100000000",
}

export const dwollaInfoInitialState: DwollaInfo = {
	dwollaId: "d9044dbb-ef9e-411a-a8a1-a710918ef569",
	resourceUri: "",
}

export const signInInitialState = {
	email: "dev.s.ly813@gmail.com",
	password: "Password123!@#",
}

export const signUpInitialState = {
	email: "esraa@humanity.cash",
	password: "Esraa@keyko1",
	confirmPassword: "Esraa@keyko1",
}
