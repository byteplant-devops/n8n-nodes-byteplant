import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class ByteplantAddressValidatorApi implements ICredentialType {
	name = 'byteplantAddressValidatorApi';
	displayName = 'Byteplant Address Validator API';

	documentationUrl = 'https://www.address-validator.net/api.html';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			description:
				"Your address-validator API key. If you don't already have one, go to [Address Validator website](https://www.address-validator.net/api.html) and register to receive an API key.",
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
			baseURL: 'https://api.address-validator.net',
			url: '/api/verify',
			qs: {},
			json: true,
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					key: 'status',
					value: 'VALID',
					message: 'API key is valid',
				},
			},
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
