import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
	ICredentialTestRequest,
} from 'n8n-workflow';

export class ByteplantEmailValidatorApi implements ICredentialType {
	name = 'byteplantEmailValidatorApi';
	displayName = 'Byteplant Email Validator API';

	documentationUrl = 'https://www.email-validator.net/api.html';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			description:
				"Your email-validator API key. If you don't already have one, go to [Email Validator website](https://www.email-validator.net/api.html) and register to receive an API key.",
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
			baseURL: 'https://api.email-validator.net',
			url: '/api/verify',
			qs: {
				EmailAddress: 'test',
			},
			json: true,
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					key: 'status',
					value: 119,
					message: 'API key is invalid or depleted',
				},
			},
		],
	};
}
