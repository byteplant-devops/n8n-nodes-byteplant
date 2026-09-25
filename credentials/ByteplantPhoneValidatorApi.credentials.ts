import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class ByteplantPhoneValidatorApi implements ICredentialType {
	name = 'byteplantPhoneValidatorApi';
	displayName = 'Byteplant Phone Validator API';

	documentationUrl = 'https://www.byteplant.com/phone-validator/api.html';

	icon = {
		light: 'file:../nodes/Byteplant/byteplant-phone-validator.png',
		dark: 'file:../nodes/Byteplant/byteplant-phone-validator.png',
	} as const;

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			description:
				"Your phone-validator API key. If you don't already have one, go to [Phone Validator website](https://www.phone-validator.net/api.html) and register to receive an API key.",
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				APIKey: '={{ $credentials.apiKey }}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.phone-validator.net',
			url: '/api/v2/verify',
			qs: {
				PhoneNumber: 'test',
			},
			json: true,
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					key: 'status',
					value: 'API_KEY_INVALID_OR_DEPLETED',
					message: 'API key is invalid or depleted',
				},
			},
		],
	};
}
