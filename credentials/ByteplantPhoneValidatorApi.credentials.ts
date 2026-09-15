import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class ByteplantPhoneValidatorApi implements ICredentialType {
	name = 'byteplantPhoneValidatorApi';
	displayName = 'Byteplant Phone Validator API';

	// TODO: add the correct documentation link
	documentationUrl = 'https://www.phone-validator.net/api.html';

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
